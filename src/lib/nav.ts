/** Single source of truth for navigation links. Import everywhere — never redeclare. */
export const NAV_LINK_KEYS = ["contacto", "nosotros", "servicios"] as const;
export type NavLinkKey = (typeof NAV_LINK_KEYS)[number];

export const NAV_ANCHORS: Record<NavLinkKey, string> = {
  contacto: "#contacto",
  nosotros: "#nosotros",
  servicios: "/servicios",
};
