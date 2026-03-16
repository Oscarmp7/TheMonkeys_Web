import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  validateContactForm,
  sanitize,
  escapeHtml,
  MAX_LENGTHS,
} from "../src/lib/validation.js";

const validBody = {
  name: "Ana García",
  email: "ana@test.com",
  service: "seo",
  message: "Me gustaría cotizar.",
};

describe("API contact — validation layer", () => {
  test("accepts valid contact form", () => {
    const { valid } = validateContactForm(validBody);
    assert.ok(valid);
  });

  test("rejects empty name", () => {
    const { valid, errors } = validateContactForm({ ...validBody, name: "" });
    assert.ok(!valid);
    assert.ok(errors.name);
  });

  test("rejects invalid email", () => {
    const { valid, errors } = validateContactForm({
      ...validBody,
      email: "not-an-email",
    });
    assert.ok(!valid);
    assert.ok(errors.email);
  });

  test("rejects empty service", () => {
    const { valid, errors } = validateContactForm({ ...validBody, service: "" });
    assert.ok(!valid);
    assert.ok(errors.service);
  });

  test("rejects empty message", () => {
    const { valid, errors } = validateContactForm({ ...validBody, message: "" });
    assert.ok(!valid);
    assert.ok(errors.message);
  });
});

describe("API contact — sanitize layer", () => {
  test("sanitize strips leading/trailing whitespace", () => {
    assert.equal(sanitize("  hello  ", 100), "hello");
  });

  test("sanitize enforces maxLength", () => {
    assert.equal(sanitize("abcde", 3), "abc");
  });

  test("escapeHtml prevents XSS in name field", () => {
    const evil = '<script>alert("xss")</script>';
    const safe = escapeHtml(sanitize(evil, MAX_LENGTHS.name));
    assert.ok(!safe.includes("<script>"));
    assert.ok(safe.includes("&lt;script&gt;"));
  });
});

describe("API contact — sanitize edge cases", () => {
  test("sanitize handles empty string", () => {
    assert.equal(sanitize("", 100), "");
  });

  test("escapeHtml neutralizes single quotes", () => {
    const result = escapeHtml("it's a test");
    assert.ok(result.includes("&#x27;"));
  });

  test("sanitize + escapeHtml on email prevents HTML injection", () => {
    const evil = '"<img src=x>"@example.com';
    const safe = escapeHtml(sanitize(evil, MAX_LENGTHS.email));
    assert.ok(!safe.includes("<img"));
    assert.ok(safe.includes("&lt;img"));
  });
});
