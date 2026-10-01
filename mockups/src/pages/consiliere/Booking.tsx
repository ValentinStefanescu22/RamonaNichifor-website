import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Lang } from "../../shared/content";
import { availability, booking, contactPage, type FormatId } from "../../shared/content-pages";
import { ArrowRight } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { useAntiSpam } from "../../site/antispam";
import { Honeypot } from "../../site/Honeypot";
import { SectionTitle } from "../../site/Layout";

/* ------------------------------------------------------------------ pure slot logic
   Kept free of React so the real site (M4b) can run the same rules on the server. */

const DAY = 86_400_000;
const AHEAD_DAYS = 60;

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
/** Monday = 0 … Sunday = 6 */
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7;

/** A small deterministic hash, so the placeholder "already booked" times stay the same on every visit */
function taken(day: Date, minute: number) {
  let h = 2166136261;
  for (const c of `${ymd(day)}@${minute}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) % 4 === 0;
}

/** Free start times (minutes after midnight) on a day for a session of `minutes` length */
export function slotsFor(day: Date, minutes: number, today = startOfDay(new Date())): number[] {
  const d = startOfDay(day);
  // bookable from tomorrow (a day's notice) up to 60 days ahead
  if (d <= today || d.getTime() - today.getTime() > AHEAD_DAYS * DAY) return [];
  const step = minutes <= 15 ? 30 : 60;
  const out: number[] = [];
  for (const [from, to] of availability[weekdayIndex(d)] ?? []) {
    for (let m = from * 60; m + minutes <= to * 60; m += step) if (!taken(d, m)) out.push(m);
  }
  return out;
}

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first.getTime() - weekdayIndex(first) * DAY);
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && ymd(a) === ymd(b);
const longDate = (d: Date, lang: Lang) =>
  `${booking.weekdaysLong[lang][weekdayIndex(d)]}, ${d.getDate()} ${booking.months[lang][d.getMonth()]}`;

/* ------------------------------------------------------------------ calendar */

function Calendar({
  minutes,
  selected,
  onSelect,
}: {
  minutes: number;
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const { t, lang } = useLang();
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [focus, setFocus] = useState<Date>(() => {
    // start on the first day that has free times
    for (let i = 1; i <= AHEAD_DAYS; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      if (slotsFor(d, minutes, today).length) return d;
    }
    return today;
  });
  const grid = useMemo(() => monthGrid(month), [month]);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const moved = useRef(false);

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const canPrev = month > minMonth;
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) < maxMonth;

  // keyboard focus follows the roving date, even across months
  useEffect(() => {
    if (!moved.current) return;
    refs.current[ymd(focus)]?.focus();
  }, [focus, month]);

  const moveTo = (d: Date) => {
    moved.current = true;
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) {
      const target = new Date(d.getFullYear(), d.getMonth(), 1);
      if (target < minMonth || target >= maxMonth) return;
      setMonth(target);
    }
    setFocus(d);
  };

  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    const delta = k === "ArrowRight" ? 1 : k === "ArrowLeft" ? -1 : k === "ArrowDown" ? 7 : k === "ArrowUp" ? -7 : null;
    if (delta !== null) {
      e.preventDefault();
      moveTo(new Date(focus.getFullYear(), focus.getMonth(), focus.getDate() + delta));
    } else if (k === "Home" || k === "End") {
      e.preventDefault();
      const w = weekdayIndex(focus);
      moveTo(new Date(focus.getFullYear(), focus.getMonth(), focus.getDate() + (k === "Home" ? -w : 6 - w)));
    } else if (k === "PageUp" || k === "PageDown") {
      e.preventDefault();
      moveTo(new Date(focus.getFullYear(), focus.getMonth() + (k === "PageUp" ? -1 : 1), focus.getDate()));
    }
  };

  const title = `${booking.months[lang][month.getMonth()]} ${month.getFullYear()}`;
  const label = (d: Date) => longDate(d, lang);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="display text-[1.4rem] text-ink capitalize" aria-live="polite">
          {title}
        </p>
        <div className="flex gap-1">
          {[
            { dir: -1, ok: canPrev, name: booking.prev },
            { dir: 1, ok: canNext, name: booking.next },
          ].map(({ dir, ok, name }) => (
            <button
              key={dir}
              type="button"
              disabled={!ok}
              aria-label={t(name)}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + dir, 1))}
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
            >
              <ArrowRight size={18} className={dir < 0 ? "rotate-180" : ""} />
            </button>
          ))}
        </div>
      </div>
      <div role="grid" aria-label={title} onKeyDown={onKey} className="mt-3">
        <div role="row" className="grid grid-cols-7">
          {booking.weekdays[lang].map((w) => (
            <span key={w} role="columnheader" className="py-1 text-center text-[0.8rem] font-semibold text-ink-soft">
              {w}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-7">
            {grid.slice(row * 7, row * 7 + 7).map((d) => {
              const inMonth = d.getMonth() === month.getMonth();
              const open = inMonth && slotsFor(d, minutes, today).length > 0;
              const isSel = sameDay(d, selected);
              const isToday = sameDay(d, today);
              const isFocus = sameDay(d, focus) && inMonth;
              return (
                <span key={ymd(d)} role="gridcell" aria-selected={isSel} className="grid place-items-center py-0.5">
                  {inMonth ? (
                    <button
                      ref={(el) => {
                        refs.current[ymd(d)] = el;
                      }}
                      type="button"
                      tabIndex={isFocus || (!grid.some((x) => sameDay(x, focus) && x.getMonth() === month.getMonth()) && d.getDate() === 1) ? 0 : -1}
                      aria-disabled={!open}
                      aria-label={label(d)}
                      aria-current={isToday ? "date" : undefined}
                      onClick={() => {
                        moved.current = false;
                        setFocus(d);
                        if (open) onSelect(d);
                      }}
                      className={`relative grid size-11 place-items-center rounded-full text-[1rem] tabular-nums transition-colors duration-200 ${
                        isSel
                          ? "bg-ink font-semibold text-cream"
                          : open
                            ? "font-semibold text-ink hover:bg-sage"
                            : "cursor-default text-ink-soft/45"
                      }`}
                    >
                      {d.getDate()}
                      {open && !isSel && <span className="absolute bottom-1.5 size-1 rounded-full bg-leaf" aria-hidden="true" />}
                      {isToday && !isSel && <span className="absolute inset-1 rounded-full ring-1 ring-ink/20" aria-hidden="true" />}
                    </button>
                  ) : (
                    <span className="size-11" aria-hidden="true" />
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ the whole booking block */

type Errors = Partial<Record<"name" | "email" | "consent", true>>;

export function Booking() {
  const { t, lang } = useLang();
  const uid = useId();
  const [format, setFormat] = useState<FormatId>("online");
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<null | "sent" | "rejected">(null);
  const spam = useAntiSpam();
  const timesRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const f = booking.formats.find((x) => x.id === format)!;
  const slots = day ? slotsFor(day, f.minutes) : [];

  const validate = (v = form): Errors => ({
    ...(v.name.trim() ? {} : { name: true }),
    ...(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? {} : { email: true }),
    ...(v.consent ? {} : { consent: true }),
  });
  useEffect(() => {
    if (tried) setErrors(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, tried]);
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const pickFormat = (id: FormatId) => {
    setFormat(id);
    // the day may no longer fit a longer session
    if (day && time !== null && !slotsFor(day, booking.formats.find((x) => x.id === id)!.minutes).includes(time)) setTime(null);
  };
  const pickDay = (d: Date) => {
    setDay(d);
    setTime(null);
    requestAnimationFrame(() => timesRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
  };
  const pickTime = (m: number) => {
    setTime(m);
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const found = validate();
    setErrors(found);
    const first = (["name", "email", "consent"] as const).find((k) => found[k]);
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    // A mockup: nothing is booked. Spam is answered the same way and dropped.
    setDone(spam.isSpam() ? "rejected" : "sent");
  };

  const reveal = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (done && day && time !== null) {
    return (
      <div className="relative mx-auto max-w-md rotate-[-1deg] rounded-[6px] bg-[#fffaf3] px-7 pt-8 pb-7 shadow-soft" aria-live="polite" data-outcome={done}>
        <span className="paint-edge absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[2deg] bg-sage" aria-hidden="true" />
        <h3 ref={doneRef} tabIndex={-1} className="display display-wonk text-[2.2rem] italic text-violet outline-none">
          {t(booking.success.title)}
        </h3>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[1.02rem]">
          <dt className="text-ink-soft">{t(booking.steps.format)}</dt>
          <dd className="text-ink">
            {t(f.title)} · {t(f.detail)}
          </dd>
          <dt className="text-ink-soft">{t(booking.steps.day)}</dt>
          <dd className="text-ink">{longDate(day, lang)}</dd>
          <dt className="text-ink-soft">{t(booking.steps.time)}</dt>
          <dd className="text-ink tabular-nums">
            {hhmm(time)}–{hhmm(time + f.minutes)} <span className="text-ink-soft">({t(booking.timezone)})</span>
          </dd>
        </dl>
        <p className="mt-5 text-[1rem] leading-relaxed text-ink">{t(booking.success.body)}</p>
        <button
          type="button"
          onClick={() => {
            setDone(null);
            setTime(null);
            setDay(null);
            setTried(false);
            setErrors({});
            spam.reset();
          }}
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px]"
        >
          {t(booking.success.again)}
        </button>
      </div>
    );
  }

  const field = (k: "name" | "email" | "phone" | "note") => `${uid}-${k}`;

  return (
    <div className="rounded-[2rem] bg-white/60 p-5 shadow-soft ring-1 ring-ink/5 sm:p-8">
      {/* 1 · format */}
      <fieldset>
        <legend className="font-semibold text-ink">1 · {t(booking.steps.format)}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {booking.formats.map((x) => {
            const on = x.id === format;
            return (
              <label key={x.id} className="relative cursor-pointer">
                <input type="radio" name="format" value={x.id} checked={on} onChange={() => pickFormat(x.id)} className="peer absolute inset-0 opacity-0" />
                <span className="relative z-0 flex min-h-14 flex-col justify-center rounded-[1.25rem] px-4 py-2 ring-1 ring-ink/15 transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-magenta" style={{ color: on ? "var(--color-cream)" : "var(--color-ink)" }}>
                  {on && <motion.span layoutId="format-thumb" className="absolute inset-0 -z-10 rounded-[1.25rem] bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
                  <span className="font-semibold">{t(x.title)}</span>
                  <span className="text-[0.88rem] tabular-nums opacity-80">{t(x.detail)}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        {/* 2 · day */}
        <div>
          <p className="font-semibold text-ink">2 · {t(booking.steps.day)}</p>
          <div className="mt-2">
            <Calendar key={format} minutes={f.minutes} selected={day} onSelect={pickDay} />
          </div>
        </div>

        {/* 3 · time, then 4 · details */}
        <div className="min-w-0">
          <p className="font-semibold text-ink">3 · {t(booking.steps.time)}</p>
          <div ref={timesRef} className="mt-3">
            {/* popLayout: the new times mount at once (so focus can move to them) while the old content fades */}
            <AnimatePresence mode="popLayout" initial={false}>
              {!day ? (
                <motion.p key="hint" {...reveal} className="text-ink-soft">
                  {t(booking.pickDay)}
                </motion.p>
              ) : (
                <motion.div key={ymd(day) + format} {...reveal}>
                  <p className="text-[0.95rem] text-ink-soft">
                    {longDate(day, lang)} · {t(booking.timezone)}
                  </p>
                  {slots.length ? (
                    <div role="radiogroup" aria-label={t(booking.steps.time)} className="mt-3 flex flex-wrap gap-2">
                      {slots.map((m) => {
                        const on = m === time;
                        return (
                          <button
                            key={m}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => pickTime(m)}
                            className={`min-h-11 rounded-full px-4 font-semibold tabular-nums ring-1 transition-colors duration-200 ${
                              on ? "bg-ink text-cream ring-ink" : "text-ink ring-ink/15 hover:bg-sage"
                            }`}
                          >
                            {hhmm(m)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-3 text-ink-soft">{t(booking.noSlots)}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {time !== null && (
              <motion.form key="details" {...reveal} noValidate onSubmit={submit} className="relative mt-8">
                <p className="font-semibold text-ink">4 · {t(booking.steps.details)}</p>
                {tried && Object.keys(errors).length > 0 && (
                  <p role="alert" className="mt-3 rounded-2xl bg-petal/70 px-4 py-3 text-[0.98rem] font-medium text-ink">
                    {t(contactPage.errors.summary)}
                  </p>
                )}
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      { k: "name", label: contactPage.fields.name, type: "text", auto: "name", err: contactPage.errors.name },
                      { k: "email", label: contactPage.fields.email, type: "email", auto: "email", err: contactPage.errors.email },
                      { k: "phone", label: booking.fields.phone, type: "tel", auto: "tel" },
                    ] as const
                  ).map((x) => {
                    const bad = "err" in x && errors[x.k as "name" | "email"];
                    return (
                      <div key={x.k} className={`flex flex-col gap-2 ${x.k === "phone" ? "sm:col-span-2" : ""}`}>
                        <label htmlFor={field(x.k)} className="font-medium text-ink">
                          {t(x.label)}
                        </label>
                        <input
                          id={field(x.k)}
                          ref={x.k === "name" ? nameRef : undefined}
                          name={x.k}
                          type={x.type}
                          autoComplete={x.auto}
                          className="field"
                          value={form[x.k]}
                          onChange={(e) => setForm((o) => ({ ...o, [x.k]: e.target.value }))}
                          aria-invalid={bad ? true : undefined}
                          aria-describedby={bad ? `${field(x.k)}-error` : undefined}
                        />
                        {bad && "err" in x && (
                          <p id={`${field(x.k)}-error`} className="text-[0.95rem] font-medium text-[#9c2f45]">
                            {t(x.err)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor={field("note")} className="font-medium text-ink">
                      {t(booking.fields.note)}
                    </label>
                    <textarea id={field("note")} name="note" rows={3} className="field resize-y" value={form.note} onChange={(e) => setForm((o) => ({ ...o, note: e.target.value }))} />
                  </div>
                </div>
                <label htmlFor={`${uid}-consent`} className="mt-4 flex cursor-pointer items-start gap-3 text-[0.98rem] leading-snug text-ink-soft">
                  <input
                    id={`${uid}-consent`}
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm((o) => ({ ...o, consent: e.target.checked }))}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
                    className="mt-0.5 size-6 shrink-0 accent-[#34224a]"
                  />
                  {t(contactPage.fields.consent)}
                </label>
                {errors.consent && (
                  <p id={`${uid}-consent-error`} className="mt-2 pl-9 text-[0.95rem] font-medium text-[#9c2f45]">
                    {t(contactPage.errors.consent)}
                  </p>
                )}
                <Honeypot inputRef={spam.trap} />
                <button
                  type="submit"
                  className="group mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97]"
                >
                  {t(booking.submit)}
                  <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={17} />
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function BookingSection() {
  const { t } = useLang();
  return (
    <section id="programare" className="scroll-mt-24 bg-cream px-4 pb-20 sm:px-6 lg:pb-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle lead={t(booking.lead)}>{t(booking.title)}</SectionTitle>
        <div className="mt-10">
          <Booking />
        </div>
      </div>
    </section>
  );
}
