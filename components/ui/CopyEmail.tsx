"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Mail } from "./icons";

// The address is shown as selectable text with a copy button; mailto: is not relied on.
export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const t = useTranslations("ui");
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    };
    const select = () => {
      const range = document.createRange();
      if (textRef.current) range.selectNodeContents(textRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, select);
    else select();
  };

  return (
    <div className={`inline-flex min-h-11 items-center gap-2 ${className}`}>
      <Mail size={18} className="shrink-0 opacity-70" />
      <span ref={textRef} className="select-all break-all">
        {email}
      </span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-[0.8rem] font-bold transition-transform active:scale-[0.97]"
        aria-live="polite"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? t("copied") : t("copy")}</span>
      </button>
    </div>
  );
}
