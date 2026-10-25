import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

// The clean paper placeholder (DESIGN.md "Placeholders"): flat paper, a 1px hairline frame inset 6%, a small picture glyph
// and „Imagine în curând”. It holds the place of Ramona's real images and says so plainly: never washes or blobs.

export function SoonLabel({ children }: { children: ReactNode }) {
  return <span className="text-[0.72rem] leading-tight font-bold tracking-[0.08em] text-balance text-ink-soft uppercase">{children}</span>;
}

/** Picture-frame glyph: a rounded frame, a small sun and one mountain line */
function FrameGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 text-ink-soft/50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="M4 17.5 9.5 12.5 13 15.5 15.5 13.5 20 17.5" />
    </svg>
  );
}

/**
 * Provisional image. It takes its width from the parent and its shape from `ratio` (width / height: `4 / 5` or `"4 / 5"`).
 * `tint` is a CSS colour (cream by default, or a very pale universe tint); `children` replace the glyph and label.
 */
export function PaperPlaceholder({
  ratio,
  label,
  tint = "#fbf7f1",
  className = "",
  children,
}: {
  ratio: number | string;
  label?: string;
  tint?: string;
  className?: string;
  children?: ReactNode;
}) {
  const t = useTranslations("ui");
  return (
    <div data-placeholder className={`@container relative overflow-hidden ${className}`} style={{ background: tint, aspectRatio: String(ratio) }}>
      <div className="absolute inset-[6cqi] flex flex-col items-center justify-center gap-2.5 border border-[rgb(52_34_74/0.18)] p-[6cqi] text-center">
        {children ?? (
          <>
            <FrameGlyph />
            <SoonLabel>{label ?? t("imageSoon")}</SoonLabel>
          </>
        )}
      </div>
    </div>
  );
}
