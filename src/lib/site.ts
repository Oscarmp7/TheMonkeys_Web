/** Site-wide constants. Single source of truth. */
export const SITE = {
  name: "The Monkeys",
  email: "hola@themonkeys.do",
  phone: "+18097561847",
  whatsapp: "+18097561847",
  location: { es: "Santiago de los Caballeros, RD", en: "Santiago de los Caballeros, DR" },
  domain: "https://themonkeys.do",
  instagram: "https://www.instagram.com/themonkeys.do/",
  linkedin: "https://www.linkedin.com/company/the-monkeysrd/",
  facebook: "https://www.facebook.com/themonkeys.do",
  youtube: "https://www.youtube.com/@Themonkeysrd",
  pinterest: "https://www.pinterest.com/themonkeysdo/",
} as const;

export function getWhatsAppHref(messageEs: string, locale: "es" | "en"): string {
  const messages = {
    es: encodeURIComponent(messageEs),
    en: encodeURIComponent("Hi! I'd like to get a quote from The Monkeys."),
  };
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${messages[locale]}`;
}
