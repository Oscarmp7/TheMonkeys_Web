"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ui/project-card";
import type { Locale } from "@/i18n/routing";

export function Portfolio({ locale }: { locale: Locale }) {
  const t = useTranslations("portfolio");

  return (
    <section className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-4xl md:text-5xl font-display text-brand-navy mb-12"
        >
          {t("title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.filter((p) => p.featured).map((project, i) => (
            <ProjectCard key={project.slug} project={project} locale={locale} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:gap-3 transition-all"
          >
            {t("cta")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
