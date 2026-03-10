"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LogoCloud } from "@/components/ui/logo-cloud";
import type { ClientLogo } from "@/lib/site-data";

export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  const t = useTranslations("clients");

  return (
    <section
      id="clients"
      className="section-anchor bg-brand-navy-deep py-24 text-white lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="section-overheader">{t("overheader")}</p>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
        </motion.div>
      </div>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <LogoCloud logos={logos} />
      </motion.div>
    </section>
  );
}
