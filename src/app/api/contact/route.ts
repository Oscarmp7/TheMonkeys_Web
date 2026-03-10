import { Resend } from "resend";
import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
  website?: string;
};

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePayload(payload: ContactPayload) {
  return {
    name: sanitizeText(payload.name),
    email: sanitizeText(payload.email),
    company: sanitizeText(payload.company),
    service: sanitizeText(payload.service),
    message: sanitizeText(payload.message),
    website: sanitizeText(payload.website),
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      { success: false, error: "Email service not configured" },
      { status: 500 },
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const data = normalizePayload(payload);

  if (data.website) {
    return NextResponse.json({ success: true });
  }

  if (!data.name || !data.email || !data.service || !data.message) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!isValidEmail(data.email)) {
    return NextResponse.json(
      { success: false, error: "Invalid email address" },
      { status: 400 },
    );
  }

  if (data.name.length > 120 || data.company.length > 120 || data.service.length > 120) {
    return NextResponse.json(
      { success: false, error: "Input exceeds allowed length" },
      { status: 400 },
    );
  }

  if (data.message.length > 4000) {
    return NextResponse.json(
      { success: false, error: "Message exceeds allowed length" },
      { status: 400 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "The Monkeys Web <onboarding@resend.dev>",
      to: "hola@themonkeys.do",
      subject: `Nuevo lead: ${data.name} - ${data.service}`,
      text: [
        "Nuevo contacto desde themonkeys.do",
        `Nombre: ${data.name}`,
        `Email: ${data.email}`,
        `Empresa: ${data.company || "No especificada"}`,
        `Servicio: ${data.service}`,
        `Mensaje: ${data.message}`,
      ].join("\n"),
      html: `
        <h2>Nuevo contacto desde themonkeys.do</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(data.company || "No especificada")}</p>
        <p><strong>Servicio:</strong> ${escapeHtml(data.service)}</p>
        <p><strong>Mensaje:</strong><br />${escapeHtml(data.message).replaceAll("\n", "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
