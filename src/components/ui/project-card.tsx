"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { Project } from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  index: number;
}

export function ProjectCard({ project, locale, index }: ProjectCardProps) {
  const title = locale === "es" ? project.titleEs : project.titleEn;
  const description = locale === "es" ? project.descriptionEs : project.descriptionEn;
  const cardRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;

      if (prefersReduced) return;

      gsap.from(cardRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        delay: index * 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: cardRef }
  );

  return (
    <article
      ref={cardRef}
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
    </article>
  );
}
