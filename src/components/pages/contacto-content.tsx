"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SITE } from "@/lib/site";
import { SOCIALS_CONFIG } from "@/lib/socials";
import { validateContactForm, type ContactFormValues } from "@/lib/validation";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICE_KEYS = [
  "strategy",
  "content",
  "campaigns",
  "inbound",
  "seo",
  "web",
  "influencers",
  "full",
] as const;

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

type ContactPageT = ReturnType<typeof useTranslations<"contact_page">>;

type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

type ChannelItem = {
  icon: LucideIcon;
  label: string;
  cta: string;
  href: string;
  external?: boolean;
};

function ContactCard({ item }: { item: ContactItem }) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-brand-navy-dark/75 text-brand-yellow transition-colors duration-200 group-hover:border-brand-yellow/30">
        <item.icon size={17} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <span className="mb-1 block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-off-white/40">
          {item.label}
        </span>
        <span className="block text-sm font-body font-semibold leading-snug text-off-white/90 transition-colors duration-200 group-hover:text-brand-yellow">
          {item.value}
        </span>
      </div>
    </>
  );

  if (!item.href) {
    return (
      <div
        className="group flex items-start gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.04] px-4 py-4"
        data-contact-reveal
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.04] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-yellow/25 hover:bg-white/[0.06] cursor-pointer"
      data-contact-reveal
    >
      {content}
    </a>
  );
}

function ContactInfoStack({ t }: { t: ContactPageT }) {
  const items: ContactItem[] = [
    {
      icon: Mail,
      label: t("card_email_label"),
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: Phone,
      label: t("card_phone_label"),
      value: "+1 (809) 756-1847",
      href: `tel:${SITE.phone}`,
    },
    {
      icon: MapPin,
      label: t("card_location_label"),
      value: "Santiago de los Caballeros, RD",
    },
  ];

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <ContactCard key={item.label} item={item} />
      ))}
    </div>
  );
}

