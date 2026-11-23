import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDailyOfferDeadline, PROMO_DELAY_MS, PROMO_PRICE, PROMO_REGULAR_PRICE, PROMO_SESSION_KEY } from "@/lib/daily-offer";

export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState<ReturnType<typeof getDailyOfferDeadline> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const enrolling = useRef(false);
  const shown = useRef(false);

  useEffect(() => {
    if (location.pathname !== "/") return;
    let midnightTimer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      const current = getDailyOfferDeadline();
      setDeadline(current);
      clearTimeout(midnightTimer);
      midnightTimer = setTimeout(refresh, Math.max(1, current.nextMidnightMs - Date.now()));
    };
    refresh();
    const interval = setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(midnightTimer);
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/" || shown.current) return;
    try { if (sessionStorage.getItem(PROMO_SESSION_KEY) === "1") return; } catch { /* Storage may be disabled; page still works. */ }
    const timer = setTimeout(() => {
      shown.current = true;
      try { sessionStorage.setItem(PROMO_SESSION_KEY, "1"); } catch { /* Use the in-memory session fallback. */ }
      setOpen(true);
    }, PROMO_DELAY_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const goToEnrollment = () => {
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
            <DialogPrimitive.Title className="masterclass-promo-title">Enjoy PKR 999 A Little Longer</DialogPrimitive.Title>
          </header>
          <div className="masterclass-promo-body">
            <DialogPrimitive.Description asChild>
              <div className="masterclass-promo-copy">
                <p>After hearing from many of you, we've decided to keep our Clinic Growth Masterclass fee at <mark>PKR {PROMO_PRICE.toLocaleString("en-PK")}</mark> for a little longer. No change until <mark>{deadline?.promotionalDateLabel}</mark>.</p>
                <p>Secure your seat at today's special price before <mark>11:59 PM PKT tonight, {deadline?.promotionalDateLabel}</mark>.</p>
                <p>Due to the rising cost of managing a high number of students, the price may soon adjust to <mark>PKR {PROMO_REGULAR_PRICE.toLocaleString("en-PK")}</mark>.</p>
              </div>
            </DialogPrimitive.Description>
            <div className="masterclass-promo-pricing">
              <div className="masterclass-promo-price-row">
                <div className="masterclass-promo-price"><span>PKR</span> {PROMO_PRICE.toLocaleString("en-PK")}</div>
                <div className="masterclass-promo-regular"><s>PKR {PROMO_REGULAR_PRICE.toLocaleString("en-PK")}</s></div>
              </div>
              <p className="masterclass-promo-deadline" aria-live="polite">Offer ends: {deadline?.promotionalDateLabel} at 11:59 PM PKT</p>
            </div>
            <Button className="masterclass-promo-cta" onClick={goToEnrollment}>👉 Enroll Now &amp; Secure Your Seat</Button>
            <p className="masterclass-promo-support">Practical Strategies for Clinic Growth | Designed for Doctors</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
