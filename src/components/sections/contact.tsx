"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ContactForm } from "@/components/ui/contact-form";
import { getWhatsAppHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

// This section gets id="contacto" for the #contacto anchor links throughout the site
export function Contact({ locale }: { locale: Locale }) {
  const t = useTranslations("contact");

  return (
    <section id="contacto" className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: heading + WhatsApp CTA */}
        <div className="flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-4xl md:text-5xl font-display text-brand-navy"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-brand-navy/70"
          >
            {t("subtitle")}
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            href={getWhatsAppHref("Hola! Me gustaría cotizar un servicio.", locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start px-7 py-3 bg-brand-yellow text-brand-navy font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
          >
            {t("whatsapp")} ↗
          </motion.a>
        </div>

        {/* Right: Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
