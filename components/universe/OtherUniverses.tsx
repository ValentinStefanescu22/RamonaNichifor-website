import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrbArt } from "./OrbArt";
import type { MapWorld } from "./WorldMap";

/** „Alte universuri”: the other worlds as small orbs, each a link to its page. Plain orbs (no morph name): a second named orb
 *  on the page would pair with the next page's hero and fly two orbs at once (Task 0, limitation 2). */
export async function OtherUniverses({ worlds }: { worlds: MapWorld[] }) {
  const t = await getTranslations("universes");
  return (
    <nav aria-label={t("others")} className="mt-16">
      <h2 className="display text-[1.8rem] text-ink">{t("others")}</h2>
      <ul className="mt-5 grid grid-cols-3 gap-3">
        {worlds.map((w) => (
          <li key={w.id}>
            <Link href={{ pathname: "/universuri/[slug]", params: { slug: w.slug } }} className="group flex w-full flex-col items-center gap-2 text-center">
              <OrbArt u={w} size="min(22vw, 120px)" className="transition-transform duration-500 ease-(--ease-glide) group-hover:scale-[1.05]" />
              <span className="display text-[1rem] leading-tight text-balance text-ink">{w.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
