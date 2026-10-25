"use client";
import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sendContact } from "@/app/actions/contact";
import type { ContactState } from "@/lib/contact";
import { EMAIL, SUBJECTS, type Subject } from "@/lib/contact-rules";
import { ArrowRight } from "@/components/ui/icons";
import { Honeypot } from "./Honeypot";

type Values = { name: string; email: string; subject: Subject; message: string; consent: boolean };
type Key = "name" | "email" | "subject" | "message" | "consent";
const order: Key[] = ["name", "email", "subject", "message", "consent"];

type Turnstile = { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void };
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
const TURNSTILE = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const invalid = (v: Values): Key[] =>
  order.filter((k) => (k === "name" ? !v.name.trim() : k === "email" ? !EMAIL.test(v.email.trim()) : k === "message" ? v.message.trim().length < 3 : k === "consent" ? !v.consent : false));

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[0.92rem] text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[0.95rem] font-medium text-[#9c2f45]">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The contact form (mockups/src/pages/contact/App.tsx). Spam guards: the honeypot, the time trap (startedAt) and an invisible
 * Turnstile token; the server repeats every check (lib/contact.ts). Nothing is sent before the page has hydrated.
 */
export function ContactForm({ sitekey }: { sitekey: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const uid = useId();
  const [v, setV] = useState<Values>({ name: "", email: "", subject: "altceva", message: "", consent: false });
  const [tried, setTried] = useState(false);
  const [ready, setReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const noteRef = useRef<HTMLHeadingElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const token = useRef("");
  const startedAt = useRef(0);
  const sentValues = useRef<Values | null>(null);

  const [state, dispatch, pending] = useActionState(async (prev: ContactState, fd: FormData | null): Promise<ContactState> => {
    if (!fd) return { status: "idle" }; // „Scrie alt mesaj”
    // the invisible challenge usually has its token long before a person presses send; give it up to 10 s more
    for (let i = 0; i < 40 && !token.current; i++) await new Promise((r) => setTimeout(r, 250));
    if (!token.current) return { status: "failed" };
    fd.set("cf-turnstile-response", token.current);
    fd.set("startedAt", String(startedAt.current));
    fd.set("locale", locale);
    try {
      return await sendContact(prev, fd);
    } catch {
      return { status: "failed" };
    } finally {
      // a token is good for one check only
      token.current = "";
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }, { status: "idle" });

  // ?subiect=arta&lucrare=<title> (the Artă and Comunitate links): preselect the subject, start the message
  useEffect(() => {
    startedAt.current = Date.now();
    setReady(true);
    const q = new URLSearchParams(window.location.search);
    const subject = SUBJECTS.find((s) => s === q.get("subiect"));
    const title = q.get("lucrare")?.slice(0, 200);
    setV((old) => ({ ...old, subject: subject ?? old.subject, message: title && !old.message ? t("aboutArtwork", { title }) : old.message }));
    // once, on arrival: startedAt is the time trap's clock
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Turnstile, explicit render, only on this page; it shows itself only if Cloudflare needs the visitor to act
  useEffect(() => {
    if (!sitekey) return;
    let gone = false;
    const mount = () => {
      if (gone || !window.turnstile || !box.current) return;
      widget.current = window.turnstile.render(box.current, {
        sitekey,
        appearance: "interaction-only",
        "response-field": false,
        language: locale,
        callback: (tok: string) => (token.current = tok),
        "expired-callback": () => (token.current = ""),
        "error-callback": () => {
          token.current = "";
          return true; // handled: the send waits, then shows the error state
        },
      });
    };
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE}"]`);
    if (window.turnstile) mount();
    else {
      if (!script) {
        script = Object.assign(document.createElement("script"), { src: TURNSTILE, async: true });
        document.head.append(script);
      }
      script.addEventListener("load", mount);
    }
    return () => {
      gone = true;
      script?.removeEventListener("load", mount);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [sitekey, locale]);

  // after a first try the fields re-check themselves as they are corrected; the server's word counts for what this cannot see
  // the server's errors stand for each field until the visitor changes it
  const errors: Partial<Record<Key, string>> = {};
  if (state.status === "invalid") for (const k of order) if (state.errors?.[k] && v[k] === sentValues.current?.[k]) errors[k] = state.errors[k];
  if (tried) for (const k of invalid(v)) errors[k] = t(`errors.${k}`);

  useEffect(() => {
    if (state.status === "sent") noteRef.current?.focus();
    if (state.status === "invalid") {
      const first = order.find((k) => state.errors?.[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((old) => ({ ...old, [k]: val }));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    const first = invalid(v)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    sentValues.current = v;
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };

  if (state.status === "sent") {
    return (
      <div className="relative mx-auto max-w-md rotate-[-1.2deg] rounded-[6px] bg-[#fffaf3] px-7 pt-8 pb-7 shadow-soft" aria-live="polite" data-outcome="sent">
        <span className="paint-edge absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[2deg] bg-lilac/60" aria-hidden="true" />
        <h2 ref={noteRef} tabIndex={-1} className="display display-wonk text-[2.4rem] text-violet italic outline-none">
          {t("success.title")}
        </h2>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-ink">{t("success.body")}</p>
        <p className="display display-wonk mt-5 text-right text-[1.6rem] text-ink-soft italic">Ramona</p>
        <button
          type="button"
          onClick={() => {
            setV((old) => ({ ...old, message: "" }));
            setTried(false);
            startedAt.current = Date.now();
            startTransition(() => dispatch(null));
          }}
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-ink underline decoration-lilac decoration-2 underline-offset-[6px]"
        >
          {t("success.again")}
        </button>
      </div>
    );
  }

  const ids = { name: `${uid}-name`, email: `${uid}-email`, subject: `${uid}-subject`, message: `${uid}-message`, consent: `${uid}-consent` };
  const describe = (k: Key, hint = false) => (errors[k] ? `${ids[k]}-error` : hint ? `${ids[k]}-hint` : undefined);
  const hasErrors = Object.keys(errors).length > 0;
  const notice = state.status === "failed" || state.status === "limited" ? t(state.status) : null;

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="relative rounded-[2rem] bg-white/55 p-5 shadow-soft ring-1 ring-ink/5 sm:p-8">
      <Honeypot />
      <h2 className="display text-[1.9rem] text-ink">{t("formTitle")}</h2>
      <noscript>
        <p className="mt-4 rounded-2xl bg-petal/70 px-4 py-3 text-[0.98rem] font-medium text-ink">{t("noscript")}</p>
      </noscript>
      {hasErrors && (
        <p role="alert" className="mt-4 rounded-2xl bg-petal/70 px-4 py-3 text-[0.98rem] font-medium text-ink">
          {t("errors.summary")}
        </p>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={ids.name} label={t("fields.name")} error={errors.name}>
          <input
            id={ids.name}
            name="name"
            autoComplete="name"
            maxLength={100}
            className="field"
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe("name")}
          />
        </Field>
        <Field id={ids.email} label={t("fields.email")} error={errors.email}>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            className="field"
            value={v.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe("email")}
          />
        </Field>
      </div>

      <fieldset className="mt-6" aria-describedby={describe("subject")}>
        <legend className="font-medium text-ink">{t("fields.subject")}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <label key={s} className="relative cursor-pointer">
              <input type="radio" name="subject" value={s} checked={v.subject === s} onChange={() => set("subject", s)} className="peer absolute inset-0 opacity-0" />
              <span className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.98rem] font-medium text-ink-soft ring-1 ring-ink/15 transition-colors duration-200 peer-checked:bg-ink peer-checked:text-cream peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-magenta">
                {t(`subjects.${s}`)}
              </span>
            </label>
          ))}
        </div>
        {errors.subject && (
          <p id={`${ids.subject}-error`} className="mt-2 text-[0.95rem] font-medium text-[#9c2f45]">
            {errors.subject}
          </p>
        )}
      </fieldset>

      <div className="mt-6">
        <Field id={ids.message} label={t("fields.message")} hint={t("fields.messageHint")} error={errors.message}>
          <textarea
            id={ids.message}
            name="message"
            rows={5}
            maxLength={5000}
            className="field resize-y leading-relaxed"
            value={v.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describe("message", true)}
          />
        </Field>
      </div>

      <div className="mt-6">
        <label htmlFor={ids.consent} className="flex cursor-pointer items-start gap-3 text-[0.98rem] leading-snug text-ink-soft">
          <input
            id={ids.consent}
            name="consent"
            type="checkbox"
            checked={v.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describe("consent")}
            className="mt-0.5 size-6 shrink-0 accent-[#34224a]"
          />
          <span>
            {t.rich("fields.consent", {
              link: (c) => (
                <Link href="/confidentialitate" className="text-ink underline decoration-lilac decoration-2 underline-offset-4">
                  {c}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.consent && (
          <p id={`${ids.consent}-error`} className="mt-2 pl-9 text-[0.95rem] font-medium text-[#9c2f45]">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Turnstile draws here only when Cloudflare asks the visitor to act */}
      <div ref={box} className="mt-6 empty:hidden" data-sitekey={sitekey} />

      {notice && (
        <p role="alert" data-status={state.status} className="mt-6 rounded-2xl bg-petal/70 px-4 py-3 text-[0.98rem] font-medium text-ink">
          {notice}
        </p>
      )}

      <button
        type="submit"
        disabled={!ready || pending}
        className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97] disabled:opacity-70"
      >
        {pending ? t("sending") : t("send")}
        <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight size={17} />
        </span>
      </button>
    </form>
  );
}
