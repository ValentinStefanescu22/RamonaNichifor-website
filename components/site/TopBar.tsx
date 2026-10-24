"use client";
import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { menu, type PageId } from "@/lib/menu";
import { LangSwitch, type SlugPairs } from "./LangSwitch";
import { MenuButton } from "./MenuButton";
import { Wordmark } from "./Wordmark";

/** The page's own header; sits over the top of each page's ground. */
export function TopBar({
  current,
  slugs,
  menuOpen,
  onMenu,
}: {
  current?: PageId;
  slugs: SlugPairs;
  menuOpen: boolean;
  onMenu: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const t = useTranslations("nav");
  return (
    <header className="relative z-30 mx-auto flex max-w-[75rem] items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:pt-6">
      {/* On Acasă the hero already says her name, large: the header stays quiet until the floating bar takes over */}
      {current === "home" ? <span aria-hidden="true" /> : <Wordmark className="text-[1.7rem] sm:text-[1.95rem]" />}
      <nav aria-label={t("main")} className="hidden items-center gap-5 text-[0.95rem] font-medium text-ink-soft lg:flex xl:gap-6">
        {menu.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            aria-current={p.id === current ? "page" : undefined}
            className="inline-flex min-h-11 items-center whitespace-nowrap decoration-lilac decoration-2 underline-offset-[6px] hover:text-ink hover:underline aria-[current=page]:text-ink aria-[current=page]:underline"
          >
            {t(p.labelKey)}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <LangSwitch id="top" slugs={slugs} />
        <MenuButton open={menuOpen} onClick={onMenu} />
      </div>
    </header>
  );
}
