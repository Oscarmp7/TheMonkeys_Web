import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Syne, DM_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import "@/app/globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    title: t("home_title"),
    description: t("home_description"),
    metadataBase: new URL(SITE.domain),
    icons: {
      icon: "/logos/mk-yellow.png",
      apple: "/logos/mk-yellow.png",
    },
    openGraph: {
      title: t("home_title"),
      description: t("home_description"),
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("home_title"),
      description: t("home_description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Required for next-intl static rendering
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${anton.variable} ${barlowCondensed.variable} ${syne.variable} ${dmMono.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
