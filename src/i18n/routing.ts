import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/servicios": { es: "/servicios", en: "/services" },
    "/portafolio": { es: "/portafolio", en: "/portfolio" },
    "/portafolio/[slug]": { es: "/portafolio/[slug]", en: "/portfolio/[slug]" },
  },
});

export type Locale = (typeof routing.locales)[number];
