import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";
import { buildLocalizedPath, type SeoRoute } from "@/lib/seo";

const ROUTES: { route: SeoRoute; priority: number }[] = [
  { route: "home", priority: 1 },
  { route: "services", priority: 0.8 },
  { route: "about", priority: 0.8 },
  { route: "contact", priority: 0.9 },
];

function absoluteUrl(route: SeoRoute, locale: (typeof routing.locales)[number]): string {
  return new URL(buildLocalizedPath(route, locale), SITE.domain).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ route, priority }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(route, locale),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: {
          "es-DO": absoluteUrl(route, "es"),
          "en-US": absoluteUrl(route, "en"),
        },
      },
    }))
  );
}
