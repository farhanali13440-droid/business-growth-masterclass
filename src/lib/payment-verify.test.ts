import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  amountMatches,
  amountsInText,
  evaluateReading,
  textHasPayeeAccount,
  textHasPayeeName,
} from "./payment-verify.ts";

describe("payment screenshot matching", () => {
  test("name: case, spacing and truncation", () => {
    assert.ok(textHasPayeeName("Sent to FARHAN ALI RASHEED"));
    assert.ok(textHasPayeeName("farhan  ali ras..."));
    assert.ok(!textHasPayeeName("Farhan Ahmed"));
  });
  test("account: full, international and masked formats", () => {
    assert.ok(textHasPayeeAccount("0313 5944817"));
    assert.ok(textHasPayeeAccount("+92-313-5944817"));
    assert.ok(textHasPayeeAccount("0313****817"));
    assert.ok(!textHasPayeeAccount("0300 1234567"));
  });
  test("amounts", () => {
    assert.deepEqual(amountsInText("Rs. 1,698.00 paid"), [1698]);
    assert.ok(amountsInText("Amount PKR 999 Fee 0").includes(999));
    assert.ok(amountsInText("Rs.999").includes(999));
    assert.ok(amountsInText("Rs.1,698.00").includes(1698));
  });
  test("decision", () => {
    const base = { available: true, nameFound: true, accountFound: false, amounts: [999] };
    assert.deepEqual(evaluateReading(base, 999), { status: "pass" });
    assert.deepEqual(evaluateReading(base, 1698), { status: "fail", reason: "amount" });
    assert.deepEqual(evaluateReading({ ...base, nameFound: false }, 999), {
      status: "fail",
      reason: "payee",
    });
    assert.deepEqual(
      evaluateReading({ ...base, nameFound: false, accountFound: true, amounts: [1698] }, 1698),
      { status: "pass" },
    );
    assert.deepEqual(evaluateReading({ ...base, available: false }, 999), {
      status: "unavailable",
    });
  });
  test("rounded-up payments are accepted, underpayments are not", () => {
    assert.ok(amountMatches(999, 999));
    assert.ok(amountMatches(1000, 999));
    assert.ok(amountMatches(1700, 1698));
    assert.ok(amountMatches(5000, 5000));
    assert.ok(amountMatches(3000, 3000));
    assert.ok(!amountMatches(990, 999));
    assert.ok(!amountMatches(1100, 999));
    assert.ok(!amountMatches(5100, 5000));
    const r = { available: true, nameFound: true, accountFound: false, amounts: [1000] };
    assert.deepEqual(evaluateReading(r, 999), { status: "pass" });
  });
});
