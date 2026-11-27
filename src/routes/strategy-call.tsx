import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import {
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  Loader2,
  MessageCircle,
  PartyPopper,
} from "lucide-react";
import { isAdminPreview, PREVIEW_LEAD_ID } from "@/lib/admin-preview";
import { AdminPreviewBadge } from "@/components/site/AdminPreviewBadge";
import { QUESTIONS, type ApplicationAnswers } from "@/lib/call-qualification";
import { submitCallApplication } from "@/lib/call-application.functions";

type Search = { lead?: string; from?: string };

// The booking link is NOT in this file on purpose — the server only returns it to qualified
// applicants (see src/lib/call-application.functions.ts).

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
      { title: "Book Your Free Strategy Call — Business Growth Masterclass" },
      {
        name: "description",
        content:
          "Book a free strategy call: we audit your business and give you a step-by-step growth strategy.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StrategyCallPage,
});

function StrategyCallPage() {
  const navigate = useNavigate();
  const { lead, from } = Route.useSearch();
  // Opened from the members area → hide the "order submitted" banner, "skip" returns to /members.
  const fromMembers = from === "members";
  const [leadId, setLeadId] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);
  const [view, setView] = useState<"page" | "apply" | "qualified">("page");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ApplicationAnswers>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<{ name: string | null; email: string | null }>({ name: null, email: null });
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    let id = lead ?? null;
    if (!id && typeof window !== "undefined") {
      try {
        id = localStorage.getItem("cgm_last_lead");
      } catch {}
    }
    const admin = isAdminPreview();
    setAdminMode(admin);
    if (!id && admin) id = PREVIEW_LEAD_ID;
    if (!id) {
      navigate({ to: "/", replace: true });
      return;
    }
    setLeadId(id);
    setGateChecked(true);
  }, [lead, navigate]);

  function scrollTop() {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startApplication() {
    track("StrategyCallApplicationStarted", { lead_id: leadId });
    setView("apply");
    setStep(0);
    setError(null);
    scrollTop();
  }

  function handleBookClick() {
    track("StrategyCallBooked", { lead_id: leadId });
  }

  async function submitApplication(final: Partial<ApplicationAnswers>) {
    if (!leadId || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitCallApplication({
        data: { leadId, answers: final as Record<string, string> },
      });
      // Everyone can book — the answers just help us prepare for the call.
      track(res.tier === "qualified" ? "StrategyCallQualified" : "StrategyCallNotQualified", {
        lead_id: leadId,
        tier: res.tier,
      });
      setBookingUrl(res.bookingUrl);
      setPrefill({ name: res.name, email: res.email });
      setView("qualified");
      scrollTop();
    } catch (err) {
      console.error("Application save failed", err);
      setError("Something went wrong while saving your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function answer(value: string) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      void submitApplication(next);
    }
  }

  /** "No thanks" → straight to the confirmation page. */
  function goToDownsell() {
    if (leadId && !fromMembers) track("StrategyCallDeclined", { lead_id: leadId });
    goToThankYou();
  }

  function goToThankYou() {
    if (typeof window !== "undefined") {
      if (fromMembers) {
        window.location.href = "/members";
        return;
      }
      const qs = leadId ? `?lead=${encodeURIComponent(leadId)}` : "";
      window.location.href = `/thank-you${qs}`;
    }
  }

  if (!gateChecked) {
    return (
      <div className="min-h-screen grid place-items-center bg-secondary">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const BookCta = ({ label = "Book My Free Strategy Call", dark = false }: { label?: string; dark?: boolean }) => (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={startApplication}
        className="btn-cta w-full sm:w-auto justify-center inline-flex items-center gap-2 px-7 py-4 text-base md:text-lg"
      >
        <Calendar className="size-5" aria-hidden="true" />
        <span>{label}</span>
        <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
      </button>
      <span className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>
        Answer a few quick questions first — takes about 60 seconds.
      </span>
    </div>
  );

  const SkipLink = ({ dark = false }: { dark?: boolean }) => (
    <button
      type="button"
      onClick={goToDownsell}
      className={`text-sm md:text-base underline underline-offset-4 ${dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
    >
      {fromMembers ? "No thanks, back to the members area" : "No thanks, take me to my confirmation page"}
    </button>
  );

  /* ---------------- QUESTIONS ---------------- */
  if (view === "apply") {
    const q = QUESTIONS[step];
    const current = answers[q.id] ?? "";
    const pct = Math.round((step / QUESTIONS.length) * 100);
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <main className="bg-secondary flex-1">
          <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-primary">
              <ClipboardList className="size-4" /> A Few Quick Questions About Your Business
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>

            <section className="mt-6 bg-card rounded-2xl border shadow-sm p-6 md:p-8">
              <h1 className="text-lg md:text-2xl font-black leading-snug text-slate-900">{q.title}</h1>
              {q.help && <p className="mt-2 text-sm text-slate-500">{q.help}</p>}

              {q.options ? (
                <div className="mt-5 grid gap-2.5">
                  {q.options.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      disabled={submitting}
                      onClick={() => answer(o.value)}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3.5 text-sm md:text-base font-semibold transition disabled:opacity-60 ${
                        current === o.value
                          ? "border-primary bg-primary/5 text-slate-900"
                          : "border-slate-200 bg-white text-slate-800 hover:border-primary/60 hover:bg-primary/5"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  className="mt-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = String(new FormData(e.currentTarget).get("v") ?? "").trim();
                    if (v.length < 2) {
                      setError("Please fill this in to continue.");
                      return;
                    }
                    setError(null);
                    answer(v.slice(0, 200));
                  }}
                >
                  <input
                    key={q.id}
                    name="v"
                    defaultValue={current}
                    autoFocus
                    maxLength={200}
                    placeholder={q.text?.placeholder}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="btn-cta mt-4 w-full justify-center inline-flex items-center gap-2 px-6 py-3.5 text-base"
                  >
                    Next <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
                  </button>
                </form>
              )}

              {submitting && (
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-800">
                  <Loader2 className="size-4 animate-spin" /> Checking your answers…
                </div>
              )}
              {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
              {error && !submitting && step === QUESTIONS.length - 1 && answers[q.id] && (
                <button
                  type="button"
                  onClick={() => void submitApplication(answers)}
                  className="mt-3 text-sm font-bold text-primary underline underline-offset-4"
                >
                  Try again
                </button>
              )}
            </section>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setError(null);
                  if (step === 0) setView("page");
                  else setStep(step - 1);
                }}
                className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="button"
                onClick={goToDownsell}
                className="text-xs md:text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4"
              >
                {fromMembers ? "Skip — back to the members area" : "Skip — take me to my confirmation page"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- BOOKING → CALENDLY (embedded) ---------------- */
  if (view === "qualified" && bookingUrl) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <main className="bg-secondary flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 space-y-6">
            <section className="text-center">
              <div className="mx-auto size-14 rounded-full bg-emerald-100 grid place-items-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
              <h1 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
                Thank You! Now Pick a Time For Your{" "}
                <span className="gradient-highlight">Free Strategy Call</span>
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
                Choose a date and time below that suits you. We'll review your answers before the call
                so we can spend the time on your business and your strategy.
              </p>
            </section>

            <CalendlyEmbed
              url={bookingUrl}
              name={prefill.name}
              email={prefill.email}
              onScheduled={() => {
                handleBookClick();
                goToThankYou();
              }}
            />

            <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-black text-slate-900">Before Your Call</h2>
              <ul className="mt-4 grid gap-3">
                {[
                  "Pick the earliest time that works for you — slots fill up quickly.",
                  "Keep WhatsApp handy: our team will message you to confirm your call.",
                  "Join from a quiet place where you can talk openly about your business and goals.",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-sm md:text-base text-slate-800 leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="text-center">
              <button
                type="button"
                onClick={goToThankYou}
                className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4"
              >
                {fromMembers ? "Back to the members area" : "Skip for now — continue to my confirmation page"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- FREE STRATEGY CALL PAGE ---------------- */
  const P = ({ children }: { children: React.ReactNode }) => (
    <p className="text-base md:text-lg text-slate-800 leading-relaxed">{children}</p>
  );

  const onCall = [
    "A full audit of your business's online presence — Google, Facebook, Instagram and WhatsApp",
    "Where you're losing clients right now, and why",
    "A step-by-step growth strategy made for your business and your city",
    "Exactly how to implement what you learned in the masterclass — and what to do first",
    "Clear answers to your questions about ads, offers and getting consistent clients",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {adminMode && <AdminPreviewBadge />}
      <Topbar />

      <main className="bg-secondary flex-1">
        {!fromMembers && (
          <div className="bg-emerald-600 text-white">
            <div className="mx-auto max-w-3xl px-4 py-2.5 flex items-center justify-center gap-2 text-center text-xs md:text-sm font-bold">
              <PartyPopper className="size-4 shrink-0" />
              Your Business Growth Masterclass order has been received. One more thing before you go…
            </div>
          </div>
        )}

        <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
          <div className="bg-card rounded-2xl border shadow-sm px-5 py-8 md:px-12 md:py-12">
            <div className="text-center">
              <span className="inline-block text-[11px] md:text-xs font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                100% Free — No Obligation
              </span>
              <h1 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
                Want Our Help Growing Your Business?{" "}
                <span className="gradient-highlight">Book a Free Strategy Call With Us</span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600">
                We'll audit your business, guide you on how to implement the masterclass, and give
                you a growth strategy — free.
              </p>
              <div className="mt-7">
                <BookCta label="Book My Free Strategy Call" />
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <P>Congratulations on joining the Business Growth Masterclass!</P>
              <P>
                The masterclass gives you the complete system. But every business is different — a real
                estate agency, a restaurant and a construction company don't grow the same way.
              </P>
              <P>
                <span className="font-bold">
                  That's why we're offering you a free 1-on-1 strategy call.
                </span>{" "}
                We'll look at your business together and show you exactly how to apply the system to
                it, so you know what to do first and don't waste time or money.
              </P>

              <h2 className="pt-4 text-xl md:text-2xl font-black text-slate-900">
                On This Free Call, You'll Get:
              </h2>
              <ul className="grid gap-3">
                {onCall.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <span className="text-base md:text-lg text-slate-800 leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
              <P>
                And if you'd like our team to implement everything for you, we can talk about that too.
                There's no pressure — the strategy is yours to keep either way.
              </P>

              <h2 className="pt-4 text-xl md:text-2xl font-black text-slate-900">How It Works</h2>
              <ol className="grid gap-3">
                {[
                  "Click the button and answer a few quick questions about your business.",
                  "Pick a date and time that suits you — right here on this page.",
                  "We review your business before the call.",
                  "On the call, we audit your business and give you your growth strategy.",
                ].map((p, i) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-black">
                      {i + 1}
                    </span>
                    <span className="text-base md:text-lg text-slate-800 leading-snug">{p}</span>
                  </li>
                ))}
              </ol>

              <P>
                Talk soon,
                <br />
                <span className="font-black">Farhan Ali</span>
              </P>
            </div>
          </div>

          <section className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-lg p-6 md:p-10 text-center">
            <Calendar className="mx-auto size-10 text-amber-300" />
            <h2 className="mt-4 text-xl md:text-3xl font-black leading-tight">
              Get Your Free Business Audit &amp; Growth Strategy
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-200 max-w-xl mx-auto">
              Answer a few quick questions, then pick a time to speak with Farhan Ali.
            </p>
            <div className="mt-6">
              <BookCta label="Book My Free Strategy Call" dark />
            </div>
            <div className="mt-5">
              <SkipLink dark />
            </div>
          </section>
        </article>
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
  useEffect(() => {
    let done = false;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const ev = (e.data as { event?: string } | null)?.event;
      if (ev === "calendly.event_scheduled" && !done) {
        done = true;
        // Short pause so the visitor sees Calendly's confirmation.
        setTimeout(onScheduled, 1500);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onScheduled]);

  const params = new URLSearchParams({
    embed_type: "Inline",
    embed_domain: typeof window !== "undefined" ? window.location.hostname : "",
    hide_gdpr_banner: "1",
    primary_color: "4f46e5",
  });
  if (name) params.set("name", name);
  if (email) params.set("email", email);

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <iframe
        title="Book your free strategy call"
        src={`${url}?${params.toString()}`}
        className="w-full block"
        style={{ height: 1000, border: 0 }}
      />
    </div>
  );
}
