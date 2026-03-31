import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { ProjectCard } from "@/components/ui/project-card";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/lib/portfolio";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale: locale as Locale,
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

export default async function PortafolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: "portfolio" });
  const tNav = await getTranslations({ locale: locale as Locale, namespace: "nav" });

  return (
    <>
      <NavbarHero locale={locale as Locale} variant="inner" />
      <main className="min-h-screen bg-off-white">
        <div className="bg-brand-navy py-24 px-8">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-yellow/70 hover:text-brand-yellow text-sm mb-8 transition-colors"
            >
              {"\u2190"} {tNav("inicio")}
            </Link>
            <h1 className="text-5xl md:text-7xl font-display text-white leading-none">
              {t("title")}
            </h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.slug} project={project} locale={locale as Locale} index={index} />
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </>
  );
}
