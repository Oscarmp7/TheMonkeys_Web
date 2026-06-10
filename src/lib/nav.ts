/** Single source of truth for navigation links. Import everywhere - never redeclare. */

/** Keys used in the navbar pill on all pages. */
export const NAV_LINK_KEYS = ["inicio", "servicios", "nosotros", "portafolio", "contacto"] as const;
export type NavLinkKey = (typeof NAV_LINK_KEYS)[number];

/**
 * Internal route targets for navbar keys.
 * "portafolio" is intentionally absent — it is an external Behance link (SITE.behance).
 */
export const NAV_ROUTES = {
  inicio: "/",
  servicios: "/servicios",
  nosotros: "/nosotros",
  contacto: "/contacto",
} as const;
export type NavRouteKey = keyof typeof NAV_ROUTES;
