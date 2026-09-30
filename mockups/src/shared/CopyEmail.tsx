import { useRef, useState } from "react";
import { site, ui } from "./content";
import { Check, Copy, Mail } from "./icons";
import { useLang } from "./lang";

// mailto: is unreliable inside a published artifact, so the address is shown
// as selectable text with a copy button.
export function CopyEmail({ className = "" }: { className?: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    };
    navigator.clipboard?.writeText(site.contact.email).then(done, () => {
      const range = document.createRange();
      if (textRef.current) range.selectNodeContents(textRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  };

  return (
    <div className={`inline-flex min-h-11 items-center gap-2 ${className}`}>
      <Mail size={18} className="shrink-0 opacity-70" />
      <span ref={textRef} className="select-all break-all">{site.contact.email}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-[0.8rem] font-semibold transition-transform active:scale-[0.97]"
        aria-live="polite"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? t(ui.copied) : t(ui.copy)}</span>
      </button>
    </div>
  );
}
