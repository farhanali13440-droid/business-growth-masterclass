import { createFileRoute, useNavigate } from "@tanstack/react-router";
import drManalFatimahReview from "@/assets/dr-manal-fatimah-review.jpeg.asset.json";
import drJasimReview from "@/assets/dr-jasim-mumtaz-review.jpeg.asset.json";
import drMehwishReview from "@/assets/dr-mehwish-rasheed-review.jpeg.asset.json";
import { useEffect, useState } from "react";
import { fbqTrack } from "@/lib/fbpixel";
import { Topbar } from "@/components/site/Topbar";
import { Footer } from "@/components/site/Footer";
import { CtaButton } from "@/components/site/CtaButton";
import { OfferPopup } from "@/components/site/OfferPopup";
import { ProofGallery, BUSINESS_PROOFS } from "@/components/site/ProofGallery";
import {
  ShieldCheck, CheckCircle2, Lock, BadgeCheck,
  Users, TrendingUp, Gift, Play, ChevronDown, ArrowRight, CreditCard, PlayCircle,
} from "lucide-react";
import farhanInstructor from "@/assets/farhan-instructor.jpeg.asset.json";
import vslVideo from "@/assets/vsl-cgm.mp4.asset.json";
import vslPoster from "@/assets/vsl-cgm-poster.jpg.asset.json";
import { MasterclassCountdown } from "@/components/site/MasterclassCountdown";
import { VslPlayer, logVsl, getVslMaxPct } from "@/components/site/VslPlayer";
import {
  IsThisForYouSection,
  WhatYoullLeaveWithSection,
  NotTechnicalSection,
  BudgetSection,
  CredibilitySection,
  LiveReplayAccessSection,
  NotGenericSection,
} from "@/components/site/ObjectionSections";

/**
 * The current VSL video was recorded for the previous (healthcare) offer.
 * Until a Business Growth Masterclass VSL is uploaded, the hero shows the
 * product visual instead. Upload the new video, point vslVideo / vslPoster at
 * it, then set this to true.
 */
const SHOW_VSL = false;

