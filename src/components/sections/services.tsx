"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Camera,
  ChartNoAxesCombined,
  Megaphone,
  Search,
  Sparkles,
  TvMinimalPlay,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const serviceIcons: LucideIcon[] = [
  Workflow,
  Camera,
  Search,
  TvMinimalPlay,
  Sparkles,
  Megaphone,
  ChartNoAxesCombined,
];

const serviceKeys = [
  "inbound",
  "content_production",
  "seo",
  "web_dev",
  "influencers",
  "campaigns",
  "content_creation",
] as const;

function ServiceRow({
  icon: Icon,
  name,
  index,
}: {
  icon: LucideIcon;
  name: string;
  index: number;
}) {
  return (
    <motion.div
      className="group flex items-center gap-5 border-b border-brand-navy/8 py-5 transition-colors duration-300 hover:border-brand-yellow/30 dark:border-white/8 dark:hover:border-brand-yellow/30 md:gap-8 md:py-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <span className="w-8 shrink-0 text-right font-display text-sm font-medium text-brand-navy/30 dark:text-white/25">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/[0.04] text-brand-navy/50 transition-colors duration-300 group-hover:bg-brand-yellow/12 group-hover:text-brand-yellow dark:bg-white/[0.04] dark:text-white/40">
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <p className="font-display text-lg font-semibold tracking-tight text-brand-navy transition-transform duration-300 group-hover:translate-x-1.5 dark:text-white md:text-xl">
        {name}
      </p>

      <span className="ml-auto hidden h-px flex-1 max-w-32 bg-brand-navy/8 transition-all duration-500 group-hover:max-w-48 group-hover:bg-brand-yellow/40 dark:bg-white/8 md:block" />
    </motion.div>
  );
}

export function Services() {
  const t = useTranslations("services");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const numberY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} id="services" className="section-anchor py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="section-overheader">{t("overheader")}</p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 text-base leading-7 text-brand-navy/65 dark:text-white/60">
              {t("intro")}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand-navy px-8 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg dark:bg-brand-yellow dark:text-brand-navy"
            >
              {t("cta")}
            </a>
          </motion.div>

          <div className="border-t border-brand-navy/8 dark:border-white/8">
            {serviceKeys.map((key, index) => (
              <ServiceRow
                key={key}
                icon={serviceIcons[index]}
                name={t(`items.${key}`)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
