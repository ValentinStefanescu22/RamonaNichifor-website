import { useTranslations } from "next-intl";
import { TextLink } from "./links";
import { StatusChip } from "./StatusChip";

/** Where a buy button will go: no book can be ordered online yet, so say so plainly. */
export function BuySoon({ link = true, className = "" }: { link?: boolean; className?: string }) {
  const t = useTranslations("ui");
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`}>
      <p className="flex flex-wrap items-center gap-2.5 text-[1rem] text-ink-soft">
        <StatusChip>{t("comingSoon")}</StatusChip>
        {t("buySoon")}
      </p>
      {link && <TextLink href="/contact">{t("writeToMe")}</TextLink>}
    </div>
  );
}