const PRODUCT_STACK_IMG = "/bgm-product-stack.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Business Growth Masterclass — Get Consistent Clients With AI & Digital Marketing" },
      { name: "description", content: "Masterclass by Farhan Ali for Pakistani local business owners. Learn to get consistent clients yourself using AI, Google, Meta Ads and WhatsApp — without hiring an agency. Only Rs. 999." },
      { property: "og:title", content: "Business Growth Masterclass — Farhan Ali" },
      { property: "og:description", content: "How local business owners in Pakistan are using AI and simple digital marketing to get consistent clients — without hiring an agency." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  useEffect(() => {
    fbqTrack("ViewContent", {
      content_name: "Business Growth Masterclass",
      content_category: "Masterclass",
      value: 999,
      currency: "PKR",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Hero />
      <SocialProofBar />

      <WhatIsItSection />
      <IsThisForYouSection />
      <WhatsIncludedSection />
      <BonusesSection />
      <NotTechnicalSection />
      <BudgetSection />
      <HowItWorks />
      <NotGenericSection />
      <ProofGallery
        proofs={BUSINESS_PROOFS}
        subtitle="Feedback, payment proofs and real responses from people who joined Farhan's masterclass."
      />
      <CredibilitySection />
      <WhoFor />
      <LiveReplayAccessSection />
      <TrainerSection />
      <WhatYoullLeaveWithSection />

      <GuaranteeSection />
      <FAQSection />
      <FinalCta />
      <Footer />
      <OfferPopup />
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section className="hero-bg text-white">
      <div className="mx-auto max-w-[380px] sm:max-w-2xl md:max-w-7xl px-3 sm:px-4 pt-4 pb-8 md:pt-10 md:pb-16">
        {/* Trust badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md pl-1.5 pr-3 py-1 sm:pl-2 sm:pr-5 sm:py-2 shadow-sm">
            <span className="flex items-center justify-center size-5 sm:size-7 rounded-full bg-yellow-300/20 ring-1 ring-yellow-300/40 shrink-0">
              <BadgeCheck className="size-3 sm:size-4 text-yellow-300" />
            </span>
            <span className="text-[10px] sm:text-sm font-semibold tracking-wide text-white/95 leading-snug text-center">
              For Pakistani Service-Based Local Business Owners
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-4 md:mt-8 text-center text-[22px] leading-[1.15] sm:text-3xl md:text-5xl lg:text-6xl font-black md:leading-[1.05] uppercase">
          Discover How Service-Based Business Owners Are Using{" "}
          <span className="gradient-highlight">AI &amp; Simple Digital Marketing</span>{" "}
          To Get{" "}
          <span className="gradient-highlight">Consistent Clients</span>{" "}
          Every Week — Without Hiring An Agency!
        </h1>
        <p className="mt-3 md:mt-6 text-center max-w-3xl mx-auto text-sm md:text-xl text-white/85 leading-snug">
          Even if you've tried ads before and only got "price?" messages that never turned into paying clients.
        </p>

        {/* Two column: Video/visual + Order card */}
        <div className="mt-5 md:mt-10 grid md:grid-cols-5 gap-5 md:gap-6 items-start">
          <div className="md:col-span-3">
            <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
              {SHOW_VSL ? (
                <div className="relative bg-black" style={{ paddingTop: "56.25%" }}>
                  <VslPlayer
                    src={vslVideo.url}
                    poster={vslPoster.url}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src="/bgm-hero-before-after.webp"
                  alt="A worried business owner in an empty office, and the same owner busy with clients after getting his marketing right"
                  className="w-full h-auto block"
                />
              )}
            </div>

            <div className="mt-4 md:mt-6">
              <MasterclassCountdown variant="dark" className="mb-3 md:mb-4" />
              <CtaButton subtitle="Enroll for just 999 PKR">
                YES! I Want My Client-Getting System
              </CtaButton>
              <div className="mt-3 text-center text-[11px] md:text-xs font-bold text-yellow-300 uppercase tracking-wider">
                ✅ Instant, Lifetime Access — Watch At Your Own Pace
              </div>
            </div>

            <TopTestimonials />
          </div>

          {/* Order summary card */}
          <aside className="md:col-span-2 bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-3 border-b">
              <img
                src={PRODUCT_STACK_IMG}
                alt="Business Growth Masterclass product stack"
                className="w-full h-auto"
              />
            </div>
            <div className="p-6 text-center">
              <div className="text-lg font-extrabold">TODAY'S SPECIAL PRICE</div>
              <div className="mt-2 text-3xl font-black text-destructive">
                ONLY <span>Rs. 999</span>
              </div>

              <p className="mt-4 text-sm">
                Get the complete <span className="font-bold">Business Growth Masterclass</span> + checklists,
                cheat sheets &amp; SOPs for just <span className="font-bold">Rs. 999</span>.
              </p>

              <div className="mt-3 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                ✅ Lifetime Access
              </div>
              <p className="mt-2 text-xs text-slate-600 max-w-xs mx-auto">
                Watch anytime, on your phone or laptop, as many times as you want.
              </p>

              <InlineLeadForm />

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> 100% Secure Checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function InlineLeadForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      id="lead-form"
      className="mt-5 space-y-3 text-left scroll-mt-24"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);

        const fullName = name.trim();
        const emailNorm = email.trim().toLowerCase();
        const wa = whatsapp.trim();
        const spec = specialty.trim();

        if (fullName.length < 2) {
          setError("Please enter your full name.");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
          setError("Please enter a valid email address.");
          return;
        }
        const digits = wa.replace(/\D/g, "");
        if (digits.length < 10) {
          setError("Please enter a valid WhatsApp number (e.g. 03XX XXXXXXX).");
          return;
        }
        if (!spec) {
          setError("Please enter your type of business.");
          return;
        }

        setSubmitting(true);

        // Fire pixel immediately so it isn't blocked by the network round trip.
        try {
          fbqTrack("Lead", {
            content_name: "Business Growth Masterclass — Step 1 Opt-In",
            value: 0,
            currency: "PKR",
            vsl_percent_watched: getVslMaxPct(),
          });
        } catch {}
        logVsl("optin");

        // Save lead in the background — do NOT block navigation on the server function.
        // The business type is stored in the existing `specialty` column.
        void (async () => {
          try {
            const { upsertLead } = await import("@/lib/leads.functions");
            await upsertLead({
              data: {
                full_name: fullName,
                email: emailNorm,
                whatsapp: wa,
                specialty: spec,
                lead_status: "Opted In - Checkout Not Completed",
              },
            });
          } catch (err) {
            console.error("Background lead upsert failed", err);
          }
        })();

        const params = new URLSearchParams();
        params.set("full_name", fullName);
        params.set("email", emailNorm);
        params.set("whatsapp", wa);
        params.set("specialty", spec);
        navigate({ to: "/order", search: Object.fromEntries(params) });
      }}
    >
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name*"
        autoComplete="name"
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email*"
        autoComplete="email"
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="tel"
        inputMode="tel"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        placeholder="WhatsApp Number* (e.g. 03XX XXXXXXX)"
        autoComplete="tel"
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="text"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        placeholder="Your Business* (e.g. Real Estate, Restaurant)"
        maxLength={120}
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="btn-cta w-full px-4 py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span>{submitting ? "SAVING..." : "GO TO STEP #2"}</span>
          <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
        </span>
        <div className="text-xs font-medium normal-case tracking-normal opacity-95">
          Get Instant Access Now
        </div>
      </button>
      <p className="text-[11px] text-center text-muted-foreground">
        Your details are saved securely. Payment is on the next step.
      </p>
    </form>
  );
}

