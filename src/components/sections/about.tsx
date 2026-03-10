"use client";

import { useTranslations } from "next-intl";
import { Eye, Award, Handshake, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ValueCard } from "@/components/ui/value-card";

export function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="py-24 lg:py-32 bg-surface-light-alt dark:bg-brand-navy-deep"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader overheader={t("overheader")} title="" />

        {/* Statement */}
        <motion.div
          className="max-w-3xl mx-auto text-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold">
            {t("statement")}
          </h2>
          <p className="text-xl md:text-2xl mt-4 opacity-80 leading-relaxed">
            {t("bio")}
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <ValueCard
            icon={Eye}
            title={t("values.transparency.title")}
            description={t("values.transparency.description")}
            index={0}
          />
          <ValueCard
            icon={Award}
            title={t("values.quality.title")}
            description={t("values.quality.description")}
            index={1}
          />
          <ValueCard
            icon={Handshake}
            title={t("values.service.title")}
            description={t("values.service.description")}
            index={2}
          />
        </div>

        {/* Location */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-12 opacity-60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <MapPin size={18} />
          <span>{t("location")}</span>
        </motion.div>
      </div>
    </section>
  );
}
