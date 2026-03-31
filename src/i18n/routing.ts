import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/servicios": { es: "/servicios", en: "/services" },
    "/nosotros": { es: "/nosotros", en: "/about" },
    "/portafolio": { es: "/portafolio", en: "/portfolio" },
    "/portafolio/[slug]": { es: "/portafolio/[slug]", en: "/portfolio/[slug]" },
    "/contacto": { es: "/contacto", en: "/contact" },
  },
});

export type Locale = (typeof routing.locales)[number];
