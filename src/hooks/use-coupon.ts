import { useCallback, useEffect, useState } from "react";
import {
  COUPON_EVENT,
  checkCoupon,
  getCouponState,
  readCouponApplied,
  readCouponStartedAt,
  setCouponApplied,
  type CouponState,
} from "@/lib/coupon";

/**
 * Live coupon state shared by the offer popup, the sales-page form and checkout.
 * `applied` is only true while the 15-minute window is still open.
 */
export function useCoupon() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [appliedFlag, setAppliedFlag] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const sync = () => {
      setStartedAt(readCouponStartedAt());
      setAppliedFlag(readCouponApplied());
      setNow(Date.now());
    };
    sync();
    const id = setInterval(() => setNow(Date.now()), 1000);
    window.addEventListener(COUPON_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      clearInterval(id);
      window.removeEventListener(COUPON_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const state: CouponState = getCouponState(now, startedAt);
  const applied = appliedFlag && state.active;

  /** Returns null on success, or an error reason. */
  const apply = useCallback((code: string) => {
    const res = checkCoupon(code, Date.now(), readCouponStartedAt());
    if (!res.ok) return res.reason;
    setCouponApplied(true);
    return null;
  }, []);

  const remove = useCallback(() => setCouponApplied(false), []);

  return { state, applied, apply, remove };
}
