import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Copy, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMO_DELAY_MS, PROMO_SESSION_KEY } from "@/lib/daily-offer";
import {
  BASE_PRICE,
  COUPON_CODE,
  COUPON_DISCOUNT,
  formatMmSs,
  getCouponState,
  readCouponStartedAt,
  startCouponClock,
} from "@/lib/coupon";
import { useCoupon } from "@/hooks/use-coupon";

/**
 * Sales-page popup: gives a Rs. 500 coupon (GROW500) that expires 15 minutes after
 * the popup is first shown. Expiry rules live in src/lib/coupon.ts.
 */
export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const enrolling = useRef(false);
  const shown = useRef(false);
  const { state, apply } = useCoupon();

  useEffect(() => {
    if (location.pathname !== "/" || shown.current) return;
    try { if (sessionStorage.getItem(PROMO_SESSION_KEY) === "1") return; } catch { /* Storage may be disabled; page still works. */ }
    // A coupon that has already expired is not offered again.
    const prev = getCouponState(Date.now(), readCouponStartedAt());
    if (prev.started && !prev.active) return;
    const timer = setTimeout(() => {
      shown.current = true;
      try { sessionStorage.setItem(PROMO_SESSION_KEY, "1"); } catch { /* Use the in-memory session fallback. */ }
      startCouponClock();
      setOpen(true);
    }, PROMO_DELAY_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* Clipboard may be blocked; the code is visible anyway. */ }
  };

  const goToEnrollment = () => {
    apply(COUPON_CODE);
    enrolling.current = true;
    setOpen(false);
    const form = document.getElementById("lead-form");
    if (form) {
      form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
    } else {
      void navigate({ to: "/", hash: "lead-form" });
    }
  };

  if (location.pathname !== "/") return null;

  const expired = state.started && !state.active;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="masterclass-promo-overlay" />
        <DialogPrimitive.Content className="masterclass-promo" onCloseAutoFocus={(event) => {
          if (enrolling.current) {
            event.preventDefault();
            enrolling.current = false;
            document.getElementById("lead-form")?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
          }
        }}>
          <header className="masterclass-promo-header">
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close promotional offer" className="masterclass-promo-close"><X aria-hidden="true" /></Button>
            </DialogPrimitive.Close>
            <DialogPrimitive.Title className="masterclass-promo-title">Wait! Here's Rs. {COUPON_DISCOUNT} OFF 🎁</DialogPrimitive.Title>
          </header>
          <div className="masterclass-promo-body">
            <DialogPrimitive.Description asChild>
              <div className="masterclass-promo-copy">
                <p>Use this coupon code to get the Business Growth Masterclass for just <mark>PKR {(BASE_PRICE - COUPON_DISCOUNT).toLocaleString("en-PK")}</mark> instead of PKR {BASE_PRICE.toLocaleString("en-PK")}.</p>
              </div>
            </DialogPrimitive.Description>

            <div className="masterclass-promo-code">
              <span className="masterclass-promo-code-label">Your coupon code</span>
              <div className="masterclass-promo-code-row">
                <span className="masterclass-promo-code-value">{COUPON_CODE}</span>
                <Button type="button" variant="outline" size="sm" onClick={copyCode} className="masterclass-promo-copy-btn">
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="masterclass-promo-pricing">
              <div className="masterclass-promo-price-row">
                <div className="masterclass-promo-price"><span>PKR</span> {(BASE_PRICE - COUPON_DISCOUNT).toLocaleString("en-PK")}</div>
                <div className="masterclass-promo-regular"><s>PKR {BASE_PRICE.toLocaleString("en-PK")}</s></div>
              </div>
              <p className="masterclass-promo-timer" aria-live="polite">
                <Clock aria-hidden="true" />
                {expired ? "This coupon has expired" : <>Code expires in <strong>{formatMmSs(state.remainingMs)}</strong></>}
              </p>
            </div>
            <Button className="masterclass-promo-cta" onClick={goToEnrollment} disabled={expired}>👉 Apply Code &amp; Enroll Now</Button>
            <p className="masterclass-promo-support">Business Growth Masterclass | Designed for Service-Based Business Owners</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
