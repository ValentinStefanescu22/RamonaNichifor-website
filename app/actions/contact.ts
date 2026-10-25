"use server";
// The contact form's server action (Next checks Origin against Host on every call). The logic lives in lib/contact.ts.
import { mkdir, writeFile } from "node:fs/promises";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { handleContact, type ContactState, type Mail } from "@/lib/contact";

async function send(mail: Mail) {
  // tests only: the mail lands in reports/mail/ (git-ignored) instead of Resend
  if (process.env.CONTACT_TRANSPORT === "log") {
    await mkdir("reports/mail", { recursive: true });
    await writeFile(`reports/mail/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`, JSON.stringify(mail, null, 2));
    return;
  }
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send(mail);
  if (error) throw new Error(`resend: ${error.name}`);
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not set");
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`siteverify ${res.status}`);
  return (await res.json()).success === true;
}

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const h = await headers();
  // the first hop is the visitor as the host's proxy saw them (Vercel overwrites x-forwarded-for)
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const locale = form.get("locale") === "en" ? "en" : "ro";
  const t = await getTranslations({ locale, namespace: "contact.errors" });
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!from || !to) {
    console.error("contact: CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL are not set");
    return { status: "failed" };
  }
  return handleContact(form, {
    ip,
    now: Date.now(),
    errors: { name: t("name"), email: t("email"), subject: t("subject"), message: t("message"), consent: t("consent") },
    from,
    to,
    transport: send,
    verifyTurnstile,
  });
}
