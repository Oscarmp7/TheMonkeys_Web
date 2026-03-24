"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { validateContactForm, type ContactFormValues } from "@/lib/validation";
import { ArrowRight } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact");

  const [values, setValues] = useState<ContactFormValues & { website: string }>({
    name: "",
    email: "",
    company: "",
    service: "general",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <p className="text-brand-yellow font-semibold text-lg py-8">
        {t("success")}
      </p>
    );
  }

  const inputClass =
    "w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-off-white/90 placeholder-white/30 text-sm focus:outline-none focus:border-brand-yellow/50 focus:bg-white/10 transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" noValidate>
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
        <input
          id="contact-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          placeholder={t("placeholder_name")}
          aria-label={t("placeholder_name")}
          className={inputClass}
        />
        {errors.name && (
          <span role="alert" className="text-xs text-red-400">{errors.name}</span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder={t("placeholder_email")}
          aria-label={t("placeholder_email")}
          className={inputClass}
        />
        {errors.email && (
          <span role="alert" className="text-xs text-red-400">{errors.email}</span>
        )}
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1">
        <input
          id="contact-company"
          name="company"
          type="text"
          value={values.company}
          onChange={handleChange}
          autoComplete="organization"
          placeholder={t("placeholder_company")}
          aria-label={t("placeholder_company")}
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={handleChange}
          rows={5}
          placeholder={t("placeholder_message")}
          aria-label={t("placeholder_message")}
          className={`${inputClass} resize-none`}
        />
        {errors.message && (
          <span role="alert" className="text-xs text-red-400">{errors.message}</span>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-400">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-brand-yellow text-brand-black font-display text-sm tracking-[0.2em] uppercase py-4 px-6 mt-2 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
      >
        {status === "loading" ? "..." : t("submit")}
        {status !== "loading" && <ArrowRight size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}
