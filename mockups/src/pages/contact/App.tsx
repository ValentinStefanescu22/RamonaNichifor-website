import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { nav, site } from "../../shared/content";
import { contactPage, type SubjectId } from "../../shared/content-pages";
import { CopyEmail } from "../../shared/CopyEmail";
import { ArrowRight, Facebook, Instagram, WhatsApp } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, SiteShell } from "../../site/Layout";
import { useAntiSpam } from "../../site/antispam";
import { Honeypot } from "../../site/Honeypot";

type Values = { name: string; email: string; subject: SubjectId; message: string; consent: boolean };
type Errors = Partial<Record<"name" | "email" | "message" | "consent", true>>;

const subjectFromHash = (): SubjectId => {
  const h = window.location.hash.slice(1);
  return contactPage.subjects.some((s) => s.id === h) ? (h as SubjectId) : "altceva";
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = true;
  if (v.message.trim().length < 3) e.message = true;
  if (!v.consent) e.consent = true;
  return e;
}

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

function ContactForm() {
  const { t } = useLang();
  const uid = useId();
  const [v, setV] = useState<Values>({ name: "", email: "", subject: subjectFromHash(), message: "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [outcome, setOutcome] = useState<"sent" | "rejected">("sent");
  const spam = useAntiSpam();
  const formRef = useRef<HTMLFormElement>(null);
  const noteRef = useRef<HTMLHeadingElement>(null);

  // After a first attempt, fields re-check themselves as they are corrected
  useEffect(() => {
    if (tried) setErrors(validate(v));
  }, [v, tried]);

  useEffect(() => {
    if (sent) noteRef.current?.focus();
  }, [sent]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((old) => ({ ...old, [k]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const found = validate(v);
    setErrors(found);
    const first = (["name", "email", "message", "consent"] as const).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // A mockup: nothing is sent anywhere, and the note says so. Spam (honeypot filled or sent in under
    // 3 seconds) gets the same answer, so bots learn nothing, and is dropped.
    setOutcome(spam.isSpam() ? "rejected" : "sent");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="relative mx-auto max-w-md rotate-[-1.2deg] rounded-[6px] bg-[#fffaf3] px-7 pt-8 pb-7 shadow-soft" aria-live="polite" data-outcome={outcome}>
        <span className="paint-edge absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[2deg] bg-lilac/60" aria-hidden="true" />
        <h2 ref={noteRef} tabIndex={-1} className="display display-wonk text-[2.4rem] italic text-violet outline-none">
          {t(contactPage.success.title)}
        </h2>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-ink">{t(contactPage.success.body)}</p>
        <p className="display display-wonk mt-5 text-right text-[1.6rem] italic text-ink-soft">Ramona</p>
        <button
          type="button"
          onClick={() => {
            setV((old) => ({ ...old, message: "" }));
            setTried(false);
            setErrors({});
            setSent(false);
            spam.reset();
          }}
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px]"
        >
          {t(contactPage.success.again)}
        </button>
      </div>
    );
  }

  const ids = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message`, consent: `${uid}-consent` };
  const describe = (k: keyof typeof ids, hint = false) => (errors[k as keyof Errors] ? `${ids[k]}-error` : hint ? `${ids[k]}-hint` : undefined);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="relative rounded-[2rem] bg-white/55 p-5 shadow-soft ring-1 ring-ink/5 sm:p-8">
      <Honeypot inputRef={spam.trap} />
      <h2 className="display text-[1.9rem] text-ink">{t(contactPage.formTitle)}</h2>
      {tried && hasErrors && (
        <p role="alert" className="mt-4 rounded-2xl bg-petal/70 px-4 py-3 text-[0.98rem] font-medium text-ink">
          {t(contactPage.errors.summary)}
        </p>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={ids.name} label={t(contactPage.fields.name)} error={errors.name && t(contactPage.errors.name)}>
          <input
            id={ids.name}
            name="name"
            autoComplete="name"
            className="field"
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe("name")}
          />
        </Field>
        <Field id={ids.email} label={t(contactPage.fields.email)} error={errors.email && t(contactPage.errors.email)}>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field"
            value={v.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe("email")}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="font-medium text-ink">{t(contactPage.fields.subject)}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactPage.subjects.map((s) => (
            <label key={s.id} className="relative cursor-pointer">
              <input
                type="radio"
                name="subject"
                value={s.id}
                checked={v.subject === s.id}
                onChange={() => set("subject", s.id)}
                className="peer absolute inset-0 opacity-0"
              />
              <span className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.98rem] font-medium text-ink-soft ring-1 ring-ink/15 transition-colors duration-200 peer-checked:bg-ink peer-checked:text-cream peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-magenta">
                {t(s.label)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field id={ids.message} label={t(contactPage.fields.message)} hint={t(contactPage.fields.messageHint)} error={errors.message && t(contactPage.errors.message)}>
          <textarea
            id={ids.message}
            name="message"
            rows={5}
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
          {t(contactPage.fields.consent)}
        </label>
        {errors.consent && (
          <p id={`${ids.consent}-error`} className="mt-2 pl-9 text-[0.95rem] font-medium text-[#9c2f45]">
            {t(contactPage.errors.consent)}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97]"
      >
        {t(contactPage.send)}
        <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight size={17} />
        </span>
      </button>
    </form>
  );
}

export default function App() {
  const { t } = useLang();
  const channels = [
    { label: "WhatsApp", href: site.contact.whatsapp.href, Icon: WhatsApp, note: site.contact.whatsapp.label },
    { label: "Instagram", href: site.contact.instagram.href, Icon: Instagram, note: site.contact.instagram.handle },
    { label: "Facebook", href: site.contact.facebook.href, Icon: Facebook, note: site.contact.facebook.handle },
  ];
  return (
    <SiteShell current="contact" ground="cream" floatAfter={0.5}>
      <main>
        <PageOpener
          title={t(nav.contact)}
          tagline={t(contactPage.tagline)}
          background="linear-gradient(180deg, var(--color-mist) 0%, var(--color-cream) 62%)"
          aside={<ContactForm />}
          className="pb-16"
        >
          <h2 className="display text-[1.5rem] text-ink">{t(contactPage.otherWays)}</h2>
          <CopyEmail className="mt-3 text-[1.02rem] text-ink [&_button]:bg-petal/70 [&_button]:text-ink" />
          <ul className="mt-2 flex flex-col">
            {channels.map(({ label, href, Icon, note }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="group inline-flex min-h-12 items-center gap-3 text-ink">
                  <span className="grid size-10 place-items-center rounded-full ring-1 ring-ink/20 transition-colors group-hover:bg-ink group-hover:text-cream">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="font-medium">{label}</span>
                    <span className="ml-2 text-ink-soft">{note !== label ? note : ""}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </PageOpener>
      </main>
    </SiteShell>
  );
}
