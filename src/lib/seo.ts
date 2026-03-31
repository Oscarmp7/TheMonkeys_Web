import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

export type SeoRoute =
  | "home"
  | "services"
  | "about"
  | "contact"
  | "portfolio"
  | "portfolioProject";

interface SeoParams {
  slug?: string;
}

interface BuildPageMetadataOptions {
  locale: Locale;
  route: SeoRoute;
  title: string;
  description: string;
  params?: SeoParams;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
}

const DEFAULT_SOCIAL_IMAGE = "/logos/logo-main.png";

function getPortfolioSlug(params?: SeoParams): string {
  if (!params?.slug) {
    throw new Error("SEO route 'portfolioProject' requires a slug.");
  }

  return params.slug;
}

function withBase(path: string): string {
  return new URL(path, SITE.domain).toString();
}

export function buildLocalizedPath(route: SeoRoute, locale: Locale, params?: SeoParams): string {
  switch (route) {
    case "home":
      return locale === "es" ? "/" : "/en";
    case "services":
      return locale === "es" ? "/servicios" : "/en/services";
    case "about":
      return locale === "es" ? "/nosotros" : "/en/about";
    case "contact":
      return locale === "es" ? "/contacto" : "/en/contact";
    case "portfolio":
      return locale === "es" ? "/portafolio" : "/en/portfolio";
    case "portfolioProject": {
      const slug = getPortfolioSlug(params);
      return locale === "es" ? `/portafolio/${slug}` : `/en/portfolio/${slug}`;
    }
    default:
      return "/";
  }
}

export function buildPageMetadata({
  locale,
  route,
  title,
  description,
  params,
  type = "website",
  image = DEFAULT_SOCIAL_IMAGE,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = withBase(buildLocalizedPath(route, locale, params));
  const spanishUrl = withBase(buildLocalizedPath(route, "es", params));
  const englishUrl = withBase(buildLocalizedPath(route, "en", params));

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
      images: [image],
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
