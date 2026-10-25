import { useTranslations } from "next-intl";
import { StatusChip } from "@/components/ui/StatusChip";
import { WhatsApp } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/links";

/** #programare until the booking opens (M4): said plainly. No calendar and no times that are not real, no form:
 *  the free 15-minute phone conversation and WhatsApp are how a visitor reaches her today. */
export function BookingSoon({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("counselling");
  const ui = useTranslations("ui");
  return (
    <section id="programare" className="scroll-mt-24 bg-cream px-4 pb-20 sm:px-6 lg:pb-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="display max-w-2xl text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink">{t("book")}</h2>
        <div className="mt-10 grid gap-8 rounded-[2rem] bg-sage px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2.5 text-[1.15rem] leading-snug text-ink">
              <StatusChip>{ui("comingSoon")}</StatusChip>
              {t("soon")}
            </p>
            <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft">{t("soonNext")}</p>
            <div className="mt-6">
              <PillLink href={whatsapp} external icon={<WhatsApp size={18} />}>
                {t("whatsapp")}
              </PillLink>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-cream/80 p-5 ring-1 ring-ink/5">
            <h3 className="display text-[1.4rem] leading-tight text-ink">{t("firstTitle")}</h3>
            <p className="mt-1 text-[1rem] text-ink-soft">{t("firstLine")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
