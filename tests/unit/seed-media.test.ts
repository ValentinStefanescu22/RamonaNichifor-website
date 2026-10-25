import assert from "node:assert/strict";
import { test } from "node:test";
import { assertInBucket, assertSameFilename } from "../../payload/seed/media-check.ts";

test("a renamed upload (name-1.webp) stops the seed", () => {
  assert.doesNotThrow(() => assertSameFilename({ filename: "fluture-01.webp" }, "fluture-01.webp"));
  assert.throws(() => assertSameFilename({ filename: "fluture-2.webp" }, "fluture-01.webp"), /stored as "fluture-2.webp"/);
});

test("a media row with no object in the bucket stops the seed", async () => {
  await assert.doesNotReject(assertInBucket("a.webp", async () => ({})));
  await assert.rejects(assertInBucket("a.webp", async () => { throw new Error("NotFound"); }), /not in the R2 bucket \(NotFound\)/);
});
