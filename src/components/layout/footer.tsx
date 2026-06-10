import { useTranslations } from "next-intl";
import { EditorialFooter } from "@/components/ui/footer";
import { SOCIALS_CONFIG } from "@/lib/socials";
import { SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");
  const location = SITE.location[locale];

  return (
    <EditorialFooter
      logoSrc="/logos/logo-main.png"
      logoAlt={SITE.name}
      kicker={t("kicker")}
      description={t("description")}
      contactTitle={t("contact_title")}
      contactItems={[
        { label: t("email_label"), value: SITE.email, href: `mailto:${SITE.email}` },
        { label: t("phone_label"), value: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
        { label: t("location_label"), value: location },
      ]}
      socialTitle={t("social_title")}
      socialLinks={SOCIALS_CONFIG.map(({ href, icon: Icon, label }) => ({
        href,
        label,
        icon: <Icon size={16} aria-hidden="true" />,
      }))}
      bottomLocation={location}
      bottomRights={t("rights", { year: new Date().getFullYear() })}
      bottomSignature={t("signature")}
    />
  );
}
