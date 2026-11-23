import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import {
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Target,
  Compass,
  Zap,
  Users,
  Rocket,
  ClipboardList,
  Loader2,
  MessageCircle,
  XCircle,
  AlertTriangle,
  PlayCircle,
} from "lucide-react";
import { ForcedVsl } from "@/components/site/ForcedVsl";
import { isAdminPreview, PREVIEW_LEAD_ID } from "@/lib/admin-preview";
import { AdminPreviewBadge } from "@/components/site/AdminPreviewBadge";
import { QUESTIONS, type ApplicationAnswers } from "@/lib/call-qualification";
import { submitCallApplication } from "@/lib/call-application.functions";
import diyImg from "@/assets/strategy/diy-vs-support.png.asset.json";
import systemImg from "@/assets/strategy/clinic-growth-system.png.asset.json";
import farhanImg from "@/assets/strategy/farhan-strategy-call.png.asset.json";
import processImg from "@/assets/strategy/three-step-process.png.asset.json";

type Search = { lead?: string; from?: string };

// The booking link is NOT in this file on purpose — the server only returns it to qualified doctors
// (see src/lib/call-application.functions.ts).

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
      { title: "Optional — Apply for a Free Clinic Growth Strategy Call" },
      {
        name: "description",
        content:
          "Optional: see if your clinic qualifies for done-for-you implementation of the Clinic Growth Masterclass system.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StrategyCallPage,
});

