/** Contact form validation — used by both client and server. */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MAX_LENGTHS = { name: 120, email: 254, company: 120, service: 120, message: 4000 };

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function sanitize(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}

export interface ContactFormValues {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

export function validateContactForm(values: ContactFormValues): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!values.name.trim()) errors.name = "required";
  else if (values.name.length > MAX_LENGTHS.name) errors.name = "too_long";

  if (!values.email.trim()) errors.email = "required";
  else if (!isValidEmail(values.email)) errors.email = "invalid";
  else if (values.email.length > MAX_LENGTHS.email) errors.email = "too_long";

  if (!values.service.trim()) errors.service = "required";

  if (!values.message.trim()) errors.message = "required";
  else if (values.message.length > MAX_LENGTHS.message) errors.message = "too_long";

  return { valid: Object.keys(errors).length === 0, errors };
}
