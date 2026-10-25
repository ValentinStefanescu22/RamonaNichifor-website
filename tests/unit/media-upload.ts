/**
 * Uploads through Payload's Local API (the real Media hooks, the b3 database from .env.local).
 * Run with `npx payload run tests/unit/media-upload.ts` (part of `npm run test:unit`); exits 1 on failure.
 */
import assert from "node:assert/strict";
import { getPayload } from "payload";
import sharp from "sharp";
import config from "@payload-config";

const payload = await getPayload({ config });
const created: (number | string)[] = [];
// JPEG for the "untouched" checks: Payload itself re-encodes every WebP upload (it treats WebP as possibly
// animated), so only a JPEG/PNG can come back byte-identical
const fixture = async (w: number, h: number, format: "webp" | "jpeg" = "webp") => {
  const data = await sharp({ create: { width: w, height: h, channels: 3, background: "#d8c4a0" } }).toFormat(format, { quality: 90 }).toBuffer();
  return { data, mimetype: `image/${format}`, name: `unit-${w}x${h}.${format === "jpeg" ? "jpg" : format}`, size: data.length };
};
const upload = async (illustration: boolean, file: Awaited<ReturnType<typeof fixture>>, context = {}) => {
  const doc = await payload.create({ collection: "media", data: { alt: "test", illustration }, file, context });
  created.push(doc.id);
  return doc;
};
const checks: [string, () => Promise<void>][] = [
  ["illustration 2400×3000 is capped at 1800 and every size keeps its ratio", async () => {
    const doc = await upload(true, await fixture(2400, 3000));
    assert.equal(Math.max(doc.width!, doc.height!), 1800);
    const sizes = Object.entries(doc.sizes ?? {}).filter(([, s]) => s?.width);
    assert.ok(sizes.length >= 3, "sizes generated");
    for (const [name, s] of [["original", doc], ...sizes] as const)
      assert.ok(Math.abs(s!.width! / s!.height! - 0.8) < 0.01, `${name} ratio ${s!.width}×${s!.height}`);
  }],
  ["decorative WebP keeps its full size (no cap)", async () => {
    const doc = await upload(false, await fixture(2400, 3000));
    assert.deepEqual([doc.width, doc.height], [2400, 3000]);
  }],
  ["decorative upload is stored untouched", async () => {
    const file = await fixture(2400, 3000, "jpeg");
    const doc = await upload(false, file);
    assert.deepEqual([doc.width, doc.height, doc.filesize], [2400, 3000, file.size]);
  }],
  ["illustration with context.skipStamp is stored untouched", async () => {
    const file = await fixture(2400, 3000, "jpeg");
    const doc = await upload(true, file, { skipStamp: true });
    assert.deepEqual([doc.width, doc.height, doc.filesize], [2400, 3000, file.size]);
  }],
  ["replacing the file of an illustration (update) stamps and caps it too", async () => {
    const doc = await upload(false, await fixture(600, 400));
    const updated = await payload.update({ collection: "media", id: doc.id, data: { illustration: true }, file: await fixture(3000, 2000) });
    assert.deepEqual([updated.width, updated.height], [1800, 1200]);
  }],
];

let failed = 0;
for (const [name, run] of checks) {
  try {
    await run();
    console.log(`✔ ${name}`);
  } catch (err) {
    failed++;
    console.error(`✖ ${name}\n`, err);
  }
}
for (const id of created) await payload.delete({ collection: "media", id });
console.log(failed ? `${failed} of ${checks.length} failed` : `all ${checks.length} passed`);
process.exit(failed ? 1 : 0);
