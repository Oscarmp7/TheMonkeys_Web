import { SITE } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE.domain,
    name: SITE.name,
    email: SITE.email,
    telephone: SITE.phone,
    url: SITE.domain,
    image: `${SITE.domain}/logos/logo-main.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressRegion: "Santiago",
      addressCountry: "DO",
    },
    sameAs: [SITE.instagram, SITE.linkedin, SITE.facebook, SITE.youtube, SITE.behance],
    serviceType: ["SEO", "Web Development", "Digital Marketing", "Content Production", "Brand Strategy", "Influencer Marketing"],
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
