"use client";
import { motion } from "motion/react";
import Image from "next/image";
import type { Project } from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  index: number;
}

export function ProjectCard({ project, locale, index }: ProjectCardProps) {
  const title = locale === "es" ? project.titleEs : project.titleEn;
  const description = locale === "es" ? project.descriptionEs : project.descriptionEn;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.coverImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6">
        <p className="text-xs text-brand-yellow font-semibold uppercase tracking-widest mb-1">
          {project.client}
        </p>
        <h3 className="text-xl font-semibold text-brand-navy mb-2">{title}</h3>
        <p className="text-brand-navy/60 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.article>
  );
}
