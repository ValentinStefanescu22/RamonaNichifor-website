import { Parisienne } from "next/font/google";
import localFont from "next/font/local";

// All fonts are self-hosted (no requests to Google at runtime) and carry ă â î ș ț.

// Fraunces is cut down to the site's own glyphs, weights and axes (scripts/fetch-fonts.sh):
// 174 KB for roman + italic instead of ~490 KB for Google's latin + latin-ext files. It carries the hero.
export const fraunces = localFont({
  src: [
    { path: "../assets/fonts/fraunces-roman.woff2", weight: "360 400", style: "normal" },
    { path: "../assets/fonts/fraunces-italic.woff2", weight: "360 400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

// Alegreya Sans: one file per weight/style the site uses, same glyph set as Fraunces.
export const alegreya = localFont({
  src: [
    { path: "../assets/fonts/alegreya-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/alegreya-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/alegreya-700.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/alegreya-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../assets/fonts/alegreya-500-italic.woff2", weight: "500", style: "italic" },
  ],
  display: "swap",
  // let the CSS ask for the faces a page uses instead of preloading all five
  preload: false,
  variable: "--font-alegreya",
  fallback: ["Gill Sans", "Segoe UI", "system-ui", "sans-serif"],
});

export const parisienne = Parisienne({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  // only the wordmark, which Acasă hides until the floating bar
  preload: false,
  variable: "--font-parisienne",
});
