import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { routing } from "@/i18n/routing";

/** Every opengraph-image.tsx exports these two (Next reads them statically, so they cannot be re-exported). */
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

/** `export const generateStaticParams = ogStaticParams;` in a fixed-path page; slug pages write their own, with the locale AND the slugs. */
export const ogStaticParams = () => routing.locales.map((locale) => ({ locale }));

const INK = "#34224a";
const INK_SOFT = "#5e4a75";
const VIOLET = "#7a5fb0";

// Satori reads TTF but not woff2: assets/fonts/fraunces-og.ttf is the roman cut at wght 380, opsz 144 (scripts/fetch-fonts.sh).
// A local file read, so the route is fine in a static build with no network.
let font: Promise<Buffer> | undefined;
const fraunces = () =>
  (font ??= readFile(join(process.cwd(), "assets/fonts/fraunces-og.ttf")).catch((err) => {
    font = undefined; // a failed read must not be cached: the next render tries again
    throw err;
  }));

/** The picture, whole, as a PNG data URL plus its drawn size. Takes a file under public/ ("/img/…") or a Payload upload
 *  ("/api/media/file/…", read in-process through Payload's own route, so it works at build time with disk or R2). */
async function loadImage(src: string, box: { width: number; height: number }) {
  let bytes: Buffer;
  if (src.startsWith("/api/media/file/")) {
    const [{ default: config }, { REST_GET }] = await Promise.all([import("@payload-config"), import("@payloadcms/next/routes")]);
    const slug = ["media", "file", decodeURIComponent(src.slice("/api/media/file/".length))];
    const res = await REST_GET(config)(new Request(`http://localhost${src}`), { params: Promise.resolve({ slug }) });
    if (!res.ok) throw new Error(`og image ${src}: ${res.status}`);
    bytes = Buffer.from(await res.arrayBuffer());
  } else {
    bytes = await readFile(join(process.cwd(), "public", src));
  }
  const { data, info } = await sharp(bytes).resize({ ...box, fit: "inside", withoutEnlargement: true }).png().toBuffer({ resolveWithObject: true });
  return { url: `data:image/png;base64,${data.toString("base64")}`, width: info.width, height: info.height };
}

const titleSize = (text: string, narrow: boolean) => {
  const n = text.length;
  if (narrow) return n <= 14 ? 112 : n <= 26 ? 88 : n <= 44 ? 68 : 54;
  return n <= 20 ? 120 : n <= 40 ? 92 : 72;
};

/**
 * The social card of an inner page, 1200×630, on the paper / sky ground of the home card (scripts/make-og.mjs):
 * the title in Fraunces, a small kicker above it, and (optionally) the picture drawn whole on the right.
 * `tint` is a universe's [light, mid, deep] as #rrggbb: it tints the wash and the kicker.
 */
export async function renderOg({
  title,
  kicker,
  image,
  tint,
}: {
  title: string;
  kicker?: string;
  /** "/img/…" (public/) or "/api/media/file/…" (a Payload upload) */
  image?: string;
  tint?: [string, string, string];
}) {
  const [data, picture] = await Promise.all([fraunces(), image ? loadImage(image, { width: 420, height: 462 }) : undefined]);
  const [light, , deep] = tint ?? ["#f6dde6", "#c9b8e6", VIOLET];
  const textWidth = picture ? 640 : 1024;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Fraunces",
          color: INK,
          background: `radial-gradient(60% 70% at 18% 42%, ${light}bf, ${light}00 70%), radial-gradient(45% 60% at 30% 70%, rgba(201,184,230,0.35), rgba(201,184,230,0) 70%), linear-gradient(160deg, #fbf7f1 0%, #eef3fa 48%, #d6e6f5 100%)`,
        }}
      >
        <div style={{ position: "absolute", left: 88, top: 0, bottom: 0, width: textWidth, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {kicker && (
            <div style={{ fontSize: 30, letterSpacing: "0.12em", textTransform: "uppercase", color: deep, marginBottom: 26 }}>{kicker}</div>
          )}
          <div style={{ fontSize: titleSize(title, Boolean(picture)), lineHeight: 1.02, letterSpacing: "-0.02em" }}>{title}</div>
        </div>
        <div style={{ position: "absolute", left: 88, bottom: 52, fontSize: 30, color: INK_SOFT, letterSpacing: "-0.01em" }}>Ramona Nichifor</div>
        {picture && (
          <div style={{ position: "absolute", right: 88, top: 84, width: 420, height: 462, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={picture.url} width={picture.width} height={picture.height} alt="" style={{ objectFit: "contain" }} />
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Fraunces", data, weight: 400, style: "normal" }] },
  );
}
