// Renders the static social cards and app icons with Playwright (no network):
//   public/og/home-ro.png, public/og/home-en.png  (1200×630)
//   app/icon.png (96×96: small, it is fetched early on every page), app/apple-icon.png (180×180)
// Then each PNG is reduced to 256 colours (dithered) with Pillow to stay under ~300 KB (skipped with a warning if
// python3/Pillow is missing). Usage: node scripts/make-og.mjs
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const file = (p) => pathToFileURL(join(root, p)).href;

// The site's own Fraunces cut (assets/fonts, see scripts/fetch-fonts.sh).
const faces = [
  ["fraunces-roman.woff2", "normal"],
  ["fraunces-italic.woff2", "italic"],
]
  .map(([f, style]) => `@font-face{font-family:Fraunces;font-style:${style};font-weight:360 400;src:url(${file(`assets/fonts/${f}`)}) format("woff2")}`)
  .join("\n");

// Copy from content/data.ts (souls) and messages/*.json (meta.homeTitle is the alt text, set in lib/seo.ts).
const souls = { ro: "Povești pentru suflete mici și mari", en: "Stories for young and grown-up souls" };
const coverAlt = { ro: "Coperta cărții Fluturele", en: "The Butterfly book cover" };

const og = (locale) => `<!doctype html><html lang="${locale}"><meta charset="utf-8"><style>
${faces}
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body {
  position: relative; color: #34224a; font-family: Fraunces, Georgia, serif;
  background:
    radial-gradient(60% 70% at 18% 42%, rgb(246 221 230 / 0.75), transparent 70%),
    radial-gradient(45% 60% at 30% 70%, rgb(201 184 230 / 0.35), transparent 70%),
    linear-gradient(160deg, #fbf7f1 0%, #eef3fa 48%, #d6e6f5 100%);
}
.text { position: absolute; left: 88px; top: 0; bottom: 0; width: 660px; display: flex; flex-direction: column; justify-content: center; }
h1 { font-weight: 380; font-size: 132px; line-height: 0.98; letter-spacing: -0.02em; font-variation-settings: "SOFT" 100, "WONK" 0, "opsz" 144; }
h1 em { display: block; font-style: italic; color: #7a5fb0; font-variation-settings: "SOFT" 100, "WONK" 1, "opsz" 144; }
p { margin-top: 34px; font-size: 38px; line-height: 1.2; letter-spacing: -0.02em; font-style: italic; font-weight: 400; color: #5e4a75; font-variation-settings: "SOFT" 100, "WONK" 0, "opsz" 72; }
.book { position: absolute; right: 108px; top: 84px; height: 462px; width: auto; transform: rotate(-2.5deg);
  border-radius: 4px 10px 10px 4px;
  box-shadow: 0 2px 4px rgb(52 34 74 / 0.08), 0 30px 60px -24px rgb(52 34 74 / 0.45), inset 3px 0 6px -3px rgb(255 255 255 / 0.5); }
</style><body>
<div class="text"><h1>Ramona <em>Nichifor</em></h1><p>${souls[locale]}</p></div>
<img class="book" src="${file("public/img/cover-fluturele.webp")}" width="766" height="1120" alt="${coverAlt[locale]}">
</body></html>`;

const icon = (size) => `<!doctype html><meta charset="utf-8"><style>
* { margin: 0; } html, body { width: ${size}px; height: ${size}px; overflow: hidden; background: #fbf7f1; }
body { display: grid; place-items: center; }
img { width: 84%; height: auto; }
</style><body><img src="${file("mockups/public/img/butterfly.webp")}" width="447" height="406" alt=""></body>`;

const tmp = mkdtempSync(join(tmpdir(), "rn-og-"));
const browser = await chromium.launch();
async function shot(html, width, height, out) {
  const page = await browser.newPage({ viewport: { width, height } });
  const src = join(tmp, "page.html");
  writeFileSync(src, html);
  await page.goto(pathToFileURL(src).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await page.screenshot({ path: join(root, out), type: "png" });
  await page.close();
  console.log(out);
}

mkdirSync(join(root, "public/og"), { recursive: true });
for (const locale of ["ro", "en"]) await shot(og(locale), 1200, 630, `public/og/home-${locale}.png`);
await shot(icon(96), 96, 96, "app/icon.png");
await shot(icon(180), 180, 180, "app/apple-icon.png");
await browser.close();

const outs = ["public/og/home-ro.png", "public/og/home-en.png", "app/icon.png", "app/apple-icon.png"].map((p) => join(root, p));
const py = `import sys
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p).convert("RGB")
    im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(p, optimize=True)`;
const q = spawnSync("python3", ["-I", "-c", py, ...outs], { stdio: "inherit" });
if (q.status !== 0) console.warn("Pillow quantize skipped: PNGs are full colour (larger).");
