"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ui/project-card";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Portfolio({ locale }: { locale: Locale }) {
  const t = useTranslations("portfolio");
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;

      if (prefersReduced) return;

      gsap.from("[data-animate]", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto">
        <h2
          data-animate
          className="text-4xl md:text-5xl font-display text-brand-navy mb-12"
        >
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.filter((p) => p.featured).map((project, index) => (
            <ProjectCard key={project.slug} project={project} locale={locale} index={index} />
          ))}
        </div>

        <div data-animate className="mt-12 text-center">
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:gap-3 transition-all"
          >
            {t("cta")} -&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
