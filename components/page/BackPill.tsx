import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";
import type { AppHref } from "@/components/ui/links";

/** „← Toate universurile”: the glass pill (cream 80%, blur, 5% ink ring, 44px) that goes back one level on a sky. */
export function BackPill({ href, label, className = "" }: { href: AppHref; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-cream/80 pr-4 pl-3 font-medium text-ink shadow-soft ring-1 ring-ink/5 backdrop-blur-sm transition-transform duration-150 active:scale-[0.97] ${className}`}
    >
      <ArrowRight size={17} className="rotate-180" />
      {label}
    </Link>
  );
}
