import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContactPage, getSiteSettings } from "@/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Facebook, Instagram, WhatsApp } from "@/components/ui/icons";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({ locale, path: "/contact", title: t("nav.contact"), description: t("contact.description") });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, c] = await Promise.all([getTranslations(), getSiteSettings(locale), getContactPage(locale)]);
  const { whatsapp, instagram, facebook } = site.contacts;
  const channels = [
    { label: "WhatsApp", href: whatsapp.href, Icon: WhatsApp, note: whatsapp.number },
    { label: "Instagram", href: instagram.href, Icon: Instagram, note: instagram.handle },
    { label: "Facebook", href: facebook.href, Icon: Facebook, note: facebook.handle },
  ];

  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.contact"), path: "/contact" }])} />
      <PageHero
        tone="cream"
        title={t("nav.contact")}
        tagline={c.tagline}
        bottom="pb-16 lg:pb-20"
        aside={<ContactForm sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""} />}
      >
        <h2 className="display text-[1.5rem] text-ink">{t("contact.otherWays")}</h2>
        <CopyEmail email={site.contacts.email} className="mt-3 text-[1.02rem] text-ink [&_button]:bg-petal/70 [&_button]:text-ink" />
        <ul className="mt-2 flex flex-col">
          {channels.map(({ label, href, Icon, note }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" className="group inline-flex min-h-12 items-center gap-3 text-ink">
                <span className="grid size-10 place-items-center rounded-full ring-1 ring-ink/20 transition-colors group-hover:bg-ink group-hover:text-cream">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="font-medium">{label}</span>
                  <span className="ml-2 text-ink-soft tabular-nums">{note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>
    </main>
  );
}
