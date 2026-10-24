import type { SiteSettings } from "@/content/types";
import { Facebook, Instagram, WhatsApp } from "@/components/ui/icons";

export function SocialLinks({ contacts, className = "" }: { contacts: SiteSettings["contacts"]; className?: string }) {
  const links = [
    { label: "Instagram", href: contacts.instagram.href, Icon: Instagram },
    { label: "Facebook", href: contacts.facebook.href, Icon: Facebook },
    { label: "WhatsApp", href: contacts.whatsapp.href, Icon: WhatsApp },
  ];
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full ring-1 ring-current/25 transition-colors hover:bg-ink hover:text-cream"
          >
            <Icon size={19} />
          </a>
        </li>
      ))}
    </ul>
  );
}
