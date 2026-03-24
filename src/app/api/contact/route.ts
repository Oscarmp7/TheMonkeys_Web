import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import {
  validateContactForm,
  sanitize,
  escapeHtml,
  MAX_LENGTHS,
} from "@/lib/validation";
import { SITE } from "@/lib/site";

// Initialize clients lazily so missing env vars don't break builds
function getRatelimiter() {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
  });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const ALLOWED_ORIGINS = [
  "https://themonkeys.do",
  "https://www.themonkeys.do",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean) as string[];

export async function POST(req: NextRequest) {
  // 1. Origin check (skip in development)
  if (process.env.NODE_ENV === "production") {
    const origin = req.headers.get("origin") ?? "";
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // 2. Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Honeypot: if website field is filled, fake success
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 4. Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ratelimiter = getRatelimiter();
    const { success } = await ratelimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  // 5. Validate
  const values = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    company: String(body.company ?? ""),
    service: String(body.service ?? ""),
    message: String(body.message ?? ""),
  };

  const { valid, errors } = validateContactForm(values);
  if (!valid) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  // 6. Sanitize (escapeHtml for HTML body only, plain sanitize for email headers)
  const cleanEmail = sanitize(values.email, MAX_LENGTHS.email);
  const safe = {
    name: escapeHtml(sanitize(values.name, MAX_LENGTHS.name)),
    email: escapeHtml(cleanEmail),
    company: escapeHtml(sanitize(values.company, MAX_LENGTHS.company)),
    service: escapeHtml(sanitize(values.service, MAX_LENGTHS.service)),
    message: escapeHtml(sanitize(values.message, MAX_LENGTHS.message)),
  };

  // 7. Send email
  if (process.env.RESEND_API_KEY) {
    const resend = getResend();
    try {
      await resend.emails.send({
        from: "contacto@themonkeys.do",
        to: SITE.email,
        subject: `Nuevo contacto: ${safe.name}`,
        html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Empresa:</strong> ${safe.company || "—"}</p>
        <p><strong>Servicio:</strong> ${safe.service}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${safe.message.replace(/\n/g, "<br>")}</p>
      `,
        replyTo: cleanEmail,
      });
    } catch (err) {
      console.error("[contact] email send failed:", err);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
