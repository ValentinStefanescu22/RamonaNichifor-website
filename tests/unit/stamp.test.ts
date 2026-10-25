// node --test --experimental-strip-types tests/unit/stamp.test.ts (from the repo root: the stamp PNGs resolve from cwd)
import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { stampBuffer } from "../../payload/hooks/stampIllustration.ts";

/** A smooth diagonal gradient, so any mark shows up as a pixel difference */
const fixture = (w: number, h: number, format: "webp" | "jpeg" | "png" = "webp") => {
  const px = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      px[i] = Math.round((255 * x) / w);
      px[i + 1] = Math.round((255 * y) / h);
      px[i + 2] = 160;
    }
  return sharp(px, { raw: { width: w, height: h, channels: 3 } }).toFormat(format, { quality: 95 }).toBuffer();
};

/** Share of pixels in a region (fractions of the image) whose RGB moved by more than 12: the stamp, not codec noise */
async function diff(a: Buffer, b: Buffer, w: number, h: number, box: [number, number, number, number]) {
  const region = { left: Math.round(box[0] * w), top: Math.round(box[1] * h), width: Math.round(box[2] * w), height: Math.round(box[3] * h) };
  const raw = (buf: Buffer) => sharp(buf).resize(w, h).extract(region).removeAlpha().raw().toBuffer();
  const [x, y] = await Promise.all([raw(a), raw(b)]);
  let changed = 0;
  for (let i = 0; i < x.length; i += 3)
    if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 12) changed++;
  return changed / (x.length / 3);
}

for (const [w, h, cap] of [[2400, 3000, true], [900, 600, false]] as const) {
  test(`${w}×${h}: capped${cap ? "" : " (no enlargement)"}, ratio kept, stamped in the centre and the corner`, async () => {
    const input = await fixture(w, h);
    const out = await stampBuffer(input);
    const meta = await sharp(out).metadata();
    assert.equal(meta.format, "webp");
    assert.equal(Math.max(meta.width!, meta.height!), cap ? 1800 : Math.max(w, h));
    assert.ok(Math.abs(meta.width! / meta.height! - w / h) < 0.01, "ratio preserved");
    const centre = await diff(input, out, meta.width!, meta.height!, [0.15, 0.4, 0.7, 0.2]);
    const corner = await diff(input, out, meta.width!, meta.height!, [0.75, 0.94, 0.22, 0.04]);
    const clean = await diff(input, out, meta.width!, meta.height!, [0.02, 0.02, 0.2, 0.1]); // top-left: no mark
    assert.ok(centre > 0.05, `centre band stamped (${centre})`);
    assert.ok(corner > 0.05, `corner stamped (${corner})`);
    assert.ok(clean < 0.005, `top-left untouched (${clean})`);
  });
}

test("keeps JPEG and PNG formats", async () => {
  for (const format of ["jpeg", "png"] as const) {
    const out = await stampBuffer(await fixture(600, 800, format));
    assert.equal((await sharp(out).metadata()).format, format);
  }
});

test("very wide panorama (line taller than the image) still stamps", async () => {
  const out = await stampBuffer(await fixture(1800, 300));
  assert.deepEqual([(await sharp(out).metadata()).width, (await sharp(out).metadata()).height], [1800, 300]);
});
