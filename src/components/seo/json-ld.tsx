import {
  getLocalBusinessSchema,
  getOrganizationSchema,
  type AppLocale,
  type SiteSettings,
} from "@/lib/site-data";

export function JsonLd({
  locale,
  settings,
}: {
  locale: AppLocale;
  settings: SiteSettings;
}) {
  const organizationData = getOrganizationSchema(locale, settings);
  const localBusinessData = getLocalBusinessSchema(settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
    </>
  );
}
