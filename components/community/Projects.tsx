import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/page/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import type { CommunityProject } from "@/content/types";

/** No project is announced yet (client, 2026-10-05): only the promise, said large. Projects that arrive get an image, title, line and a status. */
export function Projects({ projects }: { projects: CommunityProject[] }) {
  const t = useTranslations();
  if (projects.length === 0)
    return (
      <Reveal i={1}>
        <p className="display display-wonk mt-8 text-[clamp(2.6rem,9vw,4.4rem)] leading-none font-[360] text-violet italic">{t("ui.comingSoon")}</p>
      </Reveal>
    );
  return (
    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <li key={p.id} className="overflow-hidden rounded-[1.75rem] bg-white/60 ring-1 ring-ink/5">
          {p.image && <Image src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} sizes="(min-width: 1024px) 30vw, 90vw" className="art block h-auto w-full" />}
          <div className="p-5">
            <h3 className="display text-[1.45rem] leading-tight text-ink">{p.title}</h3>
            {p.line && <p className="mt-1 text-[0.98rem] leading-snug text-ink-soft">{p.line}</p>}
            <p className="mt-3">
              <StatusChip>{t(`community.stage.${p.stage}`)}</StatusChip>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
