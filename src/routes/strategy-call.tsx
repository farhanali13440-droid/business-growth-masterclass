import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, XCircle, ArrowDown, ArrowRight, MessageCircle, CalendarCheck } from "lucide-react";
import { isAdminPreview, PREVIEW_LEAD_ID } from "@/lib/admin-preview";
import { AdminPreviewBadge } from "@/components/site/AdminPreviewBadge";

type Search = { lead?: string; from?: string };

/**
 * Post-purchase "Free Business Growth Plan" page.
 * Calendly is embedded directly above the fold (no gate). Booking → /thank-you?booked=1.
 * Set the qualifying questions, the 20-minute length, the 5–7 day booking window and
 * the reminders inside the Calendly event itself.
 */
const BOOKING_URL = "https://calendly.com/farhanali13440/30min";
const PLANS_PER_WEEK = 4;
const CALL_MINUTES = 20;
const HOST = "Farhan Ali";
const WHATSAPP = "923135944817";

function track(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", event, params);
    }
  } catch {}
}

export const Route = createFileRoute("/strategy-call")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    lead: typeof s.lead === "string" ? s.lead : undefined,
    from: typeof s.from === "string" ? s.from : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Claim Your Free Business Growth Plan" },
      {
        name: "description",
        content: "Masterclass members get a complimentary call to build a 1-page growth plan for their business.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StrategyCallPage,
});

type Buyer = { name?: string; email?: string; whatsapp?: string };

