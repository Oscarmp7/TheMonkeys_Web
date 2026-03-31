interface ContactDeliveryEnv {
  NODE_ENV?: string;
  RESEND_API_KEY?: string;
}

export type ContactDeliveryMode = "active" | "development" | "misconfigured";

export function isContactDeliveryConfigured(env: ContactDeliveryEnv = process.env): boolean {
  return Boolean(env.RESEND_API_KEY?.trim());
}

export function getContactDeliveryMode(
  env: ContactDeliveryEnv = process.env
): ContactDeliveryMode {
  if (isContactDeliveryConfigured(env)) {
    return "active";
  }

  return env.NODE_ENV === "production" ? "misconfigured" : "development";
}
