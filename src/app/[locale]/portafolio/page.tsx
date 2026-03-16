import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ui/project-card";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
      <main className="min-h-screen bg-off-white">
        {/* Header */}
        <div className="bg-brand-navy py-24 px-8">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-yellow/70 hover:text-brand-yellow text-sm mb-8 transition-colors"
            >
              ← {tNav("inicio")}
            </Link>
            <h1 className="text-5xl md:text-7xl font-display text-white leading-none">
              {t("title")}
            </h1>
          </div>
        </div>

        {/* Projects grid */}
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale as Locale}
                index={i}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </>
  );
}
