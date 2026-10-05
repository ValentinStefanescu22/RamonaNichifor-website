import { useEffect, useState } from "react";
import { site, ui, universes } from "../../shared/content";
import { bookOf, booksPage, itemHref, productKinds, productPage, products, type Product } from "../../shared/content-pages";
import { ArrowRight, Instagram } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { toTop } from "../../site/mount";
import { delay, PillLink, SiteShell, TextLink } from "../../site/Layout";
import { BookCover, ProductArt } from "../../site/Painted";
import { StatusChip } from "../../site/StatusChip";

// One page for every universe keepsake (bookmark, playing cards, poster), chosen by the link's
// #id, e.g. produs.html#fluture-semn. All product details are placeholders for now.

const pick = (): Product => products.find((p) => p.id === window.location.hash.slice(1)) ?? products[0];

export default function App() {
  const { t } = useLang();
  const [p, setP] = useState(pick);

  // Moving between products of the same universe stays on this page: re-render and start at the top
  useEffect(() => {
    const onHash = () => {
      setP(pick());
      toTop(); // another book or product is another page: open it at its top
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const u = universes.find((x) => x.id === p.universe)!;
  useEffect(() => {
    document.title = `${t(p.name)} · ${t(u.name)} · Ramona Nichifor`;
  }, [p, u, t]);

  const book = bookOf(u.id);
  const others = u.items.map((item, i) => ({ item, i, href: itemHref(u.id, i) })).filter((x) => x.href !== `produs.html#${p.id}`);

  return (
    <SiteShell current="universuri" ground="cream" floatAfter={0.6}>
      <main>
        <section
          className="relative isolate overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:pt-32 lg:pb-24"
          style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${u.tint[0]} 55%, white) 0%, ${u.tint[0]} 52%, var(--color-cream) 100%)` }}
        >
          <div className="mx-auto max-w-6xl">
            <a href={`universuri.html#${u.id}`} className="inline-flex min-h-11 items-center gap-2 font-medium text-ink-soft hover:text-ink">
              <ArrowRight size={17} className="rotate-180" />
              {t(u.name)}
            </a>
            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div className="fade-up" style={delay(0.1)}>
                <ProductArt key={p.id} kind={p.kind} universe={u.id} tint={u.tint} className="mx-auto w-[min(78vw,420px)]" />
              </div>
              <div className="min-w-0">
                <h1 className="display text-[clamp(2.6rem,10vw,4.6rem)] font-[380] text-ink">
                  <span className="rise block" style={delay(0.2)}>
                    {t(p.name)}
                  </span>
                  <span className="rise display-wonk mt-1 block pl-[0.4em] text-[0.62em] italic text-violet" style={delay(0.28)}>
                    {t(u.name)}
                  </span>
                </h1>
                <p className="fade-up mt-5 flex flex-wrap items-center gap-3 text-[0.95rem] text-ink-soft" style={delay(0.35)}>
                  <StatusChip>{t(ui.comingSoon)}</StatusChip>
                  <span>{t(productPage.priceSoon)}</span>
                </p>
                <div className="fade-up mt-6 max-w-[56ch] space-y-4 text-[1.06rem] leading-[1.75] text-ink-soft" style={delay(0.4)}>
                  {p.description.map((d, i) => (
                    <p key={i}>{t(d)}</p>
                  ))}
                </div>
                <dl className="fade-up mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[1rem]" style={delay(0.45)}>
                  {p.specs.map((sp) => (
                    <div key={sp.label.ro} className="contents">
                      <dt className="text-ink-soft">{t(sp.label)}</dt>
                      <dd className="text-ink">{t(sp.value)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={delay(0.5)}>
                  <PillLink href={site.contact.instagram.href} external icon={<Instagram size={18} />}>
                    {t(ui.notifyMe)}
                  </PillLink>
                  <TextLink href="contact.html#carte">{t(ui.writeToMe)}</TextLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream px-4 pt-6 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{t(productPage.sameUniverse)}</h2>
            <ul className="mt-8 grid grid-cols-3 gap-4 sm:gap-8 lg:max-w-4xl">
              {others.map(({ item, i, href }) => (
                <li key={i}>
                  <a href={href} className="group block">
                    <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded-[1.5rem] transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1.5" style={{ background: `color-mix(in oklab, ${u.tint[0]} 60%, white)` }}>
                      {i === 0 ? (
                        <div className="w-[56%]">
                          <BookCover book={book} />
                        </div>
                      ) : (
                        <ProductArt kind={productKinds[i - 1]} universe={u.id} tint={u.tint} className="w-full" />
                      )}
                    </div>
                    <p className="display mt-3 text-[1.05rem] leading-tight text-ink sm:text-[1.2rem]">{i === 0 ? t(book.title) : t(item.name)}</p>
                    <p className="mt-1 text-[0.88rem] text-ink-soft">{i === 0 ? t(booksPage.status[book.status]) : t(ui.comingSoon)}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
