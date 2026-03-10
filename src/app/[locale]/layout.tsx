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
  const isEs = locale === "es";

  return {
    title: isEs
      ? "The Monkeys | Agencia Creativa Digital"
      : "The Monkeys | Creative Digital Agency",
    description: isEs
      ? "Ayudamos a las marcas a crecer en el entorno digital a través de estrategias de comunicación modernas, creativas y orientadas a resultados."
      : "We help brands grow in the digital environment through modern, creative, and results-oriented communication strategies.",
    icons: {
      icon: "/logos/mk-main.png",
      apple: "/logos/mk-main.png",
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: isEs
        ? "The Monkeys | Agencia Creativa Digital"
        : "The Monkeys | Creative Digital Agency",
      description: isEs
        ? "Agencia creativa digital en Santiago de los Caballeros, RD. Marketing digital, branding, SEO y más."
        : "Creative digital agency in Santiago de los Caballeros, DR. Digital marketing, branding, SEO and more.",
      url: `${baseUrl}/${locale}`,
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
      title: isEs
        ? "The Monkeys | Agencia Creativa Digital"
        : "The Monkeys | Creative Digital Agency",
      description: isEs
        ? "Agencia creativa digital en Santiago de los Caballeros, RD."
        : "Creative digital agency in Santiago de los Caballeros, DR.",
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
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd locale={locale} />
        <GoogleAnalytics />
        <MetaPixel />
      </head>
      <body className="font-body">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            {children}
            <Footer />
            <WhatsAppButton />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
