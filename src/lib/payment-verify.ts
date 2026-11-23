/**
 * Pure, browser-safe helpers for payment-screenshot verification.
 * Kept separate from the server function so the matching rules can be unit-tested.
 */

export const PAYEE_NAME = "Farhan Ali Rasheed";
export const PAYEE_ACCOUNT = "03135944817";

export type ScreenshotReading = {
  /** false when the AI check could not run (missing key, outage, timeout) */
  available: boolean;
  nameFound: boolean;
  accountFound: boolean;
  /** every money amount read from the screenshot, in PKR */
  amounts: number[];
};

/** Name match tolerates capitals, extra spaces and truncation ("FARHAN ALI RAS…"). */
export function textHasPayeeName(text: string): boolean {
  return /farhan\s*ali\s*ras/i.test(text);
}

/** Account match: full number in any format (0313…, +92 313…, 92-313-…) or masked (0313****817). */
export function textHasPayeeAccount(text: string): boolean {
  const core = PAYEE_ACCOUNT.replace(/^0/, ""); // 3135944817
  if (text.replace(/\D/g, "").includes(core)) return true;
  return /313[\s\-*•xX\d]{2,8}817/.test(text);
}

/** Pull standalone money-like numbers out of text: "Rs. 1,698.00" → 1698, "999" → 999. */
export function amountsInText(text: string): number[] {
  const out: number[] = [];
  const re = /(?<!\d)(?<!\d[.,])(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?(?![\d,])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const n = Number(m[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0 && n < 10_000_000) out.push(n);
  }
  return out;
}

/**
 * Buyers often round up (Rs. 1,000 for a Rs. 999 order, Rs. 1,700 for Rs. 1,698).
 * Accept the exact amount, or anything up to the next round hundred — never less.
 */
export function amountMatches(paid: number, expected: number): boolean {
  const p = Math.round(paid);
  return p >= expected && p <= Math.ceil(expected / 100) * 100;
}

export type VerifyOutcome =
  | { status: "pass" }
  | { status: "unavailable" }
  | { status: "fail"; reason: "payee" | "amount" | "both" };

/** Pass = (payee name OR account number visible) AND the order total, or the total rounded up to the next hundred. */
export function evaluateReading(r: ScreenshotReading, expectedTotal: number): VerifyOutcome {
  if (!r.available) return { status: "unavailable" };
  const payeeOk = r.nameFound || r.accountFound;
  const amountOk = r.amounts.some((a) => amountMatches(a, expectedTotal));
  if (payeeOk && amountOk) return { status: "pass" };
  if (!payeeOk && !amountOk) return { status: "fail", reason: "both" };
  return { status: "fail", reason: payeeOk ? "amount" : "payee" };
}
