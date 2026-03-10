import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  clientLogosQuery,
  projectsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

export type AppLocale = "es" | "en";

type LocalizedValue = {
  es?: string | null;
  en?: string | null;
};

type SanityProject = {
  _id: string;
  title?: LocalizedValue | null;
  slug?: { current?: string | null } | null;
  mainImage?: unknown;
  description?: LocalizedValue | null;
  services?: string[] | null;
  featured?: boolean | null;
};

type SanityClientLogo = {
  _id: string;
  name?: string | null;
  logo?: unknown;
  url?: string | null;
};

type SanitySiteSettings = {
  seoTitle?: LocalizedValue | null;
  seoDescription?: LocalizedValue | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
};

export type PortfolioProject = {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  services: string[];
  featured: boolean;
};

export type ClientLogo = {
  _id: string;
  name: string;
  src: string;
  href?: string;
};

export type SiteSettings = {
  seoTitle: string;
  seoDescription: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
};

export type SocialLink = {
  href: string;
  label: "Instagram" | "Facebook" | "LinkedIn" | "YouTube" | "Pinterest";
};

const FALLBACK_SITE_SETTINGS: Record<AppLocale, SiteSettings> = {
  es: {
    seoTitle: "The Monkeys | Agencia Creativa Digital",
    seoDescription:
      "Ayudamos a las marcas a crecer en el entorno digital a traves de estrategias de comunicacion modernas, creativas y orientadas a resultados.",
    phone: "(809) 756-1847",
    email: "hola@themonkeys.do",
    whatsapp: "18097561847",
    address: "Santiago de los Caballeros, Republica Dominicana",
  },
  en: {
    seoTitle: "The Monkeys | Creative Digital Agency",
    seoDescription:
      "We help brands grow in the digital space through modern, creative, and results-oriented communication strategies.",
    phone: "(809) 756-1847",
    email: "hola@themonkeys.do",
    whatsapp: "18097561847",
    address: "Santiago de los Caballeros, Dominican Republic",
  },
};

const SERVICE_LABELS: Record<string, Record<AppLocale, string>> = {
  inbound: { es: "Inbound Marketing", en: "Inbound Marketing" },
  content_production: {
    es: "Produccion de Contenidos",
    en: "Content Production",
  },
  seo: { es: "SEO", en: "SEO" },
  web_dev: { es: "Desarrollo Web", en: "Web Development" },
  influencers: {
    es: "Marketing de Influencers",
    en: "Influencer Marketing",
  },
  campaigns: { es: "Campana Digital", en: "Digital Campaigns" },
  content_creation: {
    es: "Creacion de Contenido",
    en: "Content Creation",
  },
};

const FALLBACK_PROJECTS: Record<AppLocale, PortfolioProject[]> = {
  es: [
    {
      _id: "jimetor",
      title: "Jimetor Eco Village",
      slug: "jimetor",
      image: "/portfolio/jimetor-logo.jpeg",
      description:
        "Branding, fotografia, video, manejo de redes sociales y SEO para Jimetor Eco Village.",
      services: [
        "Produccion de Contenidos",
        "SEO",
        "Creacion de Contenido",
      ],
      featured: true,
    },
  ],
  en: [
    {
      _id: "jimetor",
      title: "Jimetor Eco Village",
      slug: "jimetor",
      image: "/portfolio/jimetor-logo.jpeg",
      description:
        "Branding, photography, video, social media management, and SEO for Jimetor Eco Village.",
      services: ["Content Production", "SEO", "Content Creation"],
      featured: true,
    },
  ],
};

const FALLBACK_CLIENT_LOGOS: ClientLogo[] = [
  {
    _id: "jimetor",
    name: "Jimetor Eco Village",
    src: "/portfolio/jimetor-logo.jpeg",
  },
];

export const socialLinks: SocialLink[] = [
  {
    href: "https://www.instagram.com/themonkeys.do/",
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/themonkeys.do",
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/the-monkeysrd/",
    label: "LinkedIn",
  },
  {
    href: "https://www.youtube.com/@Themonkeysrd",
    label: "YouTube",
  },
  {
    href: "https://www.pinterest.com/themonkeysdo/",
    label: "Pinterest",
  },
];

function getLocalizedValue(
  value: LocalizedValue | null | undefined,
  locale: AppLocale,
  fallback: string,
) {
  return value?.[locale] ?? value?.es ?? value?.en ?? fallback;
}

