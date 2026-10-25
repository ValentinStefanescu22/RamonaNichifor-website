// The contact form's server logic (spec §5.8), pure so tests/unit/contact.test.ts can run it with fakes.
// app/actions/contact.ts is the "use server" wrapper that builds the real deps. Nothing is stored anywhere.
import { z } from "zod";
import { EMAIL, SUBJECTS, type Subject } from "./contact-rules.ts";
import { rateLimit } from "./rate-limit.ts";

export type Field = "name" | "email" | "subject" | "message" | "consent";
export type ContactState = {
  status: "idle" | "sent" | "invalid" | "limited" | "failed";
  errors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
};
export type Mail = { from: string; to: string; replyTo: string; subject: string; html: string; text: string };
export type ContactDeps = {
  ip: string;
  now: number;
  /** contact.errors from messages/<locale>.json */
  errors: Record<Field, string>;
  from: string;
  to: string;
  transport: (mail: Mail) => Promise<void>;
  verifyTurnstile: (token: string, ip: string) => Promise<boolean>;
};

const MIN_MS = 3_000;
// Ramona reads the mail in Romanian, whatever the visitor's language
const subjectLabel: Record<Subject, string> = { carte: "Carte", arta: "Artă", consiliere: "Consiliere", comunitate: "Comunitate", altceva: "Altceva" };

const schema = z.object({
  // control and format characters (CR/LF, bidi overrides like U+202E) become spaces: the name goes into the subject line
  name: z.string().transform((s) => s.replace(/[\p{Cc}\p{Cf}\s]+/gu, " ").trim()).pipe(z.string().min(1).max(100)),
  email: z.string().trim().max(254).regex(EMAIL),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(3).max(5000),
  consent: z.literal("on"),
});

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");
const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => entities[c]);

export async function handleContact(form: FormData, deps: ContactDeps): Promise<ContactState> {
  // spam (honeypot filled, sent too fast, no start time) gets the normal success state and is dropped
  const startedAt = Number(str(form.get("startedAt")));
  if (str(form.get("website")) || !startedAt || deps.now - startedAt < MIN_MS) return { status: "sent" };

  const raw = { name: form.get("name"), email: form.get("email"), subject: form.get("subject"), message: form.get("message"), consent: form.get("consent") };
  const values = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, str(v).slice(0, 5000)])) as Record<Field, string>;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<Field, string>> = {};
    for (const issue of parsed.error.issues) {
      const f = issue.path[0] as Field;
      errors[f] = deps.errors[f];
    }
    return { status: "invalid", errors, values };
  }
  if (!rateLimit(deps.ip, 5, 600_000, deps.now)) return { status: "limited", values };

  try {
    if (!(await deps.verifyTurnstile(str(form.get("cf-turnstile-response")), deps.ip))) return { status: "sent" };
    const m = parsed.data;
    const en = form.get("locale") === "en";
    const rows: [string, string][] = [["Nume", m.name], ["Email", m.email], ["Subiect", subjectLabel[m.subject]], ["Limba site-ului", en ? "engleză" : "română"]];
    await deps.transport({
      from: deps.from,
      to: deps.to,
      replyTo: m.email,
      subject: `[Site] ${subjectLabel[m.subject]} · ${m.name}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${m.message}`,
      html:
        `<table>${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escape(v)}</td></tr>`).join("")}</table>` +
        `<p style="white-space:pre-wrap">${escape(m.message)}</p>`,
    });
    return { status: "sent" };
  } catch (e) {
    console.error("contact: not sent:", (e as Error).message); // never the message itself
    return { status: "failed", values };
  }
}
