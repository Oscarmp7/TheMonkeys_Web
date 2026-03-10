export function JsonLd({ locale }: { locale: string }) {
  const isEs = locale === "es";

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Monkeys",
    url: "https://themonkeys.do",
    logo: "https://themonkeys.do/logos/logo-main.png",
    description: isEs
      ? "Agencia creativa digital enfocada en ayudar a las marcas a crecer en el entorno digital moderno."
      : "Creative digital agency focused on helping brands grow in the modern digital environment.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressCountry: "DO",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-809-756-1847",
      contactType: "sales",
      email: "hola@themonkeys.do",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [
      "https://www.instagram.com/themonkeys.do/",
      "https://www.facebook.com/themonkeys.do",
      "https://www.linkedin.com/company/the-monkeysrd/",
      "https://www.youtube.com/@Themonkeysrd",
      "https://www.pinterest.com/themonkeysdo/",
    ],
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "The Monkeys",
    image: "https://themonkeys.do/logos/logo-main.png",
    telephone: "+1-809-756-1847",
    email: "hola@themonkeys.do",
    url: "https://themonkeys.do",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressCountry: "DO",
    },
    priceRange: "$$",
  };

  // JSON.stringify on static data produces safe output (no user input)
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
