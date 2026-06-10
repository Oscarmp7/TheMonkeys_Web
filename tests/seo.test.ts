import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildLocalizedPath, buildPageMetadata } from "../src/lib/seo.js";

describe("SEO routing helpers", () => {
  test("builds localized public paths for default and secondary locale", () => {
    assert.equal(buildLocalizedPath("home", "es"), "/");
    assert.equal(buildLocalizedPath("home", "en"), "/en");
    assert.equal(buildLocalizedPath("services", "es"), "/servicios");
    assert.equal(buildLocalizedPath("services", "en"), "/en/services");
    assert.equal(buildLocalizedPath("about", "es"), "/nosotros");
    assert.equal(buildLocalizedPath("about", "en"), "/en/about");
    assert.equal(buildLocalizedPath("contact", "es"), "/contacto");
    assert.equal(buildLocalizedPath("contact", "en"), "/en/contact");
  });

  test("builds canonical and hreflang alternates for localized pages", () => {
    const metadata = buildPageMetadata({
      locale: "es",
      route: "services",
      title: "Servicios | The Monkeys",
      description: "Servicios integrados de marketing.",
    });

    assert.equal(metadata.alternates?.canonical, "https://themonkeys.do/servicios");
    assert.equal(
      metadata.alternates?.languages?.["es-DO"],
      "https://themonkeys.do/servicios"
    );
    assert.equal(
      metadata.alternates?.languages?.["en-US"],
      "https://themonkeys.do/en/services"
    );
    assert.equal(
      metadata.alternates?.languages?.["x-default"],
      "https://themonkeys.do/servicios"
    );
  });

  test("builds page-specific social metadata instead of inheriting home defaults", () => {
    const metadata = buildPageMetadata({
      locale: "en",
      route: "contact",
      title: "Contact | The Monkeys",
      description: "Tell us about your brand.",
    });

    assert.equal(metadata.openGraph?.title, "Contact | The Monkeys");
    assert.equal(metadata.openGraph?.description, "Tell us about your brand.");
    assert.equal(metadata.openGraph?.url, "https://themonkeys.do/en/contact");
    assert.equal(metadata.twitter?.title, "Contact | The Monkeys");
    assert.deepEqual(metadata.twitter?.images, ["/og.png"]);
    assert.deepEqual(metadata.openGraph?.images, [
      { url: "/og.png", width: 1200, height: 630, alt: "The Monkeys" },
    ]);
  });

  test("can mark secondary pages as noindex without affecting canonical metadata", () => {
    const metadata = buildPageMetadata({
      locale: "es",
      route: "contact",
      title: "Contacto | The Monkeys",
      description: "Cuéntanos sobre tu marca.",
      noIndex: true,
    });

    assert.equal(metadata.alternates?.canonical, "https://themonkeys.do/contacto");
    assert.deepEqual(metadata.robots, { index: false, follow: true });
  });
});
