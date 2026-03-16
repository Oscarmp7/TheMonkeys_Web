import { SITE } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    email: SITE.email,
    telephone: SITE.phone,
    url: SITE.domain,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressCountry: "DO",
    },
    sameAs: [SITE.instagram, SITE.linkedin, SITE.facebook, SITE.youtube],
    serviceType: ["SEO", "Web Development", "Digital Marketing", "Content Production"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
