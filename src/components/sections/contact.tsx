"use client";

import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/ui/contact-form";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader overheader={t("overheader")} title={t("title")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg opacity-80 leading-relaxed">{t("bio")}</p>

            <div className="mt-8 space-y-4">
              <a
                href="tel:+18097561847"
                className="flex items-center gap-3 hover:text-brand-yellow transition"
              >
                <Phone size={20} className="text-brand-yellow" />
                <span>(809) 756-1847</span>
              </a>

              <a
                href="mailto:hola@themonkeys.do"
                className="flex items-center gap-3 hover:text-brand-yellow transition"
              >
                <Mail size={20} className="text-brand-yellow" />
                <span>hola@themonkeys.do</span>
              </a>

              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-brand-yellow" />
                <span>Santiago de los Caballeros, RD</span>
              </div>
            </div>

            <a
              href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 bg-whatsapp text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition text-lg"
            >
              <MessageCircle size={24} />
              {t("whatsapp_cta")}
            </a>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
