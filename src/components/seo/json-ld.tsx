import { SITE } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    email: SITE.email,
    telephone: SITE.phone,
    url: SITE.domain,
    hasMap: "https://www.google.com/maps/place/The+Monkeys/@18.6698995,-70.130055,15z",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
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
