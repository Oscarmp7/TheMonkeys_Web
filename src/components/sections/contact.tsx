"use client";

import { useTranslations } from "next-intl";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/ui/contact-form";
import { getWhatsAppHref, type AppLocale, type SiteSettings } from "@/lib/site-data";

export function Contact({
  locale,
  settings,
}: {
  locale: AppLocale;
  settings: SiteSettings;
}) {
  const t = useTranslations("contact");

  const contactItems = [
    {
      icon: Phone,
      label: t("phone_label"),
      value: settings.phone,
      href: `tel:${settings.whatsapp}`,
    },
    {
      icon: Mail,
      label: t("email_label"),
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: MapPin,
      label: t("location_label"),
      value: settings.address,
    },
  ];

  return (
    <section id="contact" className="section-anchor bg-surface-light-alt py-28 dark:bg-brand-navy-deep lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-overheader">{t("overheader")}</p>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="max-w-lg text-base leading-7 text-brand-navy/65 dark:text-white/60">
              {t("bio")}
            </p>

            <div className="mt-10 space-y-6">
              {contactItems.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="group flex items-start gap-4">
                    <Icon size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-brand-yellow" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/40 dark:text-white/35">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand-navy/80 transition-colors group-hover:text-brand-navy dark:text-white/70 dark:group-hover:text-white">
                        {value}
                      </p>
                    </div>
                  </div>
                );

                if (href) {
                  return (
                    <a key={label} href={href} className="block">
                      {content}
                    </a>
                  );
                }

                return <div key={label}>{content}</div>;
              })}
            </div>

            <a
              href={getWhatsAppHref(locale, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex h-12 items-center gap-3 rounded-full bg-whatsapp px-7 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            >
              <MessageCircle size={18} />
              {t("whatsapp_cta")}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-brand-navy/6 bg-white p-6 dark:border-white/8 dark:bg-brand-navy-light/20 md:p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
