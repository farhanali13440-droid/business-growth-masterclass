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
  XCircle,
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
      { title: "Optional — Get Help Implementing the Business Growth Masterclass" },
      {
        name: "description",
        content:
          "Optional: book a call to see if your business qualifies for done-for-you implementation of the Business Growth Masterclass system.",
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
        // Not a fit for done-for-you → Mini MBA downsell.
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

  /** "No thanks" → Mini MBA downsell before the confirmation page. */
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

  const BookCta = ({ label = "Book a Call With Us", dark = false }: { label?: string; dark?: boolean }) => (
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
      {fromMembers ? "No thanks, back to the members area" : "No thanks, I'll implement it myself"}
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
              <ClipboardList className="size-4" /> Implementation Call Application
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
                {fromMembers ? "Skip — back to the members area" : "Skip — I'll implement it myself"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- QUALIFIED → CALENDLY ---------------- */
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
                Great News — Your Business Qualifies For a Call
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                Based on your answers, your business is a good fit for our done-for-you
                implementation. Pick a time below to speak with Farhan Ali.
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
              <h2 className="text-lg md:text-xl font-black text-slate-900">How to Get the Most From Your Call</h2>
              <ul className="mt-4 grid gap-3">
                {[
                  "Pick the earliest time that works for you — slots fill up quickly.",
                  "Keep WhatsApp handy: our team will message you to confirm your call.",
                  "We review your business before the call, so we can spend the time on your plan — not on basic questions.",
                  "Join from a quiet place where you can talk openly about your goals and numbers.",
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
                className="text-sm md:text-base text-slate-600 hover:text-slate-900 underline underline-offset-4"
              >
                {fromMembers ? "Back to the members area" : "Continue to my confirmation page"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- TEXT SALES LETTER ---------------- */
  const P = ({ children }: { children: React.ReactNode }) => (
    <p className="text-base md:text-lg text-slate-800 leading-relaxed">{children}</p>
  );

  const doneForYou = [
    "Google Business Profile set up and optimised so people in your city find you first",
    "Meta Ads (Facebook & Instagram) that bring real local buyers",
    "Offers and ad creatives built for your business",
    "Social media content that builds trust",
    "WhatsApp follow-up and automation so no inquiry is forgotten",
    "A landing page or website that turns visitors into inquiries",
  ];

  const fitPoints = [
    "You own or run the business and make the growth decisions",
    "You'd rather have an expert team implement this than do it all yourself",
    "You're ready to invest in a monthly team and an ad budget",
    "You want to start within the next 30 days",
  ];

  const notFitPoints = [
    "You'd rather learn it and do it all yourself",
    "You don't make the decisions in the business",
    "You're just exploring and not ready to start yet",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {adminMode && <AdminPreviewBadge />}
      <Topbar />

      <main className="bg-secondary flex-1">
        {/* Order confirmed bar */}
        {!fromMembers && (
          <div className="bg-emerald-600 text-white">
            <div className="mx-auto max-w-3xl px-4 py-2.5 flex items-center justify-center gap-2 text-center text-xs md:text-sm font-bold">
              <PartyPopper className="size-4 shrink-0" />
              Your Business Growth Masterclass order has been received. Read this before you continue.
            </div>
          </div>
        )}

        <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
          <div className="bg-card rounded-2xl border shadow-sm px-5 py-8 md:px-12 md:py-12">
            {/* Headline */}
            <div className="text-center">
              <span className="inline-block text-[11px] md:text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                Optional Next Step
              </span>
              <h1 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-slate-900">
                Congratulations! Now, Do You Want Us To{" "}
                <span className="gradient-highlight">Implement It For You?</span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600">
                Why most business owners never use what they learn — and the shortcut if you'd
                rather have it done for you.
              </p>
            </div>

            <div className="mt-10 space-y-5">
              <P>Congratulations — you just made a smart decision for your business.</P>
              <P>
                Inside the Business Growth Masterclass you'll learn the complete system: how to get
                found on Google, run Meta Ads that bring real buyers, use AI for your content, and
                turn WhatsApp inquiries into paying clients.
              </P>
              <P>But I want to be honest with you about something.</P>
              <P>
                <span className="font-bold">
                  Learning the system and getting it implemented are two very different things.
                </span>
              </P>
              <P>
                Most business owners watch the training, get excited… and then Monday comes. Staff
                problems. Clients. Suppliers. Payments. Family. By the time you sit down to set up
                your ads or fix your Google profile, it's 11 PM and you're tired.
              </P>
              <P>
                Weeks pass. The checklists stay unticked. And the business stays exactly where it
                is — while a competitor down the road, who isn't even better than you, keeps getting
                the clients that should have been yours.
              </P>
              <P>
                <span className="font-bold">It's not your fault.</span> You're a business owner, not
                a full-time marketer. Your job is to run the business and serve your clients.
              </P>

              <h2 className="pt-4 text-xl md:text-2xl font-black text-slate-900">
                Think About It This Way…
              </h2>
              <P>
                You know how to do a lot of things yourself. But you still hire an accountant for
                your taxes and an architect for your building — not because you couldn't learn, but
                because your time is worth more spent on your business.
              </P>
              <P>
                Marketing is the same. The masterclass gives you the knowledge.{" "}
                <span className="font-bold">
                  If you'd rather have it done properly and quickly, our team can build and run the
                  whole system for you.
                </span>
              </P>

              <h2 className="pt-4 text-xl md:text-2xl font-black text-slate-900">
                What Our Team Can Do For Your Business
              </h2>
              <ul className="grid gap-3">
                {doneForYou.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <span className="text-base md:text-lg text-slate-800 leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
              <P>
                This is the same system we've used for years to get clients for local businesses
                across Pakistan — now applied to your business, by our team.
              </P>

              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8 text-center">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  Want Help With Implementation? Book a Call With Us.
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-700">
                  On the call we'll look at your business, your current marketing, and the fastest
                  way to start getting consistent clients. If we're a fit, we'll show you exactly
                  how we'd do it.
                </p>
                <div className="mt-6">
                  <BookCta />
                </div>
              </div>

              <h2 className="pt-4 text-xl md:text-2xl font-black text-slate-900">
                Why We Ask a Few Questions First
              </h2>
              <P>
                We only take on a limited number of businesses at a time, so every client gets
                proper attention. The questions help us make sure we can genuinely help you before
                we book a call.
              </P>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl border bg-emerald-50/60 border-emerald-200 p-5">
                  <h3 className="font-black text-slate-900">This call is for you if:</h3>
                  <ul className="mt-3 grid gap-2.5">
                    {fitPoints.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                        <span className="text-sm md:text-base text-slate-800 leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border bg-slate-50 p-5">
                  <h3 className="font-black text-slate-900">It's probably not for you (yet) if:</h3>
                  <ul className="mt-3 grid gap-2.5">
                    {notFitPoints.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <XCircle className="mt-0.5 size-5 shrink-0 text-slate-400" />
                        <span className="text-sm md:text-base text-slate-700 leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <P>
                Not a fit right now? No problem — after the questions we'll show you the best
                do-it-yourself path for your business instead.
              </P>

              <h2 className="pt-4 text-xl md:text-2xl font-black text-slate-900">
                Here's What Happens Next
              </h2>
              <ol className="grid gap-3">
                {[
                  "Click the button and answer a few quick questions.",
                  "If your business is a fit, pick a time that suits you.",
                  "We review your business before the call.",
                  "On the call, you get a clear plan — and if it makes sense, we implement it for you.",
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
                Either way, you already have the masterclass. This is simply the shortcut if you'd
                rather not do it all yourself.
              </P>
              <P>
                Talk soon,
                <br />
                <span className="font-black">Farhan Ali</span>
              </P>
            </div>
          </div>

          {/* Final CTA */}
          <section className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-lg p-6 md:p-10 text-center">
            <Calendar className="mx-auto size-10 text-amber-300" />
            <h2 className="mt-4 text-xl md:text-3xl font-black leading-tight">
              Want Help With Implementation?
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-200 max-w-xl mx-auto">
              Book a call with us. Answer a few quick questions, and if it's a fit, pick a time to
              speak with Farhan Ali.
            </p>
            <div className="mt-6">
              <BookCta dark />
            </div>
            <div className="mt-5">
              <SkipLink dark />
            </div>
          </section>

          {!fromMembers && (
            <p className="mt-6 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
              This call is completely optional. Your Business Growth Masterclass order has already
              been received.
            </p>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
