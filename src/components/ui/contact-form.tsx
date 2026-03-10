"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

const SERVICE_OPTIONS = [
  "Inbound Marketing",
  "Producción de Contenidos",
  "SEO",
  "Desarrollo Web",
  "Marketing de Influencers",
  "Campaña Digital",
  "Creación de Contenido",
];

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", company: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-white dark:bg-brand-navy-light/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-brand-navy dark:text-white placeholder:opacity-50 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="name"
        required
        placeholder={t("name")}
        value={form.name}
        onChange={handleChange}
        className={inputClasses}
      />

      <input
        type="email"
        name="email"
        required
        placeholder={t("email")}
        value={form.email}
        onChange={handleChange}
        className={inputClasses}
      />

      <input
        type="text"
        name="company"
        placeholder={t("company")}
        value={form.company}
        onChange={handleChange}
        className={inputClasses}
      />

      <select
        name="service"
        required
        value={form.service}
        onChange={handleChange}
        className={inputClasses}
      >
        <option value="">— {t("service")} —</option>
        {SERVICE_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        required
        rows={4}
        placeholder={t("message")}
        value={form.message}
        onChange={handleChange}
        className={`${inputClasses} resize-none`}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-brand-yellow text-brand-navy font-semibold px-8 py-4 rounded-full hover:shadow-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Enviando...
          </>
        ) : (
          t("submit")
        )}
      </button>

      {status === "success" && (
        <p className="text-green-500 text-center font-medium">{t("success")}</p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-center font-medium">{t("error")}</p>
      )}
    </form>
  );
}
