import { useTranslations } from "next-intl";
import type { ArtworkFull } from "@/content/types";

const dot: Record<ArtworkFull["availability"], string> = { preorder: "#6f8a5a", sold: "rgb(52 34 74 / 0.35)", onRequest: "#7a5fb0" };

/** The state of a work, then (only while it can be pre-ordered) its price or „Preț în curând”: two short lines, never broken mid-phrase. */
export function Availability({ availability, price }: { availability: ArtworkFull["availability"]; price: number | null }) {
  const t = useTranslations("art");
  return (
    <span className="flex flex-col gap-0.5 text-[0.9rem] text-ink-soft">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="size-2 rounded-full" style={{ background: dot[availability] }} aria-hidden="true" />
        {t(`availability.${availability}`)}
      </span>
      {availability === "preorder" && <span className="pl-3.5 whitespace-nowrap">{price ? t("price", { price }) : t("priceSoon")}</span>}
    </span>
  );
}
