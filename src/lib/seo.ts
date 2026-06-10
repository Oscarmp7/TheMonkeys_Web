import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

export type SeoRoute =
  | "home"
  | "services"
  | "about"
  | "contact";

/** Maps SEO routes to the internal hrefs declared in routing.pathnames. */
const ROUTE_HREFS: Record<SeoRoute, keyof typeof routing.pathnames> = {
  home: "/",
  services: "/servicios",
  about: "/nosotros",
  contact: "/contacto",
};

interface BuildPageMetadataOptions {
  locale: Locale;
  route: SeoRoute;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
}

const DEFAULT_SOCIAL_IMAGE = "/og.png";
const SOCIAL_IMAGE_WIDTH = 1200;
const SOCIAL_IMAGE_HEIGHT = 630;

function withBase(path: string): string {
  return new URL(path, SITE.domain).toString();
}

/**
 * Builds the public path for a route+locale from routing.pathnames —
 * the single source of truth. Mirrors localePrefix "as-needed":
 * default locale unprefixed, others under /<locale>.
 */
export function buildLocalizedPath(route: SeoRoute, locale: Locale): string {
  const pathname = routing.pathnames[ROUTE_HREFS[route]];
  const localized = typeof pathname === "string" ? pathname : pathname[locale];
  if (locale === routing.defaultLocale) return localized;
  return localized === "/" ? `/${locale}` : `/${locale}${localized}`;
}

export function buildPageMetadata({
  locale,
  route,
  title,
  description,
  type = "website",
  image = DEFAULT_SOCIAL_IMAGE,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = withBase(buildLocalizedPath(route, locale));
  const spanishUrl = withBase(buildLocalizedPath(route, "es"));
  const englishUrl = withBase(buildLocalizedPath(route, "en"));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "es-DO": spanishUrl,
        "en-US": englishUrl,
        "x-default": spanishUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: locale === "es" ? "es_DO" : "en_US",
      type,
      images: [
        {
          url: image,
          width: SOCIAL_IMAGE_WIDTH,
          height: SOCIAL_IMAGE_HEIGHT,
          alt: SITE.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
