import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Footer } from "@/components/layout/footer";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { ContactoContent } from "@/components/pages/contacto-content";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
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
  const t = await getTranslations({ locale: locale as Locale, namespace: "contact_page" });
  return buildPageMetadata({
    locale: locale as Locale,
    route: "contact",
    title: t("meta_title"),
    description: t("meta_description"),
  });
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <NavbarHero locale={locale as Locale} variant="inner" />
      <main>
        <ContactoContent homeHref={`/${locale}`} />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
