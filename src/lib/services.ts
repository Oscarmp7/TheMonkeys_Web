/**
 * Single source of truth for service keys (order = display order).
 * Translation content lives under services_section.cards.* (home) and
 * services_page.services.* (services page) using these same keys.
 */
export const SERVICE_KEYS = [
  "strategy",
  "content",
  "campaigns",
  "inbound",
  "seo",
  "web",
  "influencers",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

/** Contact form adds a catch-all option on top of the canonical list. */
export const CONTACT_SERVICE_KEYS = [...SERVICE_KEYS, "full"] as const;
export type ContactServiceKey = (typeof CONTACT_SERVICE_KEYS)[number];