function getServiceLabel(service: string, locale: AppLocale) {
  return SERVICE_LABELS[service]?.[locale] ?? service;
}

function toAbsoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `https://themonkeys.do${path}`;
}

function toPhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function getWhatsAppHref(locale: AppLocale, customNumber?: string) {
  const phone = toPhoneDigits(customNumber ?? FALLBACK_SITE_SETTINGS[locale].whatsapp);
  const message =
    locale === "es"
      ? "Hola, me interesa conocer mas sobre sus servicios."
      : "Hello, I would like to learn more about your services.";

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export async function getSiteSettings(locale: AppLocale): Promise<SiteSettings> {
  if (!client) {
    return FALLBACK_SITE_SETTINGS[locale];
  }

  try {
    const data = await client.fetch<SanitySiteSettings | null>(siteSettingsQuery);
    const fallback = FALLBACK_SITE_SETTINGS[locale];

    return {
      seoTitle: getLocalizedValue(data?.seoTitle, locale, fallback.seoTitle),
      seoDescription: getLocalizedValue(
        data?.seoDescription,
        locale,
        fallback.seoDescription,
      ),
      phone: data?.phone ?? fallback.phone,
      email: data?.email ?? fallback.email,
      whatsapp: data?.whatsapp ?? fallback.whatsapp,
      address: data?.address ?? fallback.address,
    };
  } catch {
    return FALLBACK_SITE_SETTINGS[locale];
  }
}

export async function getPortfolioProjects(
  locale: AppLocale,
): Promise<PortfolioProject[]> {
  if (!client) {
    return FALLBACK_PROJECTS[locale];
  }

  try {
    const projects = await client.fetch<SanityProject[]>(projectsQuery);

    if (!projects.length) {
      return FALLBACK_PROJECTS[locale];
    }

    const normalizedProjects = projects
      .map((project) => {
        const image = project.mainImage
          ? urlFor(project.mainImage)?.width(1200).height(900).fit("crop").url()
          : null;

        return {
          _id: project._id,
          title: getLocalizedValue(project.title, locale, "Proyecto"),
          slug: project.slug?.current ?? project._id,
          image: image ?? "/portfolio/jimetor-logo.jpeg",
          description: getLocalizedValue(
            project.description,
            locale,
            locale === "es" ? "Proyecto destacado" : "Featured project",
          ),
          services: (project.services ?? []).map((service) =>
            getServiceLabel(service, locale),
          ),
          featured: Boolean(project.featured),
        };
      })
      .filter((project) => project.title && project.image);

    return normalizedProjects.length
      ? normalizedProjects
      : FALLBACK_PROJECTS[locale];
  } catch {
    return FALLBACK_PROJECTS[locale];
  }
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  if (!client) {
    return FALLBACK_CLIENT_LOGOS;
  }

  try {
    const logos = await client.fetch<SanityClientLogo[]>(clientLogosQuery);

    if (!logos.length) {
      return FALLBACK_CLIENT_LOGOS;
    }

    const normalizedLogos = logos
      .map((logo): ClientLogo | null => {
        const src = logo.logo
          ? urlFor(logo.logo)?.width(360).height(160).fit("clip").url()
          : null;

        if (!src || !logo.name) {
          return null;
        }

        return {
          _id: logo._id,
          name: logo.name,
          src,
          href: logo.url ?? undefined,
        };
      })
      .filter((logo): logo is ClientLogo => Boolean(logo));

    return normalizedLogos.length ? normalizedLogos : FALLBACK_CLIENT_LOGOS;
  } catch {
    return FALLBACK_CLIENT_LOGOS;
  }
}

export function getOrganizationSchema(locale: AppLocale, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Monkeys",
    url: "https://themonkeys.do",
    logo: toAbsoluteUrl("/logos/logo-main.png"),
    description: settings.seoDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressCountry: "DO",
      streetAddress: settings.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${toPhoneDigits(settings.whatsapp)}`,
      contactType: "sales",
      email: settings.email,
      availableLanguage: locale === "es" ? ["Spanish", "English"] : ["English", "Spanish"],
    },
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function getLocalBusinessSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "The Monkeys",
    image: toAbsoluteUrl("/logos/logo-main.png"),
    telephone: `+${toPhoneDigits(settings.whatsapp)}`,
    email: settings.email,
    url: "https://themonkeys.do",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressCountry: "DO",
      streetAddress: settings.address,
    },
    priceRange: "$$",
  };
}
