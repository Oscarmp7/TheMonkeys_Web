import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import esMessages from "../src/messages/es.json";
import { ContactForm } from "../src/components/ui/contact-form";
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
