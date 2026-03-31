import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/lib/portfolio";
import { buildPageMetadata } from "@/lib/seo";
import { SERVICE_ICONS, type ServiceKey } from "@/lib/services";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((project) => ({ locale, slug: project.slug }))
  );
}

function getPortfolioIndexMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    route: "portfolio",
    title:
      locale === "es"
        ? "Portafolio | The Monkeys - Casos y proyectos en RD"
        : "Portfolio | The Monkeys - Selected projects in the Dominican Republic",
    description:
      locale === "es"
        ? "Casos, proyectos y ejecuciones de estrategia, contenido, SEO y crecimiento digital de The Monkeys."
        : "Selected strategy, content, SEO, and digital growth projects by The Monkeys.",
    noIndex: true,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const project = PROJECTS.find((entry) => entry.slug === slug);

  if (!project) {
    return getPortfolioIndexMetadata(typedLocale);
  }

  const title = typedLocale === "es" ? project.titleEs : project.titleEn;
  const description = typedLocale === "es" ? project.descriptionEs : project.descriptionEn;

  return buildPageMetadata({
    locale: typedLocale,
    route: "portfolioProject",
    params: { slug },
    title: `${title} | ${project.client} | The Monkeys`,
    description,
    type: "article",
    image: project.coverImage,
    noIndex: true,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = PROJECTS.find((entry) => entry.slug === slug);
  if (!project) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const tPortfolio = await getTranslations({ locale: typedLocale, namespace: "portfolio" });
  const tServices = await getTranslations({ locale: typedLocale, namespace: "services" });

  const title = typedLocale === "es" ? project.titleEs : project.titleEn;
  const description = typedLocale === "es" ? project.descriptionEs : project.descriptionEn;

  return (
    <>
      <NavbarHero locale={typedLocale} variant="inner" />
      <main className="min-h-screen bg-off-white">
        <div className="bg-brand-navy py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 text-brand-yellow/70 hover:text-brand-yellow text-sm mb-8 transition-colors"
            >
              {"\u2190"} {tPortfolio("title")}
            </Link>
            <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-3">
              {project.client}
            </p>
            <h1 className="text-4xl md:text-6xl font-display text-white leading-none">
              {title}
            </h1>
          </div>
        </div>

        <div className="relative aspect-video max-h-[500px] overflow-hidden">
          <Image
            src={project.coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto px-8 py-16">
          <p className="text-lg text-brand-navy/70 leading-relaxed mb-12 max-w-2xl">
            {description}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.services.map((key) => {
              const Icon = SERVICE_ICONS[key as ServiceKey];

              return (
                <div
                  key={key}
                  className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm"
                >
                  {Icon ? <Icon size={16} className="text-brand-yellow" /> : null}
                  <span className="text-sm font-medium text-brand-navy">
                    {tServices(key as ServiceKey)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer locale={typedLocale} />
    </>
  );
}
