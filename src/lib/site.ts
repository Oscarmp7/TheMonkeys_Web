/** Site-wide constants. Single source of truth. */
export const SITE = {
  name: "The Monkeys",
  email: "hola@themonkeys.do",
  contactFrom: "contacto@themonkeys.do",
  phone: "+18097561847",
  phoneDisplay: "+1 (809) 756-1847",
  whatsapp: "+18097561847",
  location: { es: "Santiago de los Caballeros, RD", en: "Santiago de los Caballeros, DR" },
  domain: "https://themonkeys.do",
  instagram: "https://www.instagram.com/themonkeys.do/",
  linkedin: "https://www.linkedin.com/company/the-monkeysrd/",
  facebook: "https://www.facebook.com/themonkeys.do",
  youtube: "https://www.youtube.com/@Themonkeysrd",
  pinterest: "https://www.pinterest.com/themonkeysdo/",
  behance: "https://www.behance.net/themonkeys",
} as const;

/** Builds the wa.me link, optionally with a prefilled (localized) message. */
export function buildWhatsAppHref(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp.replace(/^\+/, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Tracking container/property IDs. Env vars override for staging setups. */
export const ANALYTICS = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-5P4794W5",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-DJB60KVLWB",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2481755865582352",
} as const;
