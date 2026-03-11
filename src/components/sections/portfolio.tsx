"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ProjectModal } from "@/components/ui/project-modal";
import type { PortfolioProject } from "@/lib/site-data";

function FeaturedProject({
  project,
  label,
  onOpen,
}: {
  project: PortfolioProject;
  label: string;
  onOpen: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={containerRef}
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      aria-label={`${label}: ${project.title}`}
      aria-haspopup="dialog"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[2.2/1]">
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="scale-110 object-cover transition-transform duration-700 group-hover:scale-[1.14]"
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
        <div className="flex flex-wrap gap-2">
          {project.services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {service}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-3xl font-bold text-white md:text-5xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/65 md:text-base">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

function SecondaryCard({
  project,
  index,
  label,
  onOpen,
}: {
  project: PortfolioProject;
  index: number;
  label: string;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      className="group relative overflow-hidden rounded-2xl text-left"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      onClick={onOpen}
      aria-label={`${label}: ${project.title}`}
      aria-haspopup="dialog"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
      </div>
    </motion.button>
  );
}

export function Portfolio({ projects }: { projects: PortfolioProject[] }) {
  const t = useTranslations("portfolio");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const primaryProject = projects[0];
  const secondaryProjects = projects.slice(1);

  return (
    <section id="portfolio" className="section-anchor py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="section-overheader">{t("overheader")}</p>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h2>
        </motion.div>

        {primaryProject ? (
          <FeaturedProject
            project={primaryProject}
            label={t("open_project")}
            onOpen={() => setSelectedProject(primaryProject)}
          />
        ) : null}

        {secondaryProjects.length ? (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {secondaryProjects.map((project, index) => (
              <SecondaryCard
                key={project._id}
                project={project}
                index={index}
                label={t("open_project")}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : null}

        <motion.a
          href="#contact"
          className="mt-10 flex items-center justify-between rounded-2xl border border-brand-yellow-border/16 bg-[linear-gradient(135deg,rgba(255,244,191,0.92)_0%,rgba(250,250,248,1)_100%)] px-8 py-7 text-brand-navy shadow-[0_24px_60px_-42px_rgba(0,38,62,0.32)] transition-all duration-300 hover:-translate-y-px hover:shadow-xl dark:border-white/10 dark:bg-brand-navy-light dark:text-white md:px-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-display text-lg font-bold md:text-2xl">
            {t("cta_placeholder")}
          </p>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-navy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
          </span>
        </motion.a>
      </div>

      <ProjectModal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
}
