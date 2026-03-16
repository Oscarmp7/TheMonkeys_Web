import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SERVICE_KEYS, SERVICE_ICONS } from "@/lib/services";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: locale as Locale, namespace: "services" });
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

        {/* Services grid */}
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_KEYS.map((key) => {
              const Icon = SERVICE_ICONS[key];
              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center">
                    <Icon size={24} className="text-brand-yellow" />
                  </div>
                  <h2 className="text-xl font-semibold text-brand-navy">{t(key)}</h2>
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
