import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "@/lib/portfolio";
import { SERVICE_ICONS, type ServiceKey } from "@/lib/services";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((project) => ({ locale, slug: project.slug }))
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const tPortfolio = await getTranslations({ locale: locale as Locale, namespace: "portfolio" });
  const tServices = await getTranslations({ locale: locale as Locale, namespace: "services" });

  const title = locale === "es" ? project.titleEs : project.titleEn;
  const description = locale === "es" ? project.descriptionEs : project.descriptionEn;

  return (
    <>
      <main className="min-h-screen bg-off-white">
        {/* Header */}
        <div className="bg-brand-navy py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 text-brand-yellow/70 hover:text-brand-yellow text-sm mb-8 transition-colors"
            >
              ← {tPortfolio("title")}
            </Link>
            <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-3">
              {project.client}
            </p>
            <h1 className="text-4xl md:text-6xl font-display text-white leading-none">
              {title}
            </h1>
          </div>
        </div>

        {/* Cover image */}
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-16">
          <p className="text-lg text-brand-navy/70 leading-relaxed mb-12 max-w-2xl">
            {description}
          </p>

          {/* Services used */}
          <div className="flex flex-wrap gap-3">
            {project.services.map((key) => {
              const Icon = SERVICE_ICONS[key as ServiceKey];
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm"
                >
                  {Icon && <Icon size={16} className="text-brand-yellow" />}
                  <span className="text-sm font-medium text-brand-navy">
                    {tServices(key as ServiceKey)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </>
  );
}
