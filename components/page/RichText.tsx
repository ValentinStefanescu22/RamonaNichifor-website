import type { ReactNode } from "react";
import { RichText as LexicalRichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { getLocale } from "next-intl/server";
import { getAllSlugPairs } from "@/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { isDynamicPath, localizeDynamicPath } from "@/lib/routes";
import type { AppHref } from "@/components/ui/links";
import type { RichTextData, SlugPairs } from "@/content/types";

type LinkNode = { fields: { url?: string; newTab?: boolean; linkType?: string }; children: unknown[] };
type NodesToJSX = (args: { nodes: never[] }) => ReactNode;

/** A link Ramona wrote in the admin: a path starting with "/" is internal and always written with the Romanian path and slugs.
 *  A static page ("/carti", "/carti#fluturele") goes through the localized Link, so the English page links to /en/books.
 *  A page with a slug ("/universuri/fluturele") is resolved to { pathname, params } through the slug pairs first (`slugs`,
 *  fetched only when the text has such a link), so English links to /en/universes/butterfly; a slug that matches no published
 *  doc keeps the path as written. Anything else is external (mailto:, tel:, https://…). */
function Anchor({ node, locale, slugs, children }: { node: LinkNode; locale: Locale; slugs: SlugPairs | null; children: ReactNode }) {
  const url = node.fields.url ?? "";
  if (url.startsWith("/") && !url.startsWith("//")) {
    const [pathname, hash] = url.split("#");
    const dynamic = slugs && localizeDynamicPath(url, locale, slugs);
    return <Link href={(dynamic || (hash ? { pathname, hash } : pathname)) as AppHref}>{children}</Link>;
  }
  const web = /^https?:/i.test(url);
  return (
    <a href={url} rel="noopener noreferrer" {...(web && node.fields.newTab ? { target: "_blank" } : {})}>
      {children}
    </a>
  );
}

const convertersFor = (locale: Locale, slugs: SlugPairs | null): JSXConvertersFunction => ({ defaultConverters }) => {
  const link = ({ node, nodesToJSX }: { node: LinkNode; nodesToJSX: NodesToJSX }) => (
    <Anchor node={node} locale={locale} slugs={slugs}>
      {nodesToJSX({ nodes: node.children as never[] })}
    </Anchor>
  );
  return { ...defaultConverters, link, autolink: link } as never;
};

/** Every link url in a Lexical tree */
const urlsIn = (node: unknown): string[] => {
  const n = node as { fields?: { url?: string }; children?: unknown[] };
  return [...(n.fields?.url ? [n.fields.url] : []), ...(n.children ?? []).flatMap(urlsIn)];
};

// No typography plugin: the prose of Ramona's own texts is styled here (paragraphs, bold/italic, lists, h2–h3, links).
const prose = [
  "text-[1.08rem] leading-relaxed text-ink-soft",
  "[&>*+*]:mt-4 [&>:is(h2,h3)]:mt-8 [&>:is(h2,h3)]:mb-1",
  "[&_:is(h2,h3)]:display [&_:is(h2,h3)]:font-[380] [&_:is(h2,h3)]:text-ink",
  "[&_h2]:text-[1.8rem] [&_h3]:text-[1.4rem]",
  "[&_strong]:font-bold [&_strong]:text-ink [&_em]:italic",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_:is(ul,ol)]:space-y-1.5 [&_:is(ul,ol)]:pl-6 [&_li]:pl-1 [&_li]:marker:text-violet",
  "[&_a]:font-bold [&_a]:text-ink [&_a]:underline [&_a]:decoration-lilac [&_a]:decoration-2 [&_a]:underline-offset-[5px] [&_a]:[overflow-wrap:anywhere]",
].join(" ");

/** Ramona's Lexical text (Payload rich text) as the site's prose. Renders nothing for an empty field. */
export async function RichText({ data, className = "" }: { data: RichTextData | null | undefined; className?: string }) {
  if (!data || data.root.children.length === 0) return null;
  const locale = (await getLocale()) as Locale;
  const slugs = urlsIn(data.root).some(isDynamicPath) ? await getAllSlugPairs() : null;
  return <LexicalRichText data={data as never} converters={convertersFor(locale, slugs)} className={`${prose} ${className}`} />;
}
