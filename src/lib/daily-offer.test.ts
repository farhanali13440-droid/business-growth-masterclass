import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getDailyOfferDeadline, PROMO_PRICE, PROMO_REGULAR_PRICE, PROMO_DELAY_MS } from "./daily-offer.ts";

describe("Masterclass rolling Pakistani offer", () => {
  test("expires at 23:59:59 Pakistan time on the current Pakistani date", () => {
    const result = getDailyOfferDeadline(new Date("2026-10-26T05:16:00Z"));
    assert.equal(result.dateLabel, "26 October 2026");
    assert.equal(new Date(result.expiresAtMs).toISOString(), "2026-10-26T18:59:59.000Z");
  });
  test("advances at Pakistani midnight without waiting for UTC midnight", () => {
    const before = getDailyOfferDeadline(new Date("2026-10-26T18:59:59.999Z"));
    const after = getDailyOfferDeadline(new Date("2026-10-26T19:00:00Z"));
    assert.equal(before.dateLabel, "26 October 2026");
    assert.equal(after.dateLabel, "27 October 2026");
    assert.equal(after.expiresAtMs - before.expiresAtMs, 86400000);
    assert.equal(before.nextMidnightMs, Date.parse("2026-10-26T19:00:00Z"));
  });
  test("handles year rollover and refresh deterministically", () => {
    const instant = new Date("2026-12-31T19:00:00Z");
    assert.equal(getDailyOfferDeadline(instant).dateLabel, "1 January 2027");
    assert.deepEqual(getDailyOfferDeadline(instant), getDailyOfferDeadline(instant));
    assert.equal(getDailyOfferDeadline(instant).expiresAtMs, Date.parse("2027-01-01T18:59:59Z"));
  });
  test("regular price is PKR 2500", () => { assert.equal(PROMO_REGULAR_PRICE, 2500); });
  test("formats Pakistani offer dates with ordinal days", () => {
    for (const [day, expected] of [[1, "1st"], [2, "2nd"], [3, "3rd"], [11, "11th"], [12, "12th"], [13, "13th"], [21, "21st"], [26, "26th"]] as const) {
      const result = getDailyOfferDeadline(new Date(`2026-10-${String(day).padStart(2, "0")}T12:00:00Z`));
      assert.equal(result.promotionalDateLabel, `${expected} October 2026`);
    }
  });
  test("promotional price stays PKR 999 across daily rollover", () => {
    getDailyOfferDeadline(new Date("2026-10-26T19:00:00Z"));
    assert.equal(PROMO_PRICE, 999);
  });
  test("display delay is exactly three seconds", () => { assert.equal(PROMO_DELAY_MS, 3000); });
});