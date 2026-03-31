/** Single source of truth for navigation links. Import everywhere - never redeclare. */

/** Keys used in the navbar pill on all pages. */
export const NAV_LINK_KEYS = ["inicio", "servicios", "nosotros", "portafolio", "contacto"] as const;
export type NavLinkKey = (typeof NAV_LINK_KEYS)[number];

export const NAV_ANCHORS: Record<NavLinkKey, string> = {
  inicio: "/",
  servicios: "/servicios",
  nosotros: "/nosotros",
  portafolio: "BEHANCE", // sentinel - handled as external Behance link
  contacto: "/contacto",
};

/** @deprecated Use NAV_LINK_KEYS + NavbarHero variant="inner" instead. */
export const INNER_NAV_KEYS = ["inicio", "servicios", "nosotros", "portafolio"] as const;
export type InnerNavKey = (typeof INNER_NAV_KEYS)[number];

/** @deprecated */
export const INNER_NAV_TARGETS: Record<InnerNavKey, string> = {
  inicio: "/",
  servicios: "/servicios",
  nosotros: "/nosotros",
  portafolio: "BEHANCE",
};