/* ---------------- TESTIMONIALS (from Farhan's previous masterclass) ---------------- */

function ReviewCard() {
  const reviews = [
    { img: drManalFatimahReview.url, place: "Lahore, Pakistan" },
    { img: drJasimReview.url, place: "Peshawar" },
    { img: drMehwishReview.url, place: "Pakistan" },
  ];
  return (
    <>
      {reviews.map((r, i) => (
        <div key={r.img} className={`${i === 0 ? "mt-6" : "mt-5"} rounded-lg bg-white/5 ring-1 ring-white/10 p-3 sm:p-4 text-white/95`}>
          <img
            src={r.img}
            alt="WhatsApp review screenshot about Farhan Ali's masterclass"
            className="w-full h-auto rounded-md ring-1 ring-white/10 shadow-md object-contain"
            loading="lazy"
          />
          <div className="mt-3 px-1">
            <p className="font-bold leading-tight">- Masterclass Student</p>
            <p className="text-xs sm:text-sm text-white/80 leading-snug">{r.place}</p>
          </div>
        </div>
      ))}
      <div className="mt-7 mb-2 max-w-md mx-auto">
        <CtaButton>YES! I WANT TO ENROLL NOW</CtaButton>
      </div>
    </>
  );
}

function TopTestimonials() {
  return (
    <div className="mt-6 md:mt-8">
      <div className="text-center mb-5 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          What People Say About <span className="text-yellow-400">Farhan's Training</span>
        </h2>
        <p className="mt-2 text-white/70 text-sm md:text-base">
          Real feedback from business owners who attended Farhan's masterclass.
        </p>
      </div>
      <ReviewCard />
    </div>
  );
}

/* ---------------- SOCIAL PROOF BAR ---------------- */

