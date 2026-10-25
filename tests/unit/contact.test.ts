// node --test --experimental-strip-types tests/unit/contact.test.ts
// The contact form's logic (lib/contact.ts) with fake deps: no network, no Resend, no Turnstile.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { handleContact, type Mail } from "../../lib/contact.ts";

const ro = JSON.parse(readFileSync(new URL("../../messages/ro.json", import.meta.url), "utf8"));
const errors = ro.contact.errors;
const NOW = 1_800_000_000_000;
let ipN = 0;

function setup(over: { transport?: (m: Mail) => Promise<void>; turnstile?: boolean; ip?: string } = {}) {
  const mails: Mail[] = [];
  const deps = {
    ip: over.ip ?? `10.0.0.${++ipN}`,
    now: NOW,
    errors,
    from: "Site <site@example.test>",
    to: "inbox@example.test",
    transport: over.transport ?? (async (m: Mail) => void mails.push(m)),
    verifyTurnstile: async () => over.turnstile ?? true,
  };
  return { mails, deps };
}

function form(fields: Record<string, string> = {}) {
  const f = new FormData();
  const all = { name: "Ana Pop", email: "ana@example.com", subject: "carte", message: "Bună! <script>alert(1)</script>", consent: "on", startedAt: String(NOW - 10_000), website: "", locale: "ro", "cf-turnstile-response": "tok", ...fields };
  for (const [k, v] of Object.entries(all)) f.set(k, v);
  return f;
}

test("a valid message is sent once: subject, reply-to the sender, the message escaped", async () => {
  const { mails, deps } = setup();
  const r = await handleContact(form(), deps);
  assert.equal(r.status, "sent");
  assert.equal(mails.length, 1);
  assert.equal(mails[0].subject, "[Site] Carte · Ana Pop");
  assert.equal(mails[0].replyTo, "ana@example.com");
  assert.equal(mails[0].to, "inbox@example.test");
  assert.match(mails[0].html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(mails[0].html, /<script>/);
});

test("a line break in the name never reaches the subject line", async () => {
  const { mails, deps } = setup();
  await handleContact(form({ name: "Ana\r\nBcc: x@evil.test" }), deps);
  assert.equal(mails[0].subject, "[Site] Carte · Ana Bcc: x@evil.test");
});

test("bidi and other format characters never reach the subject line", async () => {
  const { mails, deps } = setup();
  await handleContact(form({ name: "Ana\u202Egnp.exe\u200B Pop" }), deps);
  assert.equal(mails[0].subject, "[Site] Carte · Ana gnp.exe Pop");
  const only = await handleContact(form({ name: "\u202E\u0007" }), deps);
  assert.deepEqual(only.errors, { name: errors.name });
});

test("honeypot filled → success, nothing sent", async () => {
  const { mails, deps } = setup();
  assert.equal((await handleContact(form({ website: "http://spam.test" }), deps)).status, "sent");
  assert.equal(mails.length, 0);
});

test("sent under 3 s after the form opened (or without a start time) → success, nothing sent", async () => {
  const { mails, deps } = setup();
  assert.equal((await handleContact(form({ startedAt: String(NOW - 2_000) }), deps)).status, "sent");
  assert.equal((await handleContact(form({ startedAt: "" }), deps)).status, "sent");
  assert.equal(mails.length, 0);
});

test("Turnstile says no → success, nothing sent", async () => {
  const { mails, deps } = setup({ turnstile: false });
  assert.equal((await handleContact(form(), deps)).status, "sent");
  assert.equal(mails.length, 0);
});

test("a bad email or a missing consent → invalid, with the page's own error copy", async () => {
  const { mails, deps } = setup();
  const r = await handleContact(form({ email: "ana@", consent: "" }), deps);
  assert.equal(r.status, "invalid");
  assert.deepEqual(r.errors, { email: errors.email, consent: errors.consent });
  assert.equal(r.values?.email, "ana@");
  const empty = await handleContact(form({ name: " ", message: "", subject: "nope" }), deps);
  assert.deepEqual(Object.keys(empty.errors ?? {}).sort(), ["message", "name", "subject"]);
  for (const email of ["a@x.co,b@y.co", "a@x.co,b.cc", "Ana <a@x.co>", "a@x.co;b.cc"])
    assert.deepEqual((await handleContact(form({ email }), deps)).errors, { email: errors.email }, email);
  const long = await handleContact(form({ message: "a".repeat(5001) }), deps);
  assert.equal(long.status, "invalid");
  assert.equal(mails.length, 0);
});

test("the 6th message from one IP within 10 minutes → limited; after the window it goes again", async () => {
  const { mails, deps } = setup({ ip: "192.0.2.7" });
  for (let i = 0; i < 5; i++) assert.equal((await handleContact(form(), { ...deps, now: NOW + i * 60_000 })).status, "sent");
  assert.equal((await handleContact(form(), { ...deps, now: NOW + 5 * 60_000 })).status, "limited");
  assert.equal(mails.length, 5);
  // another visitor is not affected
  assert.equal((await handleContact(form(), { ...deps, ip: "192.0.2.8", now: NOW + 5 * 60_000 })).status, "sent");
  // 10 minutes after the first one, a slot frees up
  assert.equal((await handleContact(form(), { ...deps, now: NOW + 10 * 60_000 + 1 })).status, "sent");
});

test("the transport throws → failed, and the visitor's text comes back", async () => {
  const { deps } = setup({ transport: async () => { throw new Error("resend down"); } });
  const r = await handleContact(form({ message: "Textul meu lung" }), deps);
  assert.equal(r.status, "failed");
  assert.equal(r.values?.message, "Textul meu lung");
  assert.equal(r.values?.name, "Ana Pop");
});

test("Turnstile unreachable → failed (a real message is never dropped silently)", async () => {
  const { deps } = setup();
  const r = await handleContact(form(), { ...deps, verifyTurnstile: async () => { throw new Error("timeout"); } });
  assert.equal(r.status, "failed");
});
