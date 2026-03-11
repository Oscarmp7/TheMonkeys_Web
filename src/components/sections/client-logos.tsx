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
      className="section-anchor border-y border-brand-navy/6 bg-[linear-gradient(180deg,rgba(255,244,191,0.36)_0%,rgba(250,250,248,1)_100%)] py-24 text-brand-navy dark:border-white/8 dark:bg-brand-navy-deep dark:text-white lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-navy/45 dark:text-brand-yellow">
            <span className="inline-block h-px w-6 bg-brand-navy/20 dark:bg-brand-yellow" />
            {t("overheader")}
          </p>
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