function StrategyCallPage() {
  const navigate = useNavigate();
  const { lead, from } = Route.useSearch();
  const fromMembers = from === "members";
  const [leadId, setLeadId] = useState<string | null>(null);
  const [buyer, setBuyer] = useState<Buyer>({});
  const [ready, setReady] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    let id = lead ?? null;
    try {
      if (!id) id = localStorage.getItem("cgm_last_lead");
      const raw = localStorage.getItem("cgm_last_buyer");
      if (raw) setBuyer(JSON.parse(raw) as Buyer);
    } catch {}
    const admin = isAdminPreview();
    setAdminMode(admin);
    if (!id && admin) id = PREVIEW_LEAD_ID;
    if (!id) {
      navigate({ to: "/", replace: true });
      return;
    }
    setLeadId(id);
    setReady(true);
    track("StrategyCallPageView", { lead_id: id });
  }, [lead, navigate]);

  function goToThankYou(booked = false) {
    if (typeof window === "undefined") return;
    if (fromMembers && !booked) {
      window.location.href = "/members";
      return;
    }
    const qs = new URLSearchParams();
    if (leadId) qs.set("lead", leadId);
    if (booked) qs.set("booked", "1");
    window.location.href = `/thank-you${qs.toString() ? `?${qs}` : ""}`;
  }

  function scrollToCalendar() {
    document.getElementById("calendar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-secondary">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const email = buyer.email && !buyer.email.endsWith("@unknown.local") ? buyer.email : null;
  const wa = buyer.whatsapp && buyer.whatsapp !== "unknown" ? buyer.whatsapp : null;
  const sentTo = [email, wa].filter(Boolean).join(" / ");
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Assalam-o-Alaikum, I bought the Business Growth Masterclass and couldn't find a time for my free growth plan call.",
  )}`;

  return (
    <div className="min-h-screen flex flex-col">
      {adminMode && <AdminPreviewBadge />}

      {/* 1. Confirmation bar */}
      {!fromMembers && (
        <div className="bg-emerald-600 text-white">
          <div className="mx-auto max-w-4xl px-4 py-2.5 text-center text-xs md:text-sm font-bold">
            ✅ You're in! Your Business Growth Masterclass order has been received
            {sentTo ? <> — your access will be confirmed at {sentTo}.</> : <> — your access will be confirmed on WhatsApp shortly.</>}
          </div>
        </div>
      )}
      <Topbar />

      <main className="bg-secondary flex-1">
        {/* 2. Headline + calendar */}
        <section className="mx-auto max-w-4xl px-4 pt-8 md:pt-12 text-center">
          <div className="text-[11px] md:text-xs font-black tracking-[0.2em] uppercase text-primary">
            One More Step · Masterclass Members Only
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight text-slate-900">
            Claim Your <span className="gradient-highlight">Free Business Growth Plan</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Because you joined the Business Growth Masterclass, you get a complimentary {CALL_MINUTES}-minute
            call with {HOST}. On the call, we build a 1-page growth plan for your business. It's yours to keep.
          </p>
          <p className="mt-3 inline-block rounded-full bg-amber-100 border border-amber-300 px-4 py-1.5 text-xs md:text-sm font-bold text-amber-900">
            We only do {PLANS_PER_WEEK} plans a week.
          </p>
          <div className="mt-5 md:hidden">
            <button
              type="button"
              onClick={scrollToCalendar}
              className="btn-cta w-full justify-center inline-flex items-center gap-2 px-6 py-4 text-base"
            >
              Pick My Time <ArrowDown className="size-5" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section id="calendar" className="mx-auto max-w-4xl px-4 pt-6 scroll-mt-4">
          <CalendlyEmbed
            url={BOOKING_URL}
            name={buyer.name ?? null}
            email={email}
            onScheduled={() => {
              track("StrategyCallBooked", { lead_id: leadId });
              goToThankYou(true);
            }}
          />
          <p className="mt-3 text-center text-sm text-slate-600">
            Can't find a time that works?{" "}
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 underline underline-offset-2">
              Message us on WhatsApp
            </a>{" "}
            and we'll fit you in.
          </p>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-10">
          {/* 3. What you walk away with */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">In {CALL_MINUTES} Minutes, You'll Know:</h2>
            <ol className="mt-6 grid gap-5">
              {[
                ["Where your next clients can come from.", "The 1 or 2 channels that fit your business, your area and your budget."],
                ["What to fix first.", "Whether it's getting enquiries, turning enquiries into sales, or getting clients to come back."],
                ["Your next 30 days.", "A simple action list you can start the same week."],
              ].map(([t, d], i) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-black">{i + 1}</span>
                  <p className="text-base md:text-lg text-slate-800 leading-snug">
                    <span className="font-black">{t}</span> {d}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* 4. How it works */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">How It Works</h2>
            <ol className="mt-6 grid gap-4">
              {[
                "Pick a time in the calendar above.",
                "Answer 3 quick questions, so the plan is made for your business, not a template.",
                `Get your plan on the call. ${HOST} walks you through it live.`,
              ].map((p, i) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-black">{i + 1}</span>
                  <span className="text-base md:text-lg text-slate-800 leading-snug">{p}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 5. Honest note */}
          <section className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">Is this a sales call?</h2>
            <p className="mt-3 text-base md:text-lg text-slate-800 leading-relaxed">
              The plan is free and it's yours, whatever you decide. If you'd like our help putting it into
              action, we'll tell you how we work. If not, no pressure. You keep the plan.
            </p>
          </section>

          {/* 6. Who it's for */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Who It's For</h2>
            <ul className="mt-6 grid gap-3">
              {[
                "Business owners who want more client bookings and sales",
                "Businesses getting enquiries but losing them before they buy",
                "Owners who want a clear plan instead of guessing",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-base md:text-lg text-slate-800">{p}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <XCircle className="mt-0.5 size-5 shrink-0 text-slate-400" />
                <span className="text-base md:text-lg text-slate-500">Not for you if you're not running a business yet</span>
              </li>
            </ul>
          </section>

          {/* 7. Second calendar button */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-10 text-center shadow-lg">
            <CalendarCheck className="mx-auto size-10 text-amber-300" />
            <h2 className="mt-3 text-2xl md:text-3xl font-black">Your free plan is waiting.</h2>
            <p className="mt-2 text-sm md:text-base text-slate-300">We only do {PLANS_PER_WEEK} plans a week.</p>
            <button
              type="button"
              onClick={scrollToCalendar}
              className="btn-cta mt-6 w-full sm:w-auto justify-center inline-flex items-center gap-2 px-7 py-4 text-base md:text-lg"
            >
              Book My Free Growth Plan Call <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
            </button>
          </section>

          {/* 8. Skip link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                track("StrategyCallDeclined", { lead_id: leadId });
                goToThankYou(false);
              }}
              className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-4"
            >
              {fromMembers ? "No thanks, back to the members area →" : "No thanks, take me to the masterclass →"}
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <MessageCircle className="size-3.5" /> Questions? WhatsApp us anytime.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** Calendly inline embed — booking happens on our page; redirects once a call is scheduled. */
function CalendlyEmbed({
  url,
  name,
  email,
  onScheduled,
}: {
  url: string;
  name: string | null;
  email: string | null;
  onScheduled: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      embed_type: "Inline",
      embed_domain: window.location.hostname,
      hide_gdpr_banner: "1",
      primary_color: "4f46e5",
    });
    if (name) params.set("name", name);
    if (email) params.set("email", email);
    setSrc(`${url}?${params.toString()}`);
  }, [url, name, email]);

  useEffect(() => {
    let done = false;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const ev = (e.data as { event?: string } | null)?.event;
      if (ev === "calendly.event_scheduled" && !done) {
        done = true;
        setTimeout(onScheduled, 1500);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onScheduled]);

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      {src ? (
        <iframe title="Book your free growth plan call" src={src} className="w-full block" style={{ height: 760, border: 0 }} />
      ) : (
        <div className="h-[760px] grid place-items-center text-sm text-slate-500">Loading calendar…</div>
      )}
    </div>
  );
}