function SocialProofBar() {
  return (
    <section className="bg-white py-10 border-b">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold mb-8">Farhan Has Built Client-Getting Systems For Businesses Like</h2>
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="marquee-track" aria-hidden={dup === 1}>
              {[
                "The Diabetes Centre",
                "Diabetics Pakistan",
                "Sara Dietitian",
                "Emaan Gynecology Centre",
                "Kulsoom International Hospital",
                "Naqaish Hospital I-8",
              ].map((n) => (
                <div key={n} className="font-bold tracking-widest uppercase text-sm md:text-base text-muted-foreground whitespace-nowrap flex items-center">
                  {n}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHAT IS IT ---------------- */

function WhatIsItSection() {
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl md:text-5xl font-black text-center">
          What is the <br className="md:hidden" />
          <span className="gradient-highlight">Business Growth Masterclass?</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed">
          The Business Growth Masterclass is the fastest way for a local business owner to build a
          simple, predictable client-getting system — and run it yourself, with the help of AI.
          <br /><br />
          Without spending months on YouTube tutorials, paying an agency every month, or
          gambling money on ads that only bring "price?" messages.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          Because let's be honest — you already know digital marketing works.&nbsp;
          <br /><br />
          You've seen competitors in your city getting busy from Facebook, Instagram and Google.
          You've probably boosted a post or run an ad or two yourself…
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <span className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded-md ring-2 ring-red-700/40 shadow-sm">
            But the part nobody teaches you? What to actually do.
          </span>
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          What should your offer be… your ad… your Google profile… and what do you say on WhatsApp so the
          inquiry actually becomes a paying client?
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <span className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded-md ring-2 ring-red-700/40 shadow-sm">
            The Business Growth Masterclass flips the script.
          </span>
          <br /><br />
          I've taken out the guesswork so you can follow one clear system, use AI to do the heavy
          lifting, and become the go-to business in your city and your niche.
        </p>

        <CurriculumAccordion />

        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Business Growth Masterclass — Rs. 999">YES! Give Me Access Now</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHAT'S INCLUDED (core product stack) ---------------- */

function WhatsIncludedSection() {
  const items: { title: string; desc: string; value: string }[] = [
    { title: "The Complete Business Growth Masterclass", desc: "All 6 modules — the full client-getting system, step by step. Lifetime access.", value: "Rs. 15,000" },
    { title: "Implementation Checklists", desc: "Tick-box checklists for every module so you know exactly what to do next — nothing gets missed.", value: "Rs. 5,000" },
    { title: "Digital Marketing Cheat Sheets", desc: "One-page quick guides for Google Business Profile, Meta Ads and AI content — keep them open while you work.", value: "Rs. 5,000" },
    { title: "Step-by-Step SOPs", desc: "Standard operating procedures you can follow yourself or hand to a staff member to run every week.", value: "Rs. 7,000" },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          Here's Everything You Get <span className="gradient-highlight">Today</span>
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Not just a video — the tools to implement it fast.
        </p>
        <div className="mt-10 grid md:grid-cols-[1fr_1.2fr] gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-border bg-white">
            <img
              src={PRODUCT_STACK_IMG}
              alt="Business Growth Masterclass product stack"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.title} className="flex items-start gap-3 rounded-xl bg-card border p-4 shadow-sm">
                <CheckCircle2 className="size-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-extrabold">{it.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{it.desc}</div>
                  <div className="mt-1.5 text-xs font-bold text-primary">Value: {it.value}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-center text-lg font-semibold">
          Total Value: <span className="line-through">Rs. 32,000</span> —{" "}
          <span className="text-destructive">yours today for just Rs. 999.</span>
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <CtaButton subtitle="Instant Access — Only Rs. 999">YES! I Want Everything</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BONUSES ---------------- */

function BonusesSection() {
  const bonuses: { tag: string; title: string; copy: string; value: string; image: string }[] = [
    {
      tag: "Fast Start Bonus #1",
      title: "Google Business Profile Ranking Checklist",
      copy: "The exact checklist to set up and optimize your Google profile so people searching in your city find YOU first.",
      value: "Rs. 8,000",
      image: "/bonus-1-gbp-ranking-checklist.webp",
    },
    {
      tag: "Fast Start Bonus #2",
      title: "WhatsApp Inquiry-to-Client SOP",
      copy: "Step-by-step replies and follow-ups that turn \"price?\" messages into paying clients — no more ghosting.",
      value: "Rs. 10,000",
      image: "/bonus-2-whatsapp-sop.webp",
    },
    {
      tag: "Fast Start Bonus #3",
      title: "Meta Ads Launch Cheat Sheet",
      copy: "A one-page guide to set up your first local Facebook & Instagram ad the right way — targeting, budget and creative.",
      value: "Rs. 8,000",
      image: "/bonus-3-meta-ads-cheat-sheet.webp",
    },
    {
      tag: "Fast Start Bonus #4",
      title: "30-Day Business Growth Action Plan",
      copy: "A day-by-day checklist so you implement the masterclass in 30 days instead of \"someday\".",
      value: "Rs. 7,000",
      image: "/bonus-4-30-day-action-plan.webp",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          You Also Unlock Instant Access To<br />
          <span className="gradient-highlight">4 Fast Start Bonuses!</span>
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {bonuses.map((b) => (
            <div key={b.title} className="rounded-2xl border bg-card overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-secondary">
                <img src={b.image} alt={b.title} className="w-full h-auto block" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Gift className="size-4" /> {b.tag}
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-extrabold">{b.title}</h3>
                <p className="mt-3 text-muted-foreground">{b.copy}</p>
                <div className="mt-4 inline-block bg-accent text-accent-foreground font-bold px-3 py-1 rounded">
                  Value: {b.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-semibold">
          Total Bonus Value: <span className="line-through">Rs. 33,000</span> —{" "}
          <span className="text-destructive">included FREE today.</span>
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Masterclass + All 4 Bonuses For Rs. 999">YES! I Want The Bonuses</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    { icon: CreditCard, title: "Step 1 — Get Access", text: "Enroll for Rs. 999 and get instant, lifetime access to the masterclass and all resources." },
    { icon: PlayCircle, title: "Step 2 — Watch & Implement", text: "Watch at your own pace and follow the checklists, cheat sheets and SOPs — with AI doing the heavy lifting." },
    { icon: TrendingUp, title: "Step 3 — Get Consistent Clients", text: "Turn your Google profile, ads and WhatsApp into a system that brings clients every week." },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          How Does The <span className="gradient-highlight">Business Growth Masterclass</span> Work?
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          A predictable client-getting system mapped out for you in just 3 steps…
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl bg-card border p-8 text-center shadow-sm">
              <div className="mx-auto size-14 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <s.icon className="size-7" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHO FOR ---------------- */

function WhoFor() {
  const list = [
    "Real estate agents & agencies",
    "Interior designers",
    "Construction companies & contractors",
    "Restaurants, cafés & food chains",
    "Car showrooms & dealers",
    "Barbers & grooming studios",
    "Tailors & boutiques",
    "Gyms & fitness studios",
    "Any local service business",
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          Who's This <span className="gradient-highlight">Perfect For?</span>
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {list.map((l) => (
            <div key={l} className="flex items-center gap-3 rounded-lg bg-card border p-4">
              <Users className="size-5 text-primary shrink-0" />
              <span className="font-semibold">{l}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-base md:text-lg font-semibold max-w-3xl mx-auto">
          Especially if you've tried digital marketing before and it didn't bring clients — or you
          don't have a proper Google, Facebook or Instagram presence yet.
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle="Only Rs. 999 — Instant Access">Enroll Now</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRAINER ---------------- */

function TrainerSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
          <img
            src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/gEjfcPU9sJhDOS0NobUy/media/b28682be-8ac2-41b4-9a64-ad8c57ac0bb7.jpeg"
            alt="Farhan Ali — Digital Marketing Expert"
            className="w-full h-auto"
          />
        </div>
        <div>
          <p className="uppercase tracking-widest text-primary font-bold text-sm">Meet Your Trainer</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-black">Farhan Ali</h2>
          <p className="mt-2 text-lg font-semibold text-muted-foreground">
            Digital Marketing Expert &amp; Founder of Self Marketer AI
          </p>
          <p className="mt-4 leading-relaxed">
            For 3+ years, Farhan has built client-acquisition systems for local businesses in Pakistan —
            in industries where trust is everything and every client is hard won.
          </p>
          <p className="mt-3 leading-relaxed">The same system works for any local service business:</p>
          <ul className="mt-3 grid grid-cols-1 gap-y-2">
            {[
              "Get found on Google in your city",
              "Run Meta Ads that bring real buyers",
              "Turn WhatsApp inquiries into paying clients",
              "Use AI to create content and ads in minutes",
            ].map((s) => (
              <li key={s} className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary shrink-0" />{s}</li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed">
            In the Business Growth Masterclass he shows you how to run this system yourself — without
            hiring an agency and without wasting money on random tactics.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- GUARANTEE ---------------- */

function GuaranteeSection() {
  const accessPoints: { title: string; desc: string }[] = [
    { title: "Local Business Domination System", desc: "Become the first business people find in your city." },
    { title: "Business Brand & Trust Blueprint", desc: "Stand out from competitors and build trust online." },
    { title: "2-Hour AI Content System", desc: "Create weeks of content in one sitting with AI." },
    { title: "Client Acquisition With Meta Ads", desc: "Ads that bring buyers, not just \"price?\" messages." },
    { title: "Irresistible Offer Framework", desc: "Offers people respond to — without heavy discounts." },
    { title: "Client Acquisition Machine", desc: "Turn inquiries into paying, repeat clients on WhatsApp." },
  ];

  const reassurance = [
    "No complicated forms.",
    "No awkward questioning.",
    "No unnecessary back-and-forth.",
    "You can keep the training resources and bonuses.",
  ];
  return (
    <section className="py-12 md:py-20 bg-hero-deep">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 bg-[#FFF8E7]">
          <div
            className="relative px-5 py-8 md:px-10 md:py-10 text-center text-white"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--cta-from), oklch(0.62 0.24 25))",
            }}
          >
            <div className="mx-auto mb-4 size-16 md:size-20 rounded-full bg-white/15 ring-4 ring-white/30 grid place-items-center backdrop-blur-sm">
              <ShieldCheck className="size-9 md:size-11" />
            </div>
            <p className="uppercase tracking-widest text-xs md:text-sm font-bold opacity-95">
              7-Day Money-Back Guarantee
            </p>
            <h2 className="mt-2 text-2xl md:text-4xl font-black leading-tight">
              The Best Money-Back Guarantee for Business Owners Who Want More Clients
            </h2>
          </div>

          <div className="px-5 py-8 md:px-10 md:py-12 text-foreground">
            <div className="space-y-4 text-base md:text-lg leading-relaxed">
              <p>Before you buy any training, you deserve to know exactly what you are getting.</p>
              <p>And more importantly…</p>
              <p className="font-bold">You deserve to know that your money is protected.</p>
              <p>I want you to feel completely comfortable joining the Business Growth Masterclass.</p>
              <p>Even though the investment is only <span className="font-bold">PKR 999</span>.</p>
              <p>
                Because this is not another motivational video where you take notes but have no clear
                action plan.
              </p>
            </div>

            <h3 className="mt-10 text-xl md:text-2xl font-black">Here Is What You Will Learn Inside the Business Growth Masterclass:</h3>
            <ul className="mt-5 space-y-2.5">
              {accessPoints.map((p) => (
                <li key={p.title} className="flex items-start gap-2.5 rounded-lg bg-white/60 border border-emerald-100 px-3 py-2">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base leading-snug">
                    <span className="font-bold">{p.title}</span>
                    <span className="text-slate-700"> — {p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4 text-base md:text-lg leading-relaxed">
              <p>Watch the training.</p>
              <p>Apply the strategies.</p>
              <p>Choose at least one action step for your business.</p>
              <p className="font-bold">Then make up your own mind.</p>
              <p>
                If you genuinely feel that the masterclass did not give you practical, useful ideas to
                help you get more clients and grow your business…
              </p>
              <p>
                Simply message us within <span className="font-bold">7 days</span> of joining and ask for
                a refund.
              </p>
              <p className="font-bold text-emerald-700">We will return your PKR 999.</p>
            </div>

            <div className="mt-8 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-50 p-5 md:p-6">
              <ul className="space-y-2.5">
                {reassurance.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-1" />
                    <span className="font-semibold">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 text-center text-base md:text-lg italic text-muted-foreground">
              That is how confident we are that this masterclass can help you build your own
              client-getting system — without depending on an agency.
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <CtaButton subtitle="Only Rs. 999 — Instant Lifetime Access">
                Join Business Growth Masterclass Risk-Free
              </CtaButton>
              <p className="mt-3 text-center text-xs md:text-sm text-muted-foreground font-medium">
                7-Day Money-Back Guarantee • Secure Payment • Lifetime Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQSection() {
  const faqs = [
    {
      q: "1. How will I access the masterclass?",
      a: "After you complete your payment, you get access to the masterclass and all checklists, cheat sheets and SOPs. Watch on your phone or laptop, anytime.",
    },
    {
      q: "2. How long will I have access?",
      a: "Lifetime. Watch at your own pace and come back to any part whenever you need it.",
    },
    {
      q: "3. Do I need any marketing or technical experience?",
      a: "Not at all. Everything is explained in simple language, step by step, for busy business owners. AI does most of the heavy lifting for you.",
    },
    {
      q: "4. Will this work for my type of business?",
      a: "If you run a local service business — real estate, interior design, construction, restaurant, barber, tailor, gym or similar — yes. You'll see how to apply the system to your own business and city.",
    },
    {
      q: "5. I already tried ads and they didn't work. Why would this be different?",
      a: "Most ads fail because of what happens before and after the ad — the offer, the trust, and the WhatsApp follow-up. The masterclass shows you the complete system, not just how to boost a post.",
    },
    {
      q: "6. Do I need a big ad budget?",
      a: "No. You'll learn how to start with a small local budget — and some strategies, like Google Business Profile, cost nothing.",
    },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">FAQs</h2>
        <p className="text-center text-muted-foreground mt-2">
          Answers to common questions about the Business Growth Masterclass.
        </p>
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-lg border bg-card p-5">
              <summary className="cursor-pointer list-none font-bold text-lg flex justify-between items-center">
                {f.q}
                <span className="ml-4 text-primary group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground whitespace-pre-line">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCta() {
  return (
    <section className="hero-bg text-white py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="uppercase tracking-widest text-yellow-300 font-bold">Limited-Time Price</p>
        <h2 className="mt-2 text-2xl md:text-5xl font-black">
          Start building your client-getting system today.
        </h2>
        <p className="mt-4 text-lg text-white/85">
          Get the Business Growth Masterclass, checklists, cheat sheets &amp; SOPs for just{" "}
          <span className="font-bold">Rs. 999</span>.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <MasterclassCountdown variant="dark" className="mb-6" />
          <CtaButton subtitle="Enroll Now — Only Rs. 999">YES! Give Me Access</CtaButton>
          <p className="mt-4 text-sm text-white/85">
            <span className="font-bold text-yellow-300">✅ Instant, Lifetime Access</span>
            <br />
            <span className="text-white/70">Watch at your own pace, as many times as you want.</span>
          </p>
        </div>

        <p className="mt-6 text-sm text-white/70">
          Questions? Email{" "}
          <a className="underline" href="mailto:Farhanali13440@gmail.com">Farhanali13440@gmail.com</a>{" "}
          or call <a className="underline" href="tel:+923390057379">+92 339 0057379</a>
        </p>
      </div>
    </section>
  );
}

/* ---------------- CURRICULUM ACCORDION ---------------- */

function CurriculumAccordion() {
  const modules = [
    {
      label: "MODULE #1",
      title: "Local Business Domination System",
      desc: "Make your business the obvious choice in your city using Google Business Profile (GMB), reviews and local trust signals.",
      duration: "Module 01",
      intro: "Become the first business people see when they search for your service in your city.",
      points: [
        "Google Business Profile setup & optimization",
        "Getting reviews that make people choose you",
        "Local visibility that keeps growing every week",
      ],
    },
    {
      label: "MODULE #2",
      title: "Business Brand & Trust Blueprint",
      desc: "Build a brand people trust online, stand out from competitors and stop competing on price.",
      duration: "Module 02",
      intro: "Make people trust your business before they ever message you.",
      points: [
        "Stand out from every competitor in your area",
        "The proof and content that builds trust fast",
        "Position yourself so price stops being the first question",
      ],
    },
    {
      label: "MODULE #3",
      title: "2-Hour AI Content System",
      desc: "Create weeks of posts, reels and captions in one sitting using AI and simple content frameworks.",
      duration: "Module 03",
      intro: "Stop staring at a blank screen. Let AI help you batch a month of content.",
      points: [
        "Content ideas from the questions your clients already ask",
        "AI workflows for posts, reels scripts and captions",
        "Turn 1 idea into 10 pieces of content",
      ],
    },
    {
      label: "MODULE #4",
      title: "Client Acquisition With Meta Ads",
      desc: "Run simple Facebook & Instagram ads that reach local buyers — without wasting money on boosts and random tactics.",
      duration: "Module 04",
      intro: "A predictable client flow from Meta Ads, built for Pakistani local businesses.",
      points: [
        "Ad setup that targets real local buyers",
        "Creatives and copy you can make with AI",
        "Track every rupee back to an inquiry and a sale",
      ],
    },
    {
      label: "MODULE #5",
      title: "Irresistible Offer Framework",
      desc: "Create offers people actually respond to — instead of posting \"services available, DM for price\".",
      duration: "Module 05",
      intro: "The offer structure that gets your phone ringing.",
      points: [
        "The irresistible offer formula for local businesses",
        "Pricing and positioning that doesn't cheapen your brand",
        "Attract clients without constant discounts",
      ],
    },
    {
      label: "MODULE #6",
      title: "Client Acquisition Machine",
      desc: "Connect everything into one system that turns strangers into inquiries, inquiries into paying clients, and clients into repeat business.",
      duration: "Module 06",
      intro: "Put every piece together into a machine that brings clients every week.",
      points: [
        "WhatsApp follow-up that closes inquiries into sales",
        "Simple automation so no lead is forgotten",
        "Repeat business and referrals for long-term growth",
      ],
    },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <div className="inline-block text-xs font-bold tracking-[0.25em] text-primary uppercase">
          Training Curriculum
        </div>
        <h3 className="mt-2 text-2xl md:text-4xl font-black uppercase tracking-tight">
          What You'll Learn Inside The Business Growth Masterclass
        </h3>
      </div>

      <div className="space-y-4">
        {modules.map((m, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={m.title}
              className={`group rounded-2xl border bg-[#0f172a] text-white shadow-lg overflow-hidden transition-all duration-300 hover:border-primary/60 ${
                isOpen ? "border-primary/70 shadow-primary/20" : "border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
              >
                <img
                  src={farhanInstructor.url}
                  alt="Farhan Ali — Instructor"
                  className="size-16 md:size-20 rounded-xl object-cover ring-2 ring-primary/40 shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] md:text-xs font-bold tracking-[0.18em] text-primary uppercase">
                    {m.label}
                  </div>
                  <h4 className="mt-1 text-base md:text-xl font-extrabold leading-tight">
                    {m.title}
                  </h4>
                  <p className="mt-1 text-xs md:text-sm text-white/70 line-clamp-2">
                    {m.desc}
                  </p>
                  <span className="mt-2 inline-block bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-2 py-0.5 rounded">
                    Farhan Ali
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {m.duration}
                  </span>
                  <ChevronDown
                    className={`size-6 text-white/80 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <ChevronDown
                  className={`sm:hidden size-5 text-white/80 transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 md:px-5 pb-5 pt-1 border-t border-white/10">
                    <p className="mt-4 text-sm md:text-base text-white/75">
                      {m.intro}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {m.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm md:text-base">
                          <span className="mt-0.5 size-6 rounded-full bg-primary/20 text-primary grid place-items-center shrink-0 ring-1 ring-primary/40">
                            <Play className="size-3 fill-primary" />
                          </span>
                          <span className="text-white/90">{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="sm:hidden mt-4">
                      <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                        {m.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
