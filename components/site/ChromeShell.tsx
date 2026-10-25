"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { SiteSettings } from "@/content/types";
import { usePathname } from "@/i18n/navigation";
import { pageOf, type PageId } from "@/lib/menu";
import { FloatingBar } from "./FloatingBar";
import { Footer, type Ground } from "./Footer";
import type { SlugPairs } from "./LangSwitch";
import { MenuSheet } from "./MenuSheet";
import { OpenAtTop } from "./OpenAtTop";
import { TopBar } from "./TopBar";

// The light above the footer meadow equals the colour each page ends on (DESIGN.md Footer); M3 pages may change theirs.
const groundOf: Partial<Record<PageId, Ground>> = { universuri: "sky", consiliere: "sage", arta: "mist" };

/**
 * Every page: the header over the page's own ground, the floating bar and the menu sheet,
 * the page itself, and the shared footer landing on the meadow.
 */
export function ChromeShell({
  contacts,
  souls,
  slugs,
  current,
  ground,
  children,
}: {
  contacts: SiteSettings["contacts"];
  souls: string;
  slugs: SlugPairs;
  current?: PageId;
  ground?: Ground;
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Entrances (the Universuri orbs painting in) belong to the first document load only. After a client navigation the
  // page is already there, and the morph's new snapshot must not fly into an orb still at opacity 0 (globals.css).
  // A layout effect: it runs in the commit, before the view transition captures the new page.
  const firstPath = useRef(true);
  useLayoutEffect(() => {
    if (firstPath.current) firstPath.current = false;
    else document.documentElement.dataset.clientNav = "";
  }, [pathname]);
  const page = current ?? pageOf(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const toggleMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!menuOpen) opener.current = e.currentTarget;
      setMenuOpen(!menuOpen);
    },
    [menuOpen],
  );
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // focus goes back to the button that opened the menu (or whichever menu button is still on screen)
  const wasOpen = useRef(false);
  useEffect(() => {
    if (menuOpen) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const el = opener.current;
    const target = el?.isConnected && el.getClientRects().length ? el : document.querySelector<HTMLElement>("[data-menu-button]");
    target?.focus({ preventScroll: true });
  }, [menuOpen]);

  return (
    <>
      <OpenAtTop />
      <FloatingBar current={page} slugs={slugs} menuOpen={menuOpen} onMenu={toggleMenu} />
      <MenuSheet current={page} contacts={contacts} open={menuOpen} onClose={closeMenu} />
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-40">
          <TopBar current={page} slugs={slugs} menuOpen={menuOpen} onMenu={toggleMenu} />
        </div>
        {children}
      </div>
      <Footer current={page} ground={ground ?? (page && groundOf[page]) ?? "cream"} contacts={contacts} souls={souls} />
    </>
  );
}
