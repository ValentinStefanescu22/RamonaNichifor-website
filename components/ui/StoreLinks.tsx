import { useTranslations } from "next-intl";
import type { Book } from "@/content/types";
import { ArrowUpRight } from "./icons";
import { PillLink } from "./links";

/** Where a book is sold: one ink pill per store, „Cumpără de pe <store>” (DESIGN.md: the store name in 700, the seed nudges up-right). */
export function StoreLinks({ stores, className = "" }: { stores: Book["storeLinks"]; className?: string }) {
  const t = useTranslations("ui");
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {stores.map((s) => (
        <PillLink key={s.url} href={s.url} external icon={<ArrowUpRight size={18} />} className="group-hover:[&>span:last-child]:-translate-y-0.5">
          <span>
            {t("buyFrom")} <b className="font-bold">{s.store}</b>
          </span>
        </PillLink>
      ))}
    </div>
  );
}
