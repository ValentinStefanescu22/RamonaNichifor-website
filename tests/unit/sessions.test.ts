// node --test --experimental-strip-types tests/unit/sessions.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { sessionLabel } from "../../lib/sessions.ts";

test("a session shows its length, and its price only when the CMS has one", () => {
  assert.deepEqual(sessionLabel({ minutes: 60, priceEur: 25 }), { minutes: "60 min", price: "25 €" });
  assert.deepEqual(sessionLabel({ minutes: 90, priceEur: null }), { minutes: "90 min", price: null });
  assert.deepEqual(sessionLabel({ minutes: 120, priceEur: 0 }), { minutes: "120 min", price: null }); // 0 is "not set", never "0 €"
});
