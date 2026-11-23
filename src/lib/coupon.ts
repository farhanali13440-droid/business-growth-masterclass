/**
 * Popup coupon — Rs. 500 off the masterclass, valid for 15 minutes from the moment
 * the visitor first sees the offer popup.
 * Pure, browser-safe module (no React) so the expiry rules can be unit-tested.
 * Storage helpers guard against missing / disabled localStorage.
 */

export const COUPON_CODE = "GROW500";
export const COUPON_DISCOUNT = 500;
export const COUPON_WINDOW_MS = 15 * 60 * 1000;
export const BASE_PRICE = 999;
export const COUPON_STARTED_KEY = "bgmCouponStartedAt";
export const COUPON_APPLIED_KEY = "bgmCouponApplied";
/** Fired on window whenever the coupon is started / applied / removed. */
export const COUPON_EVENT = "bgm-coupon-change";

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export type CouponState = {
  started: boolean;
  active: boolean;
  expiresAtMs: number | null;
  remainingMs: number;
};

export function getCouponState(nowMs: number, startedAtMs: number | null): CouponState {
  if (startedAtMs == null || !Number.isFinite(startedAtMs)) {
    return { started: false, active: false, expiresAtMs: null, remainingMs: 0 };
  }
  const expiresAtMs = startedAtMs + COUPON_WINDOW_MS;
  const remainingMs = Math.max(0, expiresAtMs - nowMs);
  return { started: true, active: remainingMs > 0, expiresAtMs, remainingMs };
}

export type CouponCheck = { ok: true } | { ok: false; reason: "invalid" | "expired" | "not_started" };

/** A code only works while its 15-minute window (started by the popup) is open. */
export function checkCoupon(code: string, nowMs: number, startedAtMs: number | null): CouponCheck {
  if (normalizeCode(code) !== COUPON_CODE) return { ok: false, reason: "invalid" };
  const s = getCouponState(nowMs, startedAtMs);
  if (!s.started) return { ok: false, reason: "not_started" };
  if (!s.active) return { ok: false, reason: "expired" };
  return { ok: true };
}

export function couponMessage(reason: "invalid" | "expired" | "not_started"): string {
  if (reason === "invalid") return "That coupon code isn't valid.";
  if (reason === "expired") return "Sorry, this coupon has expired.";
  return "This coupon isn't available right now.";
}

export function priceWithCoupon(applied: boolean): number {
  return applied ? BASE_PRICE - COUPON_DISCOUNT : BASE_PRICE;
}

/** "14:05" style countdown. */
export function formatMmSs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ---------- storage (browser only) ---------- */

function store(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function emit() {
  try {
    window.dispatchEvent(new Event(COUPON_EVENT));
  } catch {
    /* ignore */
  }
}

export function readCouponStartedAt(): number | null {
  const v = store()?.getItem(COUPON_STARTED_KEY);
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

/** Starts the 15-minute window once; later calls keep the original start time. */
export function startCouponClock(nowMs: number = Date.now()): number {
  const existing = readCouponStartedAt();
  if (existing != null) return existing;
  try {
    store()?.setItem(COUPON_STARTED_KEY, String(nowMs));
  } catch {
    /* ignore */
  }
  emit();
  return nowMs;
}

export function readCouponApplied(): boolean {
  return store()?.getItem(COUPON_APPLIED_KEY) === COUPON_CODE;
}

export function setCouponApplied(applied: boolean) {
  try {
    if (applied) store()?.setItem(COUPON_APPLIED_KEY, COUPON_CODE);
    else store()?.removeItem(COUPON_APPLIED_KEY);
  } catch {
    /* ignore */
  }
  emit();
}
