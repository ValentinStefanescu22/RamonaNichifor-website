/**
 * Her illustrations get the baked-in „© Ramona Nichifor · ramonanichifor.com” stamp and a screen-size
 * cap on upload; decorative images (`illustration` off) and the seed (`context.skipStamp`, files already
 * stamped) are left alone. The marks are pre-rendered by mockups/scripts/prepare-images.py
 * (`--stamp-assets`) as for a 3000px-wide image, so no fonts are needed here.
 */
import path from "node:path";
import sharp from "sharp";
import type { CollectionBeforeOperationHook } from "payload";

// ponytail: fixed 1800px cap for every illustration; make it a field/setting if she ever needs print sizes
const MAX_EDGE = 1800;
const STAMP_WIDTH = 3000; // the width line.png / corner.png were drawn for
const STAMP_DIR = path.join(process.cwd(), "assets", "stamp");
const FORMATS = ["jpeg", "png", "webp"] as const;

/** Cap the long edge at 1800px (never cropped, never enlarged), then bake in the stamp. Keeps the format. */
export async function stampBuffer(input: Buffer): Promise<Buffer> {
  const { format } = await sharp(input).metadata();
  const fmt = FORMATS.find((f) => f === format);
  if (!fmt) throw new Error("Ilustrațiile se încarcă în format JPG, PNG sau WebP.");

  const capped = await sharp(input)
    .rotate() // apply EXIF orientation first, as Payload does
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = capped.info;
  const scale = w / STAMP_WIDTH; // one scale for both marks keeps stamp()'s proportions (5.2% / 2.6% of width)

  const mark = async (name: string, maxHeight: number) => {
    const img = sharp(path.join(STAMP_DIR, name));
    const meta = await img.metadata();
    const mw = Math.max(1, Math.round(meta.width! * scale));
    const mh = Math.max(1, Math.round(meta.height! * scale));
    img.resize(mw, mh);
    // a very wide panorama is shorter than the tilted line: keep its middle, as stamp()'s paste clips it
    if (mh > maxHeight) img.extract({ left: 0, top: Math.floor((mh - maxHeight) / 2), width: mw, height: maxHeight });
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height };
  };
  const line = await mark("line.png", h);
  const corner = await mark("corner.png", h);

  const out = sharp(capped.data).composite([
    { input: line.data, left: Math.round((w - line.width) / 2), top: Math.round((h - line.height) / 2) },
    // corner.png runs to the canvas corner, so flush bottom-right keeps the 3% margin
    { input: corner.data, left: w - corner.width, top: h - corner.height },
  ]);
  return (fmt === "png" ? out.png() : fmt === "jpeg" ? out.jpeg({ quality: 84 }) : out.webp({ quality: 84 })).toBuffer();
}

export const stampIllustration: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== "create" && operation !== "update") return;
  const data = (args as { data?: { illustration?: boolean } }).data;
  if (!req.file || !data?.illustration || req.context?.skipStamp) return;
  req.file.data = await stampBuffer(req.file.data);
  req.file.size = req.file.data.length;
  // width/height and every `sizes.*` are computed by Payload from req.file.data afterwards
};
