import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, escapeHtml, sanitize, validateContactForm } from "../src/lib/validation.js";

describe("isValidEmail", () => {
  test("accepts valid email", () => assert.ok(isValidEmail("test@example.com")));
  test("accepts plus-addressed email", () => assert.ok(isValidEmail("user+tag@domain.co")));
  test("rejects missing @", () => assert.ok(!isValidEmail("notanemail")));
  test("rejects empty string", () => assert.ok(!isValidEmail("")));
  test("rejects missing TLD", () => assert.ok(!isValidEmail("user@domain")));
});

describe("escapeHtml", () => {
  test("escapes < and >", () => assert.equal(escapeHtml("<script>"), "&lt;script&gt;"));
  test("escapes &", () => assert.equal(escapeHtml("a & b"), "a &amp; b"));
  test("escapes double quotes", () => assert.equal(escapeHtml('"hello"'), "&quot;hello&quot;"));
  test("escapes single quotes", () => assert.equal(escapeHtml("it's"), "it&#x27;s"));
});

describe("sanitize", () => {
  test("trims whitespace", () => assert.equal(sanitize("  hello  ", 100), "hello"));
  test("slices to maxLength", () => assert.equal(sanitize("hello", 3), "hel"));
  test("trims then slices", () => assert.equal(sanitize("  hello  ", 3), "hel"));
});

describe("validateContactForm", () => {
  const valid = { name: "Ana", email: "ana@test.com", service: "seo", message: "Hola" };

  test("returns valid for complete form", () => assert.ok(validateContactForm(valid).valid));
  test("returns error for empty name", () =>
    assert.ok(validateContactForm({ ...valid, name: "" }).errors.name));
  test("returns error for whitespace-only name", () =>
    assert.ok(validateContactForm({ ...valid, name: "   " }).errors.name));
  test("returns error for invalid email", () =>
    assert.ok(validateContactForm({ ...valid, email: "bad" }).errors.email));
  test("returns error for empty message", () =>
    assert.ok(validateContactForm({ ...valid, message: "" }).errors.message));
  test("returns error for whitespace-only message", () =>
    assert.ok(validateContactForm({ ...valid, message: "   " }).errors.message));
  test("allows optional company to be absent", () =>
    assert.ok(validateContactForm(valid).valid));
  test("returns error for empty service", () =>
    assert.ok(validateContactForm({ ...valid, service: "" }).errors.service));
});