function StrategyCallPage() {
  const navigate = useNavigate();
  const { lead, from } = Route.useSearch();
  // Opened from the members area → hide the "registration submitted" banner, "skip" returns to /members.
  const fromMembers = from === "members";
  const [leadId, setLeadId] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);
  const [view, setView] = useState<"page" | "apply" | "qualified">("page");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ApplicationAnswers>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  // Forced VSL: nothing to click until the video has been watched long enough.
  const [vslUnlocked, setVslUnlocked] = useState(false);
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
      if (res.tier === "qualified" && res.bookingUrl) {
        track("StrategyCallQualified", { lead_id: leadId });
        setBookingUrl(res.bookingUrl);
        setView("qualified");
        scrollTop();
      } else {
        track("StrategyCallNotQualified", { lead_id: leadId, tier: res.tier });
        navigate({
          to: "/google-ads-diy",
          search: { lead: leadId, t: res.tier },
          replace: true,
        });
      }
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

  /** "No thanks" → Google Ads DIY downsell (PKR 5,000) before the confirmation page. */
  function goToDownsell() {
    if (typeof window === "undefined") return;
    if (fromMembers || !leadId) return goToThankYou();
    track("StrategyCallDeclined", { lead_id: leadId });
    window.location.href = `/google-ads-diy?lead=${encodeURIComponent(leadId)}&t=declined`;
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

  const discussPoints = [
    "Your clinic's current marketing situation",
    "The services you want to grow",
    "Your offer and patient acquisition strategy",
    "The biggest bottlenecks slowing your growth",
    "A possible implementation roadmap for your clinic",
  ];

  const fitPoints = [
    "Own or run a clinic / hospital and make the growth decisions",
    "Want an expert team to implement the system for you",
    "Are ready to invest in a monthly team and an ad budget",
    "Want to start within the next 30 days",
    "Value a long-term growth partner over quick hacks",
  ];

  const notFitPoints = [
    "You'd rather learn it and do it all yourself",
    "You work at someone else's clinic and can't make the decision",
    "You're just exploring and not ready to start yet",
  ];

  const PrimaryCta = ({ label = "See If My Clinic Qualifies" }: { label?: string }) => (
    <button
      type="button"
      onClick={startApplication}
      className="btn-cta w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg"
    >
      <span>{label}</span>
      <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
    </button>
  );

  const SkipLink = () => (
    <button
      type="button"
      onClick={goToDownsell}
      className="text-sm md:text-base text-slate-600 hover:text-slate-900 underline underline-offset-4"
    >
      {fromMembers ? "No Thanks, Back to the Members Area" : "No Thanks, Continue to the Confirmation Page"}
    </button>
  );

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
              <ClipboardList className="size-4" /> Strategy Call Application
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            <section className="mt-6 bg-card rounded-2xl border shadow-sm p-6 md:p-8">
              <h1 className="text-lg md:text-2xl font-black leading-snug text-slate-900">
                {q.title}
              </h1>
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
                {fromMembers ? "Skip — back to the members area" : "Skip — continue to my confirmation page"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "qualified" && bookingUrl) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <main className="bg-secondary flex-1">
          <div className="mx-auto max-w-2xl px-4 py-10 md:py-14 space-y-6">
            <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10 text-center">
              <div className="mx-auto size-16 rounded-full bg-emerald-100 grid place-items-center">
                <CheckCircle2 className="size-10 text-emerald-600" />
              </div>
              <h1 className="mt-4 text-2xl md:text-3xl font-black leading-tight text-slate-900">
                Great News — Your Clinic Qualifies For a Free Strategy Call
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                Based on your answers, your clinic is a good fit for our
                done-for-you implementation. Pick a time below to speak with
                Farhan Ali.
              </p>
              <div className="mt-6 flex justify-center">
                <a
                  href={bookingUrl}
                  onClick={handleBookClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg"
                >
                  <Calendar className="size-5" aria-hidden="true" />
                  <span>Pick a Time For My Call</span>
                  <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-black text-slate-900">
                How to Get the Most From Your Call
              </h2>
              <ul className="mt-4 grid gap-3">
                {[
                  "Pick the earliest time that works for you — slots fill up quickly.",
                  "Keep WhatsApp handy: our team will message you to confirm your call.",
                  "We review your clinic before the call, so we can spend the time on your plan — not on basic questions.",
                  "Join from a quiet place where you can talk openly about your clinic's goals.",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-sm md:text-base text-slate-800 leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="text-center">
              <SkipLink />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {adminMode && (
        <AdminPreviewBadge
          action={
            vslUnlocked
              ? undefined
              : { label: "Skip video lock", onClick: () => setVslUnlocked(true) }
          }
        />
      )}
      {/* Forced-VSL warning bar (post-purchase visitors only) */}
      {!fromMembers && (
        <div
          className={`sticky top-0 z-50 w-full text-white shadow-md ${
            vslUnlocked ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          <div className="mx-auto max-w-5xl px-4 py-2.5 md:py-3 flex items-center justify-center gap-2.5 text-center">
            {vslUnlocked ? (
              <CheckCircle2 className="size-5 md:size-6 shrink-0" />
            ) : (
              <AlertTriangle className="size-5 md:size-6 shrink-0 animate-pulse" />
            )}
            <p className="text-xs md:text-base font-bold leading-snug">
              {vslUnlocked ? (
                <>Your members area is almost ready — choose your next step below the video.</>
              ) : (
                <>
                  <span className="uppercase">Don't exit this page or click anywhere else.</span>{" "}
                  <span className="font-semibold">
                    We are creating your members area so you can access the Clinic Growth
                    Masterclass. Please watch the video below while it's being set up.
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
      <Topbar />

      <main className="bg-secondary flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-10 md:space-y-14">
          {/* 1. Forced VSL — buttons and the rest of the page appear after it's watched */}
          <section className="max-w-4xl mx-auto w-full text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              <PlayCircle className="size-3.5" /> Important — Watch This First
            </span>
            <h1 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
              Congratulations, Doctor! Watch This Short Video Before You Continue
            </h1>
            <p className="mt-3 text-sm md:text-lg text-slate-700">
              Why most doctors never implement what they learn — and how our team can do it for you.
            </p>
            <div className="mt-6">
              <ForcedVsl leadId={leadId} onUnlock={() => setVslUnlocked(true)} />
            </div>
            {vslUnlocked ? (
              <div className="mt-7 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <PrimaryCta label="Yes! See If My Clinic Qualifies" />
                <SkipLink />
              </div>
            ) : (
              <p className="mt-5 text-sm md:text-base font-semibold text-slate-600">
                🔊 Turn your sound on. Your next step will appear right here while you watch.
              </p>
            )}
          </section>

          {vslUnlocked && (
          <>
          {/* 2-5. Hero — headline + DIY vs Support image */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <div className="grid gap-8 md:gap-10 md:grid-cols-[45fr_55fr] items-center">
              <div className="order-1 md:order-1 text-center md:text-left">
                <span className="inline-block text-[11px] md:text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Optional Next Step
                </span>
                <h2 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
                  Want Our Team to Implement It For Your Clinic?
                </h2>
                <p className="mt-4 text-sm md:text-lg text-slate-700 leading-relaxed">
                  The Clinic Growth Masterclass gives you the strategy and
                  roadmap. If you'd rather have our team implement it for you,
                  answer a few quick questions to see if your clinic qualifies
                  for a free strategy call.
                </p>
                <p className="mt-3 text-xs md:text-sm text-slate-500">
                  We only work with a limited number of clinics at a time, so we
                  ask first to make sure we can genuinely help. Takes about 60 seconds.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-start gap-3">
                  <PrimaryCta />
                </div>
                <div className="mt-4">
                  <SkipLink />
                </div>
              </div>

              <div className="order-2 md:order-2">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-amber-200/60 bg-white"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={diyImg.url}
                    alt="Doctor comparing doing clinic marketing alone with implementing a patient acquisition system with professional support."
                    width={1200}
                    height={900}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 6. Problem awareness */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-lg md:text-2xl font-black text-slate-900">
              Knowing What to Do Is Different From Getting It Implemented
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
              Many doctors understand the strategy but still get stuck while
              creating their offer, building the funnel, setting up ads,
              improving their Google presence or converting inquiries into
              appointments.
            </p>
            <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
              Instead of spending months testing everything through trial and
              error, you can have our team build and run the complete system
              for your clinic — if it's the right fit.
            </p>
          </section>

          {/* 7. Clinic Growth System image */}
          <section className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg md:text-2xl font-black text-slate-900">
                We Look at the Complete System — Not Just Your Ads
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                Your clinic's growth usually depends on several connected
                parts. During the call, we identify what is working, what is
                missing and what should be fixed first.
              </p>
            </div>
            <div className="mt-6 md:mt-8 mx-auto" style={{ maxWidth: "1100px" }}>
              <div
                className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200/60 bg-white"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={systemImg.url}
                  alt="Clinic Growth System connecting clinic offer, sales funnel, Meta Ads, Google Business Profile and WhatsApp follow-up."
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </section>

          {/* 8. What we'll discuss */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-lg md:text-2xl font-black text-slate-900">
              During This Free Strategy Call, We Can Look At:
            </h2>
            <ul className="mt-4 grid gap-3">
              {discussPoints.map((p, i) => {
                const Icon = [Target, Rocket, Compass, Zap, Users][i] ?? Target;
                return (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm md:text-base text-slate-800 leading-snug">
                      {p}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 9. Who this call is for */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-lg md:text-2xl font-black text-slate-900">
              This Call Is For You If You:
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {fitPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm md:text-base text-slate-800 leading-snug">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-base md:text-lg font-black text-slate-900">
              It's Probably Not For You (Yet) If:
            </h3>
            <ul className="mt-3 grid gap-2.5">
              {notFitPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <XCircle className="mt-0.5 size-5 shrink-0 text-slate-400" />
                  <span className="text-sm md:text-base text-slate-700 leading-snug">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs md:text-sm text-slate-500">
              Not a fit right now? No problem — after the questions we'll show
              you the best do-it-yourself path for your clinic instead.
            </p>
          </section>

          {/* 10. Farhan trust section */}
          <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-10">
            <div className="grid gap-8 md:gap-10 md:grid-cols-[58fr_42fr] items-center">
              <div className="order-2 md:order-1">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-amber-200/60 bg-white"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={farhanImg.url}
                    alt="Farhan Ali conducting a personalized clinic growth strategy call."
                    width={1400}
                    height={1050}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-xl md:text-3xl font-black leading-tight text-slate-900">
                  Your Personalized Strategy Call With Farhan Ali
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                  This is not a generic agency consultation. We will discuss
                  your clinic, your current bottlenecks and the most practical
                  next step for your situation.
                </p>
                <ul className="mt-5 grid gap-2.5">
                  {[
                    "Personalized clinic audit",
                    "Practical implementation direction",
                    "Recommendations based on your clinic's situation",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                      <span className="text-sm md:text-base text-slate-800 leading-snug">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <PrimaryCta label="Apply For My Free Strategy Call" />
                </div>
                <div className="mt-3">
                  <SkipLink />
                </div>
              </div>
            </div>
          </section>

          {/* 11-12. What happens next + process image */}
          <section className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg md:text-2xl font-black text-slate-900">
                Here's What Happens Next
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                Answer a few quick questions. If your clinic is a fit, pick a
                time, we review your clinic before the call, and you leave with
                clear next steps.
              </p>
            </div>
            <div className="mt-6 md:mt-8 mx-auto" style={{ maxWidth: "1050px" }}>
              <div
                className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200/60 bg-white"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={processImg.url}
                  alt="Three-step Clinic Growth Strategy Call process: book the call, audit the clinic and receive a growth roadmap."
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </section>

          {/* 13-14. Final CTA */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-lg p-6 md:p-10 text-center max-w-4xl mx-auto w-full">
            <Calendar className="mx-auto size-10 text-amber-300" />
            <h2 className="mt-4 text-xl md:text-3xl font-black leading-tight">
              See If Your Clinic Qualifies
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-200 max-w-xl mx-auto">
              Answer a few quick questions. If it's a fit, you'll pick a time
              to discuss your clinic, goals and challenges with Farhan Ali.
            </p>

            <div className="mt-6 flex justify-center">
              <PrimaryCta />
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={goToDownsell}
                className="text-sm md:text-base text-slate-300 hover:text-white underline underline-offset-4"
              >
                {fromMembers
                  ? "No Thanks, Take Me Back to the Members Area"
                  : "No Thanks, Take Me to the Masterclass Confirmation Page"}
              </button>
            </div>
          </section>

          {/* 15. Reassurance */}
          {!fromMembers && (
          <p className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            The strategy call is completely optional. Your Clinic Growth
            Masterclass registration is already submitted.
          </p>
          )}
          </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