function QuickChannelGrid({ t }: { t: ContactPageT }) {
  const channels: ChannelItem[] = [
    {
      icon: MessageCircle,
      label: t("channel_whatsapp"),
      cta: t("channel_whatsapp_cta"),
      href: `https://wa.me/${SITE.whatsapp.replace(/^\+/, "")}?text=${encodeURIComponent(
        "Hola The Monkeys, me gustaria conocer mas sobre sus servicios."
      )}`,
      external: true,
    },
    {
      icon: Instagram,
      label: t("channel_instagram"),
      cta: t("channel_instagram_handle"),
      href: SITE.instagram,
      external: true,
    },
  ];

  return (
    <div className="mx-auto grid max-w-[430px] gap-3 sm:grid-cols-2" data-contact-reveal>
      {channels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target={channel.external ? "_blank" : undefined}
          rel={channel.external ? "noopener noreferrer" : undefined}
          className="group flex min-h-[114px] flex-col items-center justify-center gap-3 rounded-[1.15rem] border border-white/8 bg-white/[0.035] px-5 py-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-yellow/25 hover:bg-white/[0.06] cursor-pointer"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-brand-navy-dark/75 text-brand-yellow transition-colors duration-200 group-hover:border-brand-yellow/30">
            <channel.icon size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="block font-display text-[0.84rem] uppercase leading-none tracking-[0.02em] text-off-white">
              {channel.label}
            </span>
            <span className="mt-2 block font-mono text-[0.55rem] tracking-[0.2em] uppercase text-brand-yellow/80">
              {channel.cta}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

function SocialRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3" data-contact-reveal>
      {SOCIALS_CONFIG.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/8 text-off-white/35 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-yellow/30 hover:text-brand-yellow cursor-pointer"
        >
          <social.icon size={18} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function ContactPageForm({ t }: { t: ContactPageT }) {
  const serviceMenuRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<ContactFormValues & { phone: string; website: string }>(
    {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
      phone: "",
      website: "",
    }
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        serviceMenuRef.current &&
        !serviceMenuRef.current.contains(event.target as Node)
      ) {
        setIsServiceMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setValues((current) => ({ ...current, [e.target.name]: e.target.value }));
    setErrors((current) => ({ ...current, [e.target.name]: undefined }));
  }

  function handleServiceSelect(service: string) {
    setValues((current) => ({ ...current, service }));
    setErrors((current) => ({ ...current, service: undefined }));
    setIsServiceMenuOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
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

  const inputBase =
    "w-full rounded-[1rem] border border-brand-navy/12 bg-white px-4 py-3.5 font-body text-[14px] text-brand-black placeholder:text-brand-navy/32 outline-none transition-[border-color,box-shadow,transform] duration-200 focus:border-brand-yellow focus:shadow-[0_0_0_4px_rgba(245,197,24,0.1)]";

  const labelClass =
    "mb-2 block font-mono text-[0.55rem] tracking-[0.2em] uppercase text-brand-navy/50";
  const serviceLabel = values.service
    ? t(`form_service_${values.service as (typeof SERVICE_KEYS)[number]}` as "form_service_strategy")
    : t("form_placeholder_service");

  if (status === "success") {
    return (
      <div className="flex flex-col items-start py-16 sm:py-20">
        <div className="mb-6 h-px w-12 bg-brand-yellow" aria-hidden="true" />
        <p className="mb-4 font-display-alt text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[0.92] tracking-[0.01em] text-brand-black">
          {t("form_success")}
        </p>
        <p className="max-w-md text-sm leading-relaxed text-brand-navy/70">
          {t("form_note")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <fieldset disabled={status === "loading"} className="flex flex-col gap-5 disabled:opacity-60">
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="cp-name" className={labelClass}>
              {t("form_label_name")}
            </label>
            <input
              id="cp-name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder={t("form_placeholder_name")}
              className={inputBase}
            />
            {errors.name && (
              <span role="alert" className="mt-2 text-xs text-red-500">
                {errors.name}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="cp-company" className={labelClass}>
              {t("form_label_company")}
            </label>
            <input
              id="cp-company"
              name="company"
              type="text"
              value={values.company}
              onChange={handleChange}
              autoComplete="organization"
              placeholder={t("form_placeholder_company")}
              className={inputBase}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="cp-email" className={labelClass}>
              {t("form_label_email")}
            </label>
            <input
              id="cp-email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder={t("form_placeholder_email")}
              className={inputBase}
            />
            {errors.email && (
              <span role="alert" className="mt-2 text-xs text-red-500">
                {errors.email}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="cp-phone" className={labelClass}>
              {t("form_label_phone")}
            </label>
            <input
              id="cp-phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder={t("form_placeholder_phone")}
              className={inputBase}
            />
          </div>
        </div>

        <div ref={serviceMenuRef} className="relative flex flex-col">
          <label htmlFor="cp-service" className={labelClass}>
            {t("form_label_service")}
          </label>
          <button
            id="cp-service"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isServiceMenuOpen}
            onClick={() => setIsServiceMenuOpen((current) => !current)}
            className={`group flex min-h-[56px] w-full items-center justify-between gap-4 rounded-[1rem] border bg-white px-4 py-3.5 text-left outline-none transition-[border-color,box-shadow,transform] duration-200 ${
              isServiceMenuOpen
                ? "border-brand-yellow shadow-[0_0_0_4px_rgba(245,197,24,0.1)]"
                : "border-brand-navy/12 hover:border-brand-navy/22"
            }`}
          >
            <span className="min-w-0">
              <span
                className={`block truncate font-body text-[0.97rem] leading-tight ${
                  values.service ? "text-brand-black" : "text-brand-navy/42"
                }`}
              >
                {serviceLabel}
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-yellow/35 bg-brand-yellow/10 text-brand-yellow transition-all duration-300 group-hover:border-brand-yellow/60">
              <ChevronDown
                size={18}
                aria-hidden="true"
                className={`transition-transform duration-300 ${
                  isServiceMenuOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {isServiceMenuOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-[1.25rem] border border-brand-navy/10 bg-white/98 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur">
              <ul role="listbox" aria-labelledby="cp-service" className="max-h-72 overflow-auto">
                {SERVICE_KEYS.map((key) => {
                  const isSelected = values.service === key;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleServiceSelect(key)}
                        className={`flex w-full items-center justify-between gap-4 rounded-[0.95rem] px-4 py-3 text-left transition-colors duration-200 ${
                          isSelected
                            ? "bg-brand-yellow/10 text-brand-black"
                            : "text-brand-black/86 hover:bg-brand-navy/[0.045]"
                        }`}
                      >
                        <span className="font-body text-[0.95rem] leading-snug">
                          {t(`form_service_${key}` as "form_service_strategy")}
                        </span>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 ${
                            isSelected
                              ? "border-brand-yellow/50 bg-brand-yellow/10 text-brand-yellow"
                              : "border-transparent text-transparent"
                          }`}
                        >
                          <Check size={15} aria-hidden="true" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {errors.service && (
            <span role="alert" className="mt-2 text-xs text-red-500">
              {errors.service}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="cp-message" className={labelClass}>
            {t("form_label_message")}
          </label>
          <textarea
            id="cp-message"
            name="message"
            value={values.message}
            onChange={handleChange}
            rows={5}
            placeholder={t("form_placeholder_message")}
            className={`${inputBase} min-h-[132px] resize-none`}
          />
          {errors.message && (
            <span role="alert" className="mt-2 text-xs text-red-500">
              {errors.message}
            </span>
          )}
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-red-500">
            {t("form_error")}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="group relative mx-auto mt-3 inline-flex min-w-[248px] items-center justify-center gap-3 overflow-hidden rounded-full bg-brand-navy px-6 py-3.5 text-off-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#121a33] hover:shadow-[0_18px_40px_rgba(17,26,51,0.22)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span
            className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(115deg,transparent_0%,rgba(245,197,24,0.14)_45%,transparent_85%)] transition-transform duration-500 ease-out group-hover:translate-x-[120%]"
            aria-hidden="true"
          />
          <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-yellow/40 text-brand-yellow transition-all duration-300 group-hover:translate-x-1 group-hover:bg-brand-yellow group-hover:text-brand-black">
            <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <span className="relative z-10 font-display text-[0.74rem] tracking-[0.14em] uppercase transition-[letter-spacing,transform] duration-300 group-hover:tracking-[0.16em]">
            {status === "loading" ? "..." : t("form_submit")}
          </span>
        </button>
      </fieldset>

      <p className="mt-2 text-center font-mono text-[0.65rem] leading-relaxed tracking-wide text-brand-navy/45">
        {t("form_note")}
      </p>
    </form>
  );
}

function FaqSection({ t }: { t: ContactPageT }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = usePrefersReducedMotion();

  const toggle = useCallback(
    (index: number) => {
      if (openIndex === index) {
        const el = answerRefs.current[index];
        if (el) {
          if (prefersReduced) {
            el.style.maxHeight = "0";
          } else {
            gsap.to(el, { maxHeight: 0, duration: 0.3, ease: "expo.out" });
          }
        }
        setOpenIndex(null);
        return;
      }

      if (openIndex !== null) {
        const prev = answerRefs.current[openIndex];
        if (prev) {
          if (prefersReduced) {
            prev.style.maxHeight = "0";
          } else {
            gsap.to(prev, { maxHeight: 0, duration: 0.22, ease: "expo.out" });
          }
        }
      }

      const el = answerRefs.current[index];
      if (el) {
        const height = el.scrollHeight;
        if (prefersReduced) {
          el.style.maxHeight = `${height}px`;
        } else {
          gsap.to(el, { maxHeight: height, duration: 0.38, ease: "expo.out" });
        }
      }

      setOpenIndex(index);
    },
    [openIndex, prefersReduced]
  );

  return (
    <section className="relative overflow-hidden bg-[#08111f] px-6 py-28 md:px-8 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(14,22,39,0.82) 0%, rgba(9,16,31,0.18) 32%, rgba(8,17,31,0) 100%), radial-gradient(circle at 78% 12%, rgba(38,58,94,0.22), transparent 28%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 md:mb-20" data-faq-reveal>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-brand-yellow" aria-hidden="true" />
            <span className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-brand-yellow">
              {t("faq_eyebrow")}
            </span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display-alt text-[clamp(3rem,7vw,5.5rem)] uppercase leading-[0.9] tracking-[0.01em]">
              <span className="block text-off-white">{t("faq_title_line1")}</span>
              <span className="block text-brand-yellow">{t("faq_title_line2")}</span>
            </h2>

            <p className="max-w-sm text-sm leading-relaxed text-off-white/40 md:pb-2 md:text-right">
              {t("faq_subtitle")}
            </p>
          </div>
        </div>

        <div className="max-w-4xl" data-faq-reveal>
          {FAQ_KEYS.map((key, index) => (
            <div
              key={key}
              className="border-b border-white/[0.08] first:border-t first:border-white/[0.08]"
            >
              <button
                onClick={() => toggle(index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                aria-expanded={openIndex === index}
              >
                <div className="flex items-center gap-5">
                  <span className="w-6 font-mono text-[0.6rem] tabular-nums text-off-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-[0.9rem] font-semibold text-off-white transition-colors duration-200 group-hover:text-brand-yellow">
                    {t(`faq_items.${key}.question` as "faq_items.q1.question")}
                  </span>
                </div>
                <Plus
                  size={18}
                  className={`shrink-0 text-brand-yellow/60 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                ref={(el) => {
                  answerRefs.current[index] = el;
                }}
                className="overflow-hidden"
                style={{ maxHeight: 0 }}
              >
                <p className="pb-6 pl-11 text-[0.8rem] leading-[1.8] text-off-white/40">
                  {t(`faq_items.${key}.answer` as "faq_items.q1.answer")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center" data-faq-reveal>
          <a href="https://wa.me/18097561847" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 cursor-pointer">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-yellow/40 text-brand-yellow transition-all duration-200 group-hover:bg-brand-yellow group-hover:text-brand-black">
              <ArrowRight size={14} aria-hidden="true" />
            </span>
            <span className="font-display text-[0.72rem] tracking-[0.09em] uppercase text-off-white/68 transition-colors duration-200 group-hover:text-brand-yellow">
              {t("faq_cta")}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContactoContent({ homeHref }: { homeHref: string }) {
  const t = useTranslations("contact_page");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const heroPrefix = t("hero_title_line1_prefix").trim();

  useGSAP(
    () => {
      if (prefersReduced) {
        gsap.set(
          [
            "[data-contact-reveal]",
            "[data-hero-title]",
            "[data-form-panel]",
            "[data-faq-reveal]",
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      gsap.fromTo(
        "[data-contact-reveal]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "expo.out",
          delay: 0.12,
        }
      );

      gsap.fromTo(
        "[data-hero-title]",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.08,
        }
      );

      gsap.fromTo(
        "[data-form-panel]",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          delay: 0.18,
        }
      );

      gsap.fromTo(
        "[data-faq-reveal]",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.1,
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReduced] }
  );

  return (
    <div ref={containerRef}>
      <section className="relative overflow-hidden bg-[#060b15] pt-24 pb-20 md:pt-28 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,19,35,0.92) 0%, rgba(7,11,21,0.38) 34%, rgba(6,11,21,0) 100%), radial-gradient(circle at 84% 12%, rgba(34,52,86,0.16), transparent 22%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <nav
            className="mb-8 font-mono text-[0.55rem] tracking-[0.2em] uppercase text-off-white/40 md:mb-10"
            data-contact-reveal
            aria-label="Breadcrumb"
          >
            <a
              href={homeHref}
              className="cursor-pointer text-brand-yellow transition-colors duration-200 hover:text-brand-yellow/75"
            >
              {t("breadcrumb_home")}
            </a>
            <span className="mx-2 opacity-30">/</span>
            {t("breadcrumb_current")}
          </nav>

          <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="grid lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
              <aside className="relative overflow-hidden bg-[#070c16] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
                <div
                  className="pointer-events-none absolute inset-0 opacity-100"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(12,18,32,0.88) 0%, rgba(8,13,24,0.25) 45%, rgba(7,12,22,0) 100%), radial-gradient(circle at 74% 16%, rgba(38,58,94,0.16), transparent 24%)",
                  }}
                />

                <div className="relative z-10 mx-auto max-w-[560px]">
                  <div className="flex items-center gap-3" data-contact-reveal>
                    <span className="h-px w-8 bg-brand-yellow" aria-hidden="true" />
                    <span className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-brand-yellow">
                      {t("hero_eyebrow")}
                    </span>
                  </div>

                  <h1
                    className="mt-5 uppercase"
                    data-hero-title
                  >
                    <span className="flex flex-wrap items-end gap-x-1 gap-y-0 font-display-alt text-[clamp(3.9rem,9vw,6.9rem)] leading-[0.88] tracking-[0.005em] text-off-white sm:gap-x-1.5">
                      {heroPrefix ? (
                        <span className="-mr-1 -translate-y-1 sm:-mr-2 sm:-translate-y-1.5">
                          {heroPrefix}
                        </span>
                      ) : null}
                      <span
                        className="text-transparent"
                        style={{
                          WebkitTextStroke: "1.8px var(--color-off-white)",
                        }}
                      >
                        {t("hero_title_line1_outline")}
                      </span>
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-end gap-x-1.5 gap-y-0 font-display-alt text-[clamp(3.9rem,9vw,6.9rem)] leading-[0.88] tracking-[0.005em] sm:gap-x-2">
                      <span className="text-off-white">{t("hero_title_line2")}</span>
                      <span className="text-brand-yellow">{t("hero_title_line3_yellow")}</span>
                    </span>
                  </h1>

                  <p className="mt-7 max-w-sm text-sm leading-relaxed text-off-white/46 md:mt-8" data-contact-reveal>
                    {t("hero_subtitle")}{" "}
                    <strong className="text-off-white/78">{t("hero_subtitle_bold")}</strong>
                    {t("hero_subtitle_end")}
                  </p>

                  <div className="my-8 h-px w-full bg-white/[0.06]" data-contact-reveal aria-hidden="true" />

                  <ContactInfoStack t={t} />

                  <div className="mt-6" data-contact-reveal>
                    <QuickChannelGrid t={t} />
                  </div>

                  <div className="mt-8">
                    <SocialRow />
                  </div>
                </div>
              </aside>

              <div className="relative overflow-hidden bg-off-white px-6 py-10 text-brand-black sm:px-8 sm:py-12 lg:px-12 lg:py-14">
                <div
                  className="pointer-events-none absolute inset-0 opacity-100"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(30,36,63,0.035) 0%, rgba(30,36,63,0) 42%), radial-gradient(circle at 12% 100%, rgba(30,36,63,0.06), transparent 32%)",
                  }}
                />

                <div className="relative z-10 mx-auto max-w-[760px]">
                  <div className="mb-10" data-form-panel>
                    <div className="flex items-center gap-3">
                      <span className="h-px w-8 bg-brand-navy/35" aria-hidden="true" />
                      <span className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-brand-navy/55">
                        {t("form_eyebrow")}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display-alt text-[clamp(2.6rem,5vw,4.9rem)] uppercase leading-[0.92] tracking-[0.01em] text-brand-black">
                      <span className="block">{t("form_title_line1")}</span>
                      <span className="block text-brand-yellow">{t("form_title_line2")}</span>
                    </h2>

                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-navy/68">
                      {t("form_subtitle")}
                    </p>
                  </div>

                  <ContactPageForm t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection t={t} />
    </div>
  );
}
