import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  checkCoupon,
  getCouponState,
  formatMmSs,
  priceWithCoupon,
  COUPON_WINDOW_MS,
} from "./coupon.ts";

const T0 = Date.parse("2026-11-23T16:00:00Z");

describe("popup coupon", () => {
  test("valid for exactly 15 minutes after the popup starts the clock", () => {
    assert.deepEqual(checkCoupon("grow500", T0 + 60_000, T0), { ok: true });
    assert.deepEqual(checkCoupon("GROW500", T0 + COUPON_WINDOW_MS - 1, T0), { ok: true });
    assert.deepEqual(checkCoupon("GROW500", T0 + COUPON_WINDOW_MS, T0), { ok: false, reason: "expired" });
  });
  test("rejects wrong codes and codes used before the popup was seen", () => {
    assert.deepEqual(checkCoupon("SAVE500", T0, T0), { ok: false, reason: "invalid" });
    assert.deepEqual(checkCoupon("GROW500", T0, null), { ok: false, reason: "not_started" });
  });
  test("state and formatting", () => {
    const s = getCouponState(T0 + 65_000, T0);
    assert.equal(s.active, true);
    assert.equal(formatMmSs(s.remainingMs), "13:55");
    assert.equal(formatMmSs(0), "00:00");
    assert.equal(priceWithCoupon(true), 499);
    assert.equal(priceWithCoupon(false), 999);
  });
});
