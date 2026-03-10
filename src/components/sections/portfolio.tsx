"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { SectionHeader } from "@/components/ui/section-header";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { ProjectModal } from "@/components/ui/project-modal";

interface Project {
  _id: string;
  title: { es: string; en: string };
  slug: { current: string };
  image: string;
  description: { es: string; en: string };
  services: string[];
  featured: boolean;
}

const fallbackProjects: Project[] = [
  {
    _id: "jimetor",
    title: {
      es: "Jimetor Eco Village",
      en: "Jimetor Eco Village",
    },
    slug: { current: "jimetor" },
    image: "/portfolio/jimetor-logo.jpeg",
    description: {
      es: "Branding completo, fotografía, video, manejo de redes sociales y SEO para Jimetor Eco Village.",
      en: "Complete branding, photography, video, social media management and SEO for Jimetor Eco Village.",
    },
    services: ["Content Production", "SEO", "Content Creation"],
    featured: true,
  },
];

export function Portfolio() {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = fallbackProjects;

  return (
    <section id="portfolio" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader overheader={t("overheader")} title={t("title")} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          {projects.map((project, index) => (
            <PortfolioCard
              key={project._id}
              title={locale === "es" ? project.title.es : project.title.en}
              image={project.image}
              services={project.services}
              featured={project.featured}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}

          {/* CTA Placeholder Card */}
          <a
            href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-1 min-h-[250px] rounded-2xl bg-brand-yellow flex items-center justify-center p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <p className="font-display text-xl md:text-2xl font-bold text-brand-navy text-center">
              {t("cta_placeholder")}
            </p>
          </a>
        </div>
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={
          selectedProject
            ? {
                title:
                  locale === "es"
                    ? selectedProject.title.es
                    : selectedProject.title.en,
                image: selectedProject.image,
                description:
                  locale === "es"
                    ? selectedProject.description.es
                    : selectedProject.description.en,
                services: selectedProject.services,
              }
            : null
        }
      />
    </section>
  );
}
