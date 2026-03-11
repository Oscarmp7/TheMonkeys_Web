import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import esMessages from "../src/messages/es.json";
import {
  ContactForm,
  validateContactFormValues,
} from "../src/components/ui/contact-form";
import { HamburgerButton } from "../src/components/ui/hamburger-button";

function renderWithMessages(node: React.ReactElement) {
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    return renderToStaticMarkup(
      React.createElement(
        NextIntlClientProvider,
        { locale: "es", messages: esMessages } as unknown as React.ComponentProps<typeof NextIntlClientProvider>,
        node,
      ),
    );
  } finally {
    console.error = originalConsoleError;
  }
}

test("contact form renders visible labels for every required field", () => {
  const html = renderWithMessages(React.createElement(ContactForm));

  assert.match(html, /<label[^>]*for="name"/i);
  assert.match(html, /<label[^>]*for="email"/i);
  assert.match(html, /<label[^>]*for="service"/i);
  assert.match(html, /<label[^>]*for="message"/i);
});

test("contact form exposes a live region for submission feedback", () => {
  const html = renderWithMessages(React.createElement(ContactForm));

  assert.match(html, /aria-live="polite"/i);
});

test("contact form validation requires missing fields before submit", () => {
  const errors = validateContactFormValues(
    {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
      website: "",
    },
    {
      required: "This field is required.",
      invalidEmail: "Enter a valid email address.",
    },
  );

  assert.deepEqual(errors, {
    name: "This field is required.",
    email: "This field is required.",
    service: "This field is required.",
    message: "This field is required.",
  });
});

test("contact form validation rejects invalid email format", () => {
  const errors = validateContactFormValues(
    {
      name: "Oscar",
      email: "not-an-email",
      company: "",
      service: "SEO",
      message: "Necesito una propuesta.",
      website: "",
    },
    {
      required: "This field is required.",
      invalidEmail: "Enter a valid email address.",
    },
  );

  assert.equal(errors.email, "Enter a valid email address.");
});

test("hamburger button exposes expanded state and controlled menu id", () => {
  const closedHtml = renderToStaticMarkup(
    React.createElement(HamburgerButton, {
      isOpen: false,
      onClick: () => {},
    }),
  );

  const openHtml = renderToStaticMarkup(
    React.createElement(HamburgerButton, {
      isOpen: true,
      onClick: () => {},
    }),
  );

  assert.match(closedHtml, /aria-expanded="false"/i);
  assert.match(openHtml, /aria-expanded="true"/i);
  assert.match(openHtml, /aria-controls=/i);
});
