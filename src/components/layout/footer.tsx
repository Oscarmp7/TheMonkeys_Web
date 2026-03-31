import { EditorialFooter } from "@/components/ui/footer";
import { SOCIALS_CONFIG } from "@/lib/socials";
import type { Locale } from "@/i18n/routing";

export function Footer({ locale }: { locale: Locale }) {
  const phoneFormatted = "+1 (809) 756-1847";
  const location =
    locale === "es" ? "Santiago de los Caballeros, RD" : "Santiago de los Caballeros, DR";

  const copy =
    locale === "es"
      ? {
          kicker: "Marketing con direccion",
          description:
            "Estrategia, contenido, produccion y campanas en un solo equipo. Todo conectado, todo con una misma logica creativa y comercial.",
          navTitle: "Navegacion",
          contactTitle: "Contacto",
          socialTitle: "Presencia",
          portfolio: "Portafolio",
          locationLabel: "Base",
          rights: `© ${new Date().getFullYear()} The Monkeys. Todos los derechos reservados`,
          signature: "the monkeys / marketing with direction",
        }
      : {
          kicker: "Marketing with direction",
          description:
            "Strategy, content, production and campaigns in one team. Everything connected, guided by the same creative and commercial logic.",
          navTitle: "Navigation",
          contactTitle: "Contact",
          socialTitle: "Presence",
          portfolio: "Portfolio",
          locationLabel: "Base",
          rights: `© ${new Date().getFullYear()} The Monkeys. All rights reserved`,
          signature: "the monkeys / marketing with direction",
        };

  return (
    <EditorialFooter
      logoSrc="/logos/logo-main.png"
      logoAlt="The Monkeys"
      kicker={copy.kicker}
      description={copy.description}
      navTitle={copy.navTitle}
      navLinks={[
        { label: locale === "es" ? "Inicio" : "Home", href: "/" },
        { label: locale === "es" ? "Servicios" : "Services", href: "/servicios" },
        { label: locale === "es" ? "Nosotros" : "About Us", href: "/nosotros" },
        { label: copy.portfolio, href: "https://www.behance.net/themonkeys", external: true },
        { label: locale === "es" ? "Contacto" : "Contact", href: "/contacto" },
      ]}
      contactTitle={copy.contactTitle}
      contactItems={[
        { label: "Email", value: "hola@themonkeys.do", href: "mailto:hola@themonkeys.do" },
        { label: "Tel", value: phoneFormatted, href: "tel:+18097561847" },
        { label: copy.locationLabel, value: location },
      ]}
      socialTitle={copy.socialTitle}
      socialLinks={SOCIALS_CONFIG.map(({ href, icon: Icon, label }) => ({
        href,
        label,
        icon: <Icon size={16} aria-hidden="true" />,
      }))}
      bottomLocation={location}
      bottomRights={copy.rights}
      bottomSignature={copy.signature}
    />
  );
}
