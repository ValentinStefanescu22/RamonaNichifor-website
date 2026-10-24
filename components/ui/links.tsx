import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

export type AppHref = ComponentProps<typeof Link>["href"];

/** Internal routes go through the localized Link; external URLs and in-page anchors stay plain <a>. */
function Anchor({ href, external, className, children }: { href: AppHref | string; external?: boolean; className: string; children: ReactNode }) {
  if (external || (typeof href === "string" && href.startsWith("#")))
    return (
      <a href={href as string} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  return (
    <Link href={href as AppHref} className={className}>
      {children}
    </Link>
  );
}

/** The ink pill with a seed circle: the site's primary action. */
export function PillLink({
  href,
  children,
  icon,
  external = false,
  className = "",
}: {
  href: AppHref | string;
  children: ReactNode;
  icon: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <Anchor
      href={href}
      external={external}
      className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97] ${className}`}
    >
      {children}
      <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
        {icon}
      </span>
    </Anchor>
  );
}

/** Underlined text link with a moving arrow: the site's secondary action. */
export function TextLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: AppHref | string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <Anchor
      href={href}
      external={external}
      className={`group inline-flex min-h-11 items-center gap-2 font-bold text-ink underline decoration-lilac decoration-2 underline-offset-[6px] ${className}`}
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />
      </svg>
    </Anchor>
  );
}
