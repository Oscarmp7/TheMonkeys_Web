/** Single source of truth for navigation links. Import everywhere — never redeclare. */
export const NAV_LINK_KEYS = ["inicio", "servicios", "contacto"] as const;
export type NavLinkKey = (typeof NAV_LINK_KEYS)[number];

export const NAV_ANCHORS: Record<NavLinkKey, string> = {
  inicio: "/",
  servicios: "/servicios",
  contacto: "#contacto",
};
