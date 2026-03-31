import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  getContactDeliveryMode,
  isContactDeliveryConfigured,
} from "../src/lib/contact-delivery.js";

describe("contact delivery configuration", () => {
  test("detects when resend delivery is configured", () => {
    assert.equal(isContactDeliveryConfigured({ RESEND_API_KEY: "test-key" }), true);
    assert.equal(isContactDeliveryConfigured({ RESEND_API_KEY: "" }), false);
  });

  test("rejects silent success in production when resend is missing", () => {
    assert.equal(getContactDeliveryMode({ NODE_ENV: "production" }), "misconfigured");
  });

  test("allows skipped delivery in development when resend is missing", () => {
    assert.equal(getContactDeliveryMode({ NODE_ENV: "development" }), "development");
  });

  test("marks delivery as active when resend is configured", () => {
    assert.equal(
      getContactDeliveryMode({ NODE_ENV: "production", RESEND_API_KEY: "test-key" }),
      "active"
    );
  });
});
