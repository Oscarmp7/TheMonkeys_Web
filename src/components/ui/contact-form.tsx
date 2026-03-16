"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { SERVICE_KEYS } from "@/lib/services";
import { validateContactForm, type ContactFormValues } from "@/lib/validation";

export function ContactForm() {
  const t = useTranslations("contact");
  const tServices = useTranslations("services");

  const [values, setValues] = useState<ContactFormValues & { website: string }>({
    name: "", email: "", company: "", service: "", message: "", website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateContactForm(values);
    if (!result.valid) {
      setErrors(result.errors as Record<string, string>);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-brand-navy font-semibold text-lg py-8">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg" noValidate>
      {/* Honeypot — spam protection, must remain hidden */}
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-name" className="text-sm font-medium text-brand-navy">
          {t("name")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          className="px-4 py-3 rounded-xl border border-brand-navy/20 bg-white text-brand-navy placeholder-brand-navy/40 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
        />
        {errors.name && (
          <span role="alert" className="text-xs text-red-600">{errors.name}</span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-email" className="text-sm font-medium text-brand-navy">
          {t("email")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          className="px-4 py-3 rounded-xl border border-brand-navy/20 bg-white text-brand-navy placeholder-brand-navy/40 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
        />
        {errors.email && (
          <span role="alert" className="text-xs text-red-600">{errors.email}</span>
        )}
      </div>

      {/* Company (optional) */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-company" className="text-sm font-medium text-brand-navy">
          {t("company")}
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          value={values.company}
          onChange={handleChange}
          autoComplete="organization"
          className="px-4 py-3 rounded-xl border border-brand-navy/20 bg-white text-brand-navy placeholder-brand-navy/40 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      {/* Service dropdown */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-service" className="text-sm font-medium text-brand-navy">
          {t("service")}
        </label>
        <select
          id="contact-service"
          name="service"
          value={values.service}
          onChange={handleChange}
          className="px-4 py-3 rounded-xl border border-brand-navy/20 bg-white text-brand-navy focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
        >
          <option value="">— {t("service")} —</option>
          {SERVICE_KEYS.map((key) => (
            <option key={key} value={key}>
              {tServices(key)}
            </option>
          ))}
        </select>
        {errors.service && (
          <span role="alert" className="text-xs text-red-600">{errors.service}</span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-sm font-medium text-brand-navy">
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={handleChange}
          rows={5}
          className="px-4 py-3 rounded-xl border border-brand-navy/20 bg-white text-brand-navy placeholder-brand-navy/40 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy resize-none"
        />
        {errors.message && (
          <span role="alert" className="text-xs text-red-600">{errors.message}</span>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 bg-brand-navy text-brand-yellow font-semibold rounded-full hover:bg-brand-navy/90 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : t("submit")}
      </button>
    </form>
  );
}
