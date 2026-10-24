"use client";
import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";

export function MenuButton({ open, onClick }: { open: boolean; onClick: (e: MouseEvent<HTMLButtonElement>) => void }) {
  const t = useTranslations("nav");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={t(open ? "close" : "menu")}
      data-menu-button=""
      className="relative grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform duration-150 active:scale-[0.94]"
    >
      <span
        className="absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-(--ease-bloom)"
        style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
      />
      <span
        className="absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-(--ease-bloom)"
        style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
      />
    </button>
  );
}
