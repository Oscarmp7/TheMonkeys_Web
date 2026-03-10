"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Eye, Award, Handshake, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const values: { key: string; icon: LucideIcon }[] = [
  { key: "transparency", icon: Eye },
  { key: "quality", icon: Award },
  { key: "service", icon: Handshake },
];

export function About() {
  const t = useTranslations("about");
  const statementRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ["start end", "end start"],
  });
  const statementY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      className="section-anchor py-28 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className="section-overheader">{t("overheader")}</p>
        </motion.div>

        <div ref={statementRef} className="overflow-hidden">
          <motion.h2
            className="max-w-5xl font-display text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[1.05] tracking-tight"
            style={{ y: statementY }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {t("title")}
          </motion.h2>
        </div>

        <motion.p
          className="mt-6 max-w-2xl text-lg leading-8 text-brand-navy/60 dark:text-white/55"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {t("bio")}
        </motion.p>

        <div className="mt-24 grid grid-cols-1 gap-0 md:grid-cols-3">
          {values.map(({ key, icon: Icon }, index) => (
            <motion.div
              key={key}
              className={`py-8 md:px-8 ${
                index > 0
                  ? "border-t border-brand-navy/8 dark:border-white/8 md:border-l md:border-t-0"
                  : ""
              } ${index === 0 ? "md:pl-0" : ""} ${index === values.length - 1 ? "md:pr-0" : ""}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
            >
              <Icon
                size={22}
                strokeWidth={1.6}
                className="text-brand-yellow"
              />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                {t(`values.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-brand-navy/55 dark:text-white/50">
                {t(`values.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 flex items-center gap-2.5 text-sm text-brand-navy/40 dark:text-white/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MapPin size={15} />
          <span>{t("location")}</span>
        </motion.div>
      </div>
    </section>
  );
}
