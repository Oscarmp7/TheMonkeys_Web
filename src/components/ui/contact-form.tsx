"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

const SERVICE_KEYS = [
  "inbound",
  "content_production",
  "seo",
  "web_dev",
  "influencers",
  "campaigns",
  "content_creation",
] as const;

type SubmissionStatus = "idle" | "loading" | "success" | "error";

export type ContactFormValues = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  website: string;
};

type ContactFormErrors = Partial<
  Record<"name" | "email" | "service" | "message", string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactFormValues(
  values: ContactFormValues,
  messages: {
    required: string;
    invalidEmail: string;
  },
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) {
    errors.name = messages.required;
  }

  if (!values.email.trim()) {
    errors.email = messages.required;
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = messages.invalidEmail;
  }

  if (!values.service.trim()) {
    errors.service = messages.required;
  }

  if (!values.message.trim()) {
    errors.message = messages.required;
  }

  return errors;
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const serviceT = useTranslations("services.items");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [form, setForm] = useState<ContactFormValues>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
    website: "",
  });

  const nameId = "name";
  const emailId = "email";
  const companyId = "company";
  const serviceId = "service";
  const messageId = "message";
  const companyHintId = "company-hint";
  const messageHintId = "message-hint";
  const liveRegionId = "contact-form-status";
  const nameErrorId = "name-error";
  const emailErrorId = "email-error";
  const serviceErrorId = "service-error";
  const messageErrorId = "message-error";

  const validationMessages = {
    required: t("error_required"),
    invalidEmail: t("error_invalid_email"),
  };
  const hasErrors = Object.keys(errors).length > 0;

  const statusMessage =
    status === "success"
      ? t("success")
      : status === "error"
        ? t("error")
      : status === "loading"
          ? t("sending")
          : hasErrors
            ? t("validation_summary")
          : "";

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const nextForm = { ...prev, [name]: value };

      if (Object.keys(errors).length) {
        setErrors(validateContactFormValues(nextForm, validationMessages));
      }

      return nextForm;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContactFormValues(form, validationMessages);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setErrors({});
      setForm({
        name: "",
        email: "",
        company: "",
        service: "",
        message: "",
        website: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "mt-2 min-h-12 w-full rounded-2xl border border-brand-navy/15 bg-white px-4 py-3 text-brand-navy outline-none transition placeholder:text-brand-navy/45 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/60 dark:border-white/10 dark:bg-brand-navy-light/40 dark:text-white dark:placeholder:text-white/40";
  const labelClasses = "text-sm font-semibold text-brand-navy dark:text-white";
  const errorClasses = "mt-2 text-sm font-medium text-danger";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
      <div aria-live="polite" aria-atomic="true" className="status-live-region" id={liveRegionId}>
        {statusMessage}
      </div>

      <input
        type="text"
        name="website"
        value={form.website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor={nameId} className={labelClasses}>
          {t("name")}
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only"> ({t("required")})</span>
        </label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? nameErrorId : undefined}
          className={`${inputClasses} ${errors.name ? "border-danger focus:border-danger focus:ring-danger/20" : ""}`}
        />
        {errors.name ? (
          <p id={nameErrorId} className={errorClasses}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={emailId} className={labelClasses}>
          {t("email")}
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only"> ({t("required")})</span>
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? emailErrorId : undefined}
          className={`${inputClasses} ${errors.email ? "border-danger focus:border-danger focus:ring-danger/20" : ""}`}
        />
        {errors.email ? (
          <p id={emailErrorId} className={errorClasses}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={companyId} className={labelClasses}>
          {t("company")}
          <span className="ml-2 text-xs font-medium text-brand-navy/55 dark:text-white/55">
            {t("company_hint")}
          </span>
        </label>
        <input
          id={companyId}
          type="text"
          name="company"
          autoComplete="organization"
          value={form.company}
          onChange={handleChange}
          aria-describedby={companyHintId}
          className={inputClasses}
        />
        <p
          id={companyHintId}
          className="mt-2 text-sm text-brand-navy/60 dark:text-white/60"
        >
          {t("company_hint")}
        </p>
      </div>

      <div>
        <label htmlFor={serviceId} className={labelClasses}>
          {t("service")}
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only"> ({t("required")})</span>
        </label>
        <select
          id={serviceId}
          name="service"
          required
          value={form.service}
          onChange={handleChange}
          aria-invalid={errors.service ? "true" : "false"}
          aria-describedby={errors.service ? serviceErrorId : undefined}
          className={`${inputClasses} ${errors.service ? "border-danger focus:border-danger focus:ring-danger/20" : ""}`}
        >
          <option value="">{t("service")}</option>
          {SERVICE_KEYS.map((key) => (
            <option key={key} value={serviceT(key)}>
              {serviceT(key)}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p id={serviceErrorId} className={errorClasses}>
            {errors.service}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={messageId} className={labelClasses}>
          {t("message")}
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only"> ({t("required")})</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? `${messageHintId} ${messageErrorId}` : messageHintId}
          className={`${inputClasses} resize-y ${errors.message ? "border-danger focus:border-danger focus:ring-danger/20" : ""}`}
        />
        <p
          id={messageHintId}
          className="mt-2 text-sm text-brand-navy/60 dark:text-white/60"
        >
          {t("message_hint")}
        </p>
        {errors.message ? (
          <p id={messageErrorId} className={errorClasses}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-8 py-4 font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("submit")
        )}
      </button>

      {status === "success" ? (
        <p className="text-center font-medium text-success">{t("success")}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-center font-medium text-danger">{t("error")}</p>
      ) : null}
    </form>
  );
}
