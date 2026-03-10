import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { getSiteSettings, type AppLocale } from "@/lib/site-data";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const baseUrl = "https://themonkeys.do";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale: AppLocale = locale === "en" ? "en" : "es";
  const isEs = appLocale === "es";
  const siteSettings = await getSiteSettings(appLocale);

  return {
    title: siteSettings.seoTitle,
    description: siteSettings.seoDescription,
    icons: {
      icon: "/logos/mk-main.png",
      apple: "/logos/mk-main.png",
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${appLocale}`,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: siteSettings.seoTitle,
      description: siteSettings.seoDescription,
      url: `${baseUrl}/${appLocale}`,
      siteName: "The Monkeys",
      locale: isEs ? "es_DO" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/logos/logo-main.png`,
          width: 1200,
          height: 630,
          alt: "The Monkeys",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteSettings.seoTitle,
      description: siteSettings.seoDescription,
      images: [`${baseUrl}/logos/logo-main.png`],
    },
    robots: {
      index: true,
      follow: true,
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
  const appLocale: AppLocale = locale === "en" ? "en" : "es";
  const messages = await getMessages();
  const siteSettings = await getSiteSettings(appLocale);
  const skipLabel =
    appLocale === "es"
      ? "Saltar al contenido principal"
      : "Skip to main content";

  return (
    <html
      lang={appLocale}
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd locale={appLocale} settings={siteSettings} />
        <GoogleAnalytics />
        <MetaPixel />
      </head>
      <body className="font-body">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <a href="#main-content" className="skip-link">
              {skipLabel}
            </a>
            <Navbar />
            {children}
            <Footer settings={siteSettings} />
            <WhatsAppButton locale={appLocale} phone={siteSettings.whatsapp} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
