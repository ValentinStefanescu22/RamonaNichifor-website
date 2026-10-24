import { Link } from "@/i18n/navigation";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-script inline-flex min-h-11 items-center leading-none whitespace-nowrap text-ink ${className}`}>
      Ramona Nichifor
    </Link>
  );
}
