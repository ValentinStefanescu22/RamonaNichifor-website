import { site, ui } from "../../shared/content";
import { community } from "../../shared/content-pages";
import { ArrowUpRight, Brush, Instagram, OpenBook, Pen, Speech } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, PillLink, Reveal, SectionTitle, SiteShell, TextLink } from "../../site/Layout";
import { StatusChip } from "../../site/StatusChip";
import { GatheringCircle } from "./Circle";

const eventIcon = { pictura: Brush, lansari: OpenBook, autografe: Pen, citit: Speech } as const;

/** What we do together: four kinds of gathering, each announced with its date when it is set */
function Events() {
  const { t } = useLang();
  return (
    <ul className="mt-10 border-t border-ink/12">
      {community.events.map((e, i) => {
        const Icon = eventIcon[e.id as keyof typeof eventIcon];
        return (
          <li key={e.id} className="border-b border-ink/12">
            <Reveal i={i} className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-3 py-7 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-x-8">
              <div className="relative grid aspect-square place-items-center">
                <span className="paint-edge absolute inset-0 rounded-full opacity-80" style={{ background: e.tint }} aria-hidden="true" />
                <Icon size={30} className="relative text-ink" />
              </div>
              <div className="min-w-0">
                <h3 className="display text-[clamp(1.35rem,4.8vw,1.7rem)] leading-tight text-ink">{t(e.title)}</h3>
                <p className="mt-1 text-[1rem] text-ink-soft">{t(e.audience)}</p>
                <p className="mt-2.5 flex flex-wrap items-center gap-2.5 text-[0.95rem] text-ink-soft">
                  <span className="font-semibold text-violet">{t(e.kind)}</span>
                  <StatusChip>{t(community.datesSoon)}</StatusChip>
                </p>
              </div>
              <TextLink href="contact.html#comunitate" className="col-start-2 justify-self-start sm:col-start-3">
                {t(community.join)}
              </TextLink>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

/** Partners: the logo when we have it, a painted initial until then; every card links to the partner */
function Partners() {
  const { t } = useLang();
  return (
    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {community.partners.map((p) => (
        <li key={p.id}>
          <a href={p.url} target="_blank" rel="noreferrer" className="group flex h-full items-center gap-5 rounded-[1.75rem] bg-white/60 p-5 ring-1 ring-ink/5 transition-transform duration-500 ease-(--ease-bloom) hover:-translate-y-1">
            {p.logo ? (
              <img src={p.logo} alt="" className="size-20 shrink-0 rounded-full object-cover" />
            ) : (
              <span
                className="display display-wonk grid size-20 shrink-0 place-items-center rounded-full text-[2.4rem] italic text-violet"
                style={{ background: "radial-gradient(circle at 38% 32%, #fffaf3, #e6dcf5 62%, #f3c9dc)" }}
                aria-hidden="true"
              >
                {p.name.charAt(0)}
              </span>
            )}
            <span className="min-w-0">
              <span className="display block text-[1.45rem] leading-tight text-ink">{p.name}</span>
              <span className="mt-1 block text-[0.98rem] leading-snug text-ink-soft">{t(p.line)}</span>
              <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink">
                <Instagram size={17} />
                {p.handle}
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const { t } = useLang();
  return (
    <SiteShell current="comunitate" ground="petal">
      <main>
        <PageOpener
          title={t(community.title[0])}
          italic={t(community.title[1])}
          lead={<p>{t(community.lead)}</p>}
          background="linear-gradient(180deg, #f7e3eb 0%, #efe6f5 52%, #e4ecf6 100%)"
          aside={<GatheringCircle />}
        />

        <section className="px-4 pt-10 pb-20 sm:px-6 lg:pb-28" style={{ background: "linear-gradient(180deg, #e4ecf6 0%, var(--color-cream) 40%)" }}>
          <div className="mx-auto max-w-6xl">
            <SectionTitle lead={t(community.eventsLead)}>{t(community.eventsTitle)}</SectionTitle>
            <Events />
          </div>
        </section>

        {/* No project is announced yet (client, 2026-10-05): only the promise, said large */}
        <section className="bg-cream px-4 pb-24 sm:px-6 lg:pb-32">
          <div className="mx-auto max-w-6xl">
            <SectionTitle>{t(community.projectsTitle)}</SectionTitle>
            <Reveal i={1}>
              <p className="display display-wonk mt-6 text-[clamp(2.6rem,9vw,4.4rem)] leading-none font-[360] text-violet italic lg:mt-8">{t(ui.comingSoon)}</p>
            </Reveal>
          </div>
        </section>

        {/* PLACEHOLDER partner description and logo: AVA Art & Soul sends them */}
        <section className="bg-cream px-4 pb-24 sm:px-6 lg:pb-28">
          <div className="mx-auto max-w-6xl">
            <SectionTitle lead={t(community.partnersLead)}>{t(community.partnersTitle)}</SectionTitle>
            <Partners />
            <TextLink href="contact.html#comunitate" className="mt-6">
              {t(community.partnerInvite)}
            </TextLink>
          </div>
        </section>

        <section className="px-4 pt-16 pb-6 sm:px-6" style={{ background: "linear-gradient(180deg, var(--color-cream) 0%, var(--color-petal) 100%)" }}>
          <div className="mx-auto max-w-6xl">
            <SectionTitle lead={t(community.ctaLine)}>{t(community.ctaTitle)}</SectionTitle>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <PillLink href={site.contact.instagram.href} external icon={<Instagram size={18} />}>
                {t(community.follow)}
              </PillLink>
              <TextLink href="contact.html#comunitate">{t(community.propose)}</TextLink>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
