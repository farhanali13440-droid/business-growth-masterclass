import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fbqTrack } from "@/lib/fbpixel";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Gift,
  HeartHandshake,
  Lock,
  PlayCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Users2,
  Wallet,
} from "lucide-react";
import farhanInstructor from "@/assets/farhan-instructor.jpeg.asset.json";
import productStack from "@/assets/doctor-authority-product-stack.png.asset.json";
import drManalReview from "@/assets/dr-manal-fatimah-review.jpeg.asset.json";
import drJasimReview from "@/assets/dr-jasim-mumtaz-review.jpeg.asset.json";
import drMehwishReview from "@/assets/dr-mehwish-rasheed-review.jpeg.asset.json";
import drManalWhatsapp from "@/assets/dr-manal-whatsapp-review.jpeg.asset.json";
import { PROOFS, type Proof } from "@/components/site/ProofGallery";
import { Footer } from "@/components/site/Footer";
import {
  AuthorityCycle,
  BonusCover,
  CrowdVisual,
  MODULE_ICONS,
  StepArt,
} from "@/components/site/AuthorityVisuals";

export const Route = createFileRoute("/authority")({
  head: () => ({
    meta: [
      {
        title:
          "Doctor Local Authority System™ — Become the #1 Doctor for Your Specialty in Your City",
      },
      {
        name: "description",
        content:
          "Build local awareness, trust and patient demand around your name with the Doctor Authority System™.",
      },
      {
        property: "og:title",
        content:
          "Doctor Local Authority System™ — Become the #1 Doctor for Your Specialty in Your City",
      },
      {
        property: "og:description",
        content:
          "A practical digital system for doctors who want to become recognized and remembered for their specialty in their city.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AuthorityPage,
});

const CTA_TEXT = "YES! I WANT TO BECOME THE #1 DOCTOR";
const PRICE = 999;
const CHECKOUT_PATH = "/authority-order";

/** Every CTA scrolls to the opt-in form in the hero. Submitting that form goes to checkout. */
function scrollToLeadForm() {
  const el = document.getElementById("lead-form");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const first = el.querySelector<HTMLInputElement>("input");
  setTimeout(() => first?.focus({ preventScroll: true }), 600);
}

function CTAButton({
  children = CTA_TEXT,
  subtitle = `Get instant access for just Rs. ${PRICE}`,
  className = "",
}: {
  children?: React.ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={scrollToLeadForm}
      className={[
        "btn-cta block w-full px-6 py-4 text-center transition hover:-translate-y-0.5",
        className,
      ].join(" ")}
    >
      <span className="inline-flex items-center justify-center gap-2 text-lg md:text-2xl">
        {children}
        <ArrowRight className="btn-cta-arrow size-5 shrink-0 md:size-6" />
      </span>
      {subtitle && (
        <span className="mt-1 block text-xs font-medium normal-case tracking-normal opacity-95 md:text-sm">
          {subtitle}
        </span>
      )}
    </button>
  );
}

function RedTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-red-600 px-3 py-1 font-bold text-white shadow-sm ring-2 ring-red-700/40">
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <div
          className={`text-xs font-black uppercase tracking-[0.2em] ${dark ? "text-emerald-300" : "text-primary"}`}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={`mt-3 text-3xl font-black tracking-tight md:text-5xl ${dark ? "text-white" : "text-slate-950"}`}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`mt-4 text-base leading-7 md:text-lg ${dark ? "text-white/70" : "text-slate-600"}`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function AuthorityLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
        if (wa.replace(/\D/g, "").length < 10) {
          setError("Please enter a valid WhatsApp number.");
          return;
        }
        if (!spec) {
          setError("Please enter your medical specialty / field of practice.");
          return;
        }

        setSubmitting(true);

        try {
          sessionStorage.setItem(
            "ghl_lead",
            JSON.stringify({ name: fullName, email: emailNorm, phone: wa, specialty: spec }),
          );
        } catch {}

        // Meta Pixel Lead — same event the Clinic Growth Masterclass opt-in sends.
        try {
          fbqTrack("Lead", {
            content_name: "Doctor Local Authority System — Opt-In",
            value: 0,
            currency: "PKR",
          });
        } catch {}

        // Save the opt-in to clinic_growth_leads (shown on /admin/leads1340) BEFORE moving on,
        // so the lead is kept even if they never buy. Capped at 5s so a slow connection never
        // traps the visitor on this page.
        const save = (async () => {
          const { upsertLead } = await import("@/lib/leads.functions");
          await upsertLead({
            data: {
              full_name: fullName,
              email: emailNorm,
              whatsapp: wa,
              specialty: spec,
              lead_status: "Doctor Authority System - New Opt-In",
            },
          });
        })();
        try {
          await Promise.race([save, new Promise((r) => setTimeout(r, 5000))]);
        } catch (err) {
          console.error("Doctor Authority lead save failed", err);
        }

        const params = { full_name: fullName, email: emailNorm, whatsapp: wa, specialty: spec };
        navigate({ to: CHECKOUT_PATH, search: params });
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
        placeholder="Medical Specialty / Field of Practice*"
        maxLength={120}
        className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-cta w-full px-4 py-4 text-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span>{submitting ? "PLEASE WAIT..." : "GO TO STEP #2"}</span>
          <ArrowRight className="size-5" aria-hidden="true" />
        </span>
        <div className="text-xs font-medium normal-case tracking-normal opacity-95">
          Get instant access for Rs. {PRICE}
        </div>
      </button>

      <p className="text-[11px] text-center text-muted-foreground">
        Your details are saved securely. Payment is on the next step.
      </p>
    </form>
  );
}

/* =====================================================================
 * Section order mirrors the Clinic Growth Masterclass page ("/"),
 * which converts well — content rewritten for the Doctor Authority System™.
 * ===================================================================== */

const MODULES = [
  {
    title: "Authority Positioning",
    desc: "Define exactly what you want to be known for in your city — and say it so simply patients remember it.",
    points: [
      "Choose the one position you want to own locally",
      "Turn your specialty into a message patients repeat",
      "Stand apart from every other doctor with the same degree",
    ],
  },
  {
    title: "Local Reach Method",
    desc: "Consistently reach the right people in your city — without depending on luck or the algorithm.",
    points: [
      "Reach people near your clinic who actually need your specialty",
      "Stop wasting effort on followers who will never visit",
      "Build a repeatable way to stay in front of locals",
    ],
  },
  {
    title: "The Visibility Accelerator",
    desc: "Get your name in front of the right local patients faster than posting alone ever could.",
    points: [
      "Speed up how quickly your city notices you",
      "Start small and only scale what works",
      "Make every rupee you spend more intentional",
    ],
  },
  {
    title: "The Trust Bridge",
    desc: "The missing link between someone noticing you and someone choosing you.",
    points: [
      "Turn one-time viewers into a warm local audience",
      "Stay useful without constantly selling",
      "Be the doctor they already trust when they need help",
    ],
  },
  {
    title: "The Authority Content Formula",
    desc: "Know exactly what to share so patients see you as the expert — without hard selling.",
    points: [
      "What to teach, and when to show proof",
      "Content that builds trust, not just likes",
      "Create weeks of content without becoming an influencer",
    ],
  },
  {
    title: "Appointment Conversion Flow",
    desc: "Give interested patients a clear path from familiarity to inquiry and booking.",
    points: [
      "Turn trust into real inquiries",
      "A simple path from first message to booked appointment",
      "Never lose a ready patient to slow follow-up",
    ],
  },
  {
    title: "The Weekly Authority Routine",
    desc: "Put everything together into a simple routine you or your team can run every week.",
    points: [
      "One weekly routine that keeps the system running",
      "What you do yourself vs. what your team can handle",
      "Keep your name growing month after month",
    ],
  },
];

/* ---------------- TOPBAR ---------------- */

function AuthorityTopbar() {
  return (
    <div className="w-full bg-topbar text-xs text-white">
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-2 px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
        <a
          href="/authority"
          className="flex shrink-0 flex-col items-center rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-extrabold leading-tight tracking-widest sm:px-2 sm:py-1 sm:text-sm"
        >
          <span>DOCTOR&nbsp;AUTHORITY</span>
          <span className="text-[8px] font-medium tracking-[0.25em] sm:text-[9px]">SYSTEM™</span>
        </a>
        <div className="flex min-w-0 flex-col items-end gap-0 leading-tight">
          <span className="text-[10px] font-semibold sm:text-xs">Need Help?</span>
          <a
            href="mailto:Farhanali13440@gmail.com"
            className="max-w-[180px] truncate text-[10px] underline sm:max-w-none sm:text-xs"
          >
            Farhanali13440@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section className="hero-bg text-white">
      <div className="mx-auto max-w-[380px] px-3 pb-8 pt-4 sm:max-w-2xl sm:px-4 md:max-w-7xl md:pb-16 md:pt-10">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1.5 pr-3 shadow-sm backdrop-blur-md sm:gap-3 sm:py-2 sm:pl-2 sm:pr-5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow-300/20 ring-1 ring-yellow-300/40 sm:size-7">
              <BadgeCheck className="size-3 text-yellow-300 sm:size-4" />
            </span>
            <span className="text-center text-[10px] font-semibold leading-snug tracking-wide text-white/95 sm:text-sm">
              Built for Doctors, Dentists &amp; Healthcare Practitioners across Pakistan
            </span>
          </div>
        </div>

        <h1 className="mt-4 text-center text-[22px] font-black uppercase leading-[1.15] sm:text-3xl md:mt-8 md:text-5xl md:leading-[1.05] lg:text-6xl">
          Become the <span className="gradient-highlight">#1 Doctor</span> for Your Specialty in{" "}
          <span className="gradient-highlight">Your City</span> in 60 Days or Less!
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-snug text-white/85 md:mt-6 md:text-xl">
          Even if you've tried posting, boosting and "personal branding" before — and patients still
          don't remember your name.
        </p>

        <div className="mt-5 grid items-start gap-5 md:mt-10 md:grid-cols-5 md:gap-6">
          {/* Left: product + CTA + testimonials */}
          <div className="min-w-0 md:col-span-3">
            <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10">
              <div className="bg-topbar px-3 py-1.5 text-center text-[11px] font-semibold leading-snug md:py-2 md:text-sm">
                What Medical School Never Taught You: How to Become the Doctor Your City Remembers
              </div>
              <img
                src={productStack.url}
                alt="Doctor Local Authority System™ product stack: the core system plus implementation bonuses"
                className="h-auto w-full bg-white"
                loading="eager"
              />
            </div>

            <div className="mt-4 md:mt-6">
              <CTAButton subtitle={`Get instant access for just Rs. ${PRICE}`}>
                YES! I Want To Become The #1 Doctor
              </CTAButton>
              <div className="mt-3 text-center text-[11px] font-bold uppercase tracking-wider text-yellow-300 md:text-xs">
                ✅ Instant Access + 5 Implementation Bonuses
              </div>
            </div>

            <TopTestimonials />
          </div>

          {/* Right: order card + opt-in form */}
          <aside className="overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl md:col-span-2">
            <div className="border-b bg-gradient-to-br from-indigo-50 to-white p-5">
              <img
                src={productStack.url}
                alt="Doctor Local Authority System™"
                className="h-auto w-full"
              />
            </div>
            <div className="p-6 text-center">
              <div className="text-lg font-extrabold">LAUNCH PRICE — LIMITED TIME</div>
              <div className="mt-2 text-3xl font-black text-destructive">ONLY Rs. {PRICE}</div>
              <p className="mt-4 text-sm">
                Get the complete <span className="font-bold">Doctor Local Authority System™</span> +
                5 bonuses for just <span className="font-bold">Rs. {PRICE}!</span>
              </p>
              <div className="mt-3 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                ✅ 7-Day Money-Back Guarantee
              </div>
              <AuthorityLeadForm />
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

/* Same three testimonials as the top of the main page, with product-neutral wording. */
function TopTestimonials() {
  const reviews = [
    { image: drManalReview.url, name: "Dr. Manal Fatimah", place: "Lahore, Pakistan" },
    { image: drJasimReview.url, name: "Dr. Jasim Mumtaz", place: "Peshawar" },
    { image: drMehwishReview.url, name: "Dr. Mehwish Rasheed", place: "" },
  ];
  return (
    <div className="mt-6 md:mt-8">
      <div className="mb-5 text-center md:mb-6">
        <h2 className="text-2xl font-extrabold text-white md:text-3xl">
          What <span className="text-yellow-400">Doctors Are Saying</span> About Farhan's Training
        </h2>
        <p className="mt-2 text-sm text-white/70 md:text-base">
          Real, unedited feedback from doctors and healthcare practitioners who have learned from
          Farhan.
        </p>
      </div>
      {reviews.map((r, i) => (
        <div
          key={r.name}
          className={`${i === 0 ? "mt-6" : "mt-5"} rounded-lg bg-white/5 p-3 text-white/95 ring-1 ring-white/10 sm:p-4`}
        >
          <img
            src={r.image}
            alt={`WhatsApp review screenshot from ${r.name}`}
            className="h-auto w-full rounded-md object-contain shadow-md ring-1 ring-white/10"
            loading="lazy"
          />
          <div className="mt-3 px-1">
            <p className="font-bold leading-tight">- {r.name}</p>
            {r.place && <p className="text-xs leading-snug text-white/80 sm:text-sm">{r.place}</p>}
          </div>
        </div>
      ))}
      <div className="mx-auto mb-2 mt-7 max-w-md">
        <CTAButton subtitle="">YES! I WANT TO ENROLL NOW</CTAButton>
      </div>
    </div>
  );
}

/* ---------------- SOCIAL PROOF BAR ---------------- */

function SocialProofBar() {
  const names = [
    "The Diabetes Centre",
    "Diabetics Pakistan",
    "Sara Dietitian",
    "Emaan Gynecology Centre",
    "Kulsoom International Hospital",
    "Naqaish Hospital I-8",
  ];
  return (
    <section className="border-b bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="mb-8 text-xl font-extrabold md:text-2xl">
          Trusted By Leading Clinics &amp; Doctors Across Pakistan
        </h2>
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="marquee-track" aria-hidden={dup === 1}>
              {names.map((n) => (
                <div
                  key={n}
                  className="flex items-center whitespace-nowrap text-sm font-bold uppercase tracking-widest text-muted-foreground md:text-base"
                >
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

/* ---------------- WHAT IS IT + CURRICULUM ---------------- */

function WhatIsItSection() {
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl font-black md:text-5xl">
          What is the <br className="md:hidden" />
          <span className="gradient-highlight">Doctor Local Authority System™?</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed">
          The Doctor Local Authority System™ is the fastest way to become the doctor people in your
          city think of first for your specialty.
          <br />
          <br />
          Without becoming an influencer, posting every day, or paying an agency every month.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          Because let's face it — you're already a good doctor.
          <br />
          <br />
          You've seen less-qualified doctors get busier than you. You've posted, boosted a few
          posts, maybe even paid someone to "manage your social media"…
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <RedTag>
            But here's the hard truth: being a good doctor is not the same as being the doctor
            people remember.
          </RedTag>
        </p>

        <CrowdVisual />

        <p className="mt-8 text-lg leading-relaxed">
          Patients need to repeatedly see, recognise and trust you before they're ready to book.
          Random posts don't do that.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <RedTag>The Doctor Local Authority System™ flips the script.</RedTag>
          <br />
          <br />
          I've turned it into a simple, repeatable system so you can become the recognised name for
          your specialty in your city.
        </p>

        <CurriculumAccordion />

        <div className="mx-auto mt-10 max-w-md">
          <CTAButton subtitle={`Instant access — only Rs. ${PRICE}`}>
            YES! Give Me The System
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

function CurriculumAccordion() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="mt-12">
      <div className="mb-8 text-center">
        <div className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary">
          The System
        </div>
        <h3 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-4xl">
          What's Inside The Doctor Local Authority System™
        </h3>
      </div>
      <div className="space-y-4">
        {MODULES.map((m, i) => {
          const isOpen = openIdx === i;
          const Icon = MODULE_ICONS[i % MODULE_ICONS.length];
          return (
            <div
              key={m.title}
              className={`overflow-hidden rounded-2xl border bg-[#0f172a] text-white shadow-lg transition-all duration-300 ${isOpen ? "border-[#3AA8B4]/70" : "border-white/10"}`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-4 text-left md:p-5"
              >
                <img
                  src={farhanInstructor.url}
                  alt="Farhan Ali — Instructor"
                  className="size-16 shrink-0 rounded-xl object-cover ring-2 ring-[#3AA8B4]/40 md:size-20"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9fe0e6] md:text-xs">
                    <Icon className="size-3.5" /> Module #{i + 1}
                  </div>
                  <h4 className="mt-1 text-base font-extrabold leading-tight md:text-xl">
                    {m.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-white/70 md:text-sm">{m.desc}</p>
                  <span className="mt-2 inline-block rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-black md:text-xs">
                    Farhan Ali
                  </span>
                </div>
                <ChevronDown
                  className={`size-5 shrink-0 text-white/80 transition-transform duration-300 md:size-6 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-white/10 px-4 pb-5 pt-1 md:px-5">
                    <ul className="mt-4 space-y-2.5">
                      {m.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm md:text-base">
                          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#3AA8B4]/20 text-[#9fe0e6] ring-1 ring-[#3AA8B4]/40">
                            <Play className="size-3 fill-current" />
                          </span>
                          <span className="text-white/90">{pt}</span>
                        </li>
                      ))}
                    </ul>
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

/* ---------------- IS THIS FOR YOU ---------------- */

function IsThisForYouSection() {
  const bullets = [
    "How to become known for one clear specialty in your city",
    "How to stay in front of local patients week after week",
    "How to build trust even without a big social following",
    "How to turn familiarity into booked appointments",
  ];
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl font-black md:text-4xl">
          Will This Work for Your <span className="gradient-highlight">Specialty &amp; City?</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-slate-700 md:text-lg">
          Whether you're a doctor, dentist, nutritionist, physiotherapist, psychologist,
          dermatologist, gynecologist, or clinic owner — in Karachi, Lahore, Islamabad, Peshawar or
          a smaller city…
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
          Every city has patients choosing between doctors they barely know. This system helps you
          become the one they already know and trust.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-xl border bg-secondary/40 px-4 py-3"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <span className="text-sm font-semibold md:text-base">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- BONUSES ---------------- */

function BonusesSection() {
  const bonuses = [
    [
      "30-Day Authority Content Calendar",
      "Never wonder what to post again. Get a ready-to-use 30-day authority content plan.",
      "PKR 4,500",
    ],
    [
      "Trust Bridge Launch Kit",
      "Ready-to-use templates and messages so you can set up the Trust Bridge in a single afternoon.",
      "PKR 5,000",
    ],
    [
      "Visibility Accelerator Swipe File",
      "Ready-to-adapt frameworks for reaching the right patients in your city — faster.",
      "PKR 7,500",
    ],
    [
      "Patient Trust & Social Proof Kit",
      "Turn happy patients into powerful trust signals with review, testimonial and case-study templates.",
      "PKR 5,000",
    ],
    [
      "90-Day Local Authority Roadmap",
      "Know exactly what to implement after the system, week by week for the next 90 days.",
      "PKR 5,000",
    ],
  ];
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-black md:text-5xl">
          You Also Unlock Instant Access To
          <br />
          <span className="gradient-highlight">5 Implementation Bonuses!</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {bonuses.map(([title, body, value], i) => (
            <div
              key={title}
              className="overflow-hidden rounded-2xl border bg-card shadow-md transition-shadow hover:shadow-xl"
            >
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 py-8">
                <BonusCover index={i} title={title} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#326CA1]">
                  <Gift className="size-4" /> Fast Start Bonus #{i + 1}
                </div>
                <h3 className="mt-2 text-xl font-extrabold md:text-2xl">{title}</h3>
                <p className="mt-3 text-muted-foreground">{body}</p>
                <div className="mt-4 inline-block rounded bg-accent px-3 py-1 font-bold text-accent-foreground">
                  Value: {value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-semibold">
          Total Bonus Value: <span className="line-through">PKR 27,000</span> —{" "}
          <span className="text-destructive">included FREE with your access today.</span>
        </p>
        <div className="mx-auto mt-10 max-w-md">
          <CTAButton subtitle={`Get the system + all 5 bonuses for Rs. ${PRICE}`}>
            YES! I Want The Bonuses
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- OBJECTIONS ---------------- */

function NotTechnicalSection() {
  const items = [
    "What actually makes patients remember a doctor",
    "What you can do yourself in a few hours a week",
    "What you can hand over to your team",
    "Where NOT to waste money on random agencies and boosted posts",
  ];
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl font-black md:text-4xl">
          No Marketing or <span className="gradient-highlight">Technical Experience Needed</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-slate-700 md:text-lg">
          You don't need to be an expert in ads, algorithms, websites or content creation.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
          Everything is explained in simple, practical language specifically for healthcare
          practitioners. You will understand:
        </p>
        <ul className="mt-6 space-y-3">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border bg-secondary/40 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-800 md:text-base">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BudgetSection() {
  const bullets = [
    "Start with the specialty and services you already offer",
    "Start with a small, manageable budget",
    "Use simple tools before investing in advanced systems",
    "Focus on patients who remember you — not vanity metrics",
  ];
  return (
    <section className="bg-secondary py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-4 flex items-center justify-center">
          <div className="grid size-14 place-items-center rounded-full bg-emerald-100">
            <Wallet className="size-7 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-black md:text-4xl">
          You Don't Need a <span className="gradient-highlight">Huge Budget to Start</span>
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-slate-700 md:text-lg">
          This system isn't about spending more on marketing. It's about building authority step by
          step, and only scaling what's working.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border bg-card p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <span className="text-sm font-semibold md:text-base">{b}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-3xl rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-900 md:text-base">
          The goal isn't to spend more. The goal is to make your name the one patients remember.
        </p>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    {
      icon: Lock,
      title: "Step 1 — Get Instant Access",
      text: `Get the system + 5 bonuses for Rs. ${PRICE}. Access details arrive on WhatsApp & email.`,
    },
    {
      icon: PlayCircle,
      title: "Step 2 — Follow The System",
      text: "Go through each module at your own pace and set up your weekly authority routine.",
    },
    {
      icon: Trophy,
      title: "Step 3 — Become The Doctor They Remember",
      text: "Stay in front of your city until your name is the first one patients think of.",
    },
  ];
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-black md:text-5xl">
          How Does The <span className="gradient-highlight">Doctor Authority System™</span> Work?
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Become the recognised doctor in your city in just 3 steps…
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#3AA8B4] to-[#326CA1] text-white">
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

function NotGenericSection() {
  const examples = [
    {
      s: "Dermatologist",
      f: "Becomes the name people think of for acne and skin concerns in their area",
    },
    { s: "Gynecologist", f: "Becomes the trusted doctor women recommend to friends and family" },
    { s: "Dentist", f: "Becomes the go-to clinic for smile and dental care in the neighbourhood" },
    { s: "Nutritionist", f: "Becomes the recognised expert for weight and diet concerns locally" },
    { s: "Physiotherapist", f: "Becomes the first call for pain and recovery in their city" },
  ];
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-black md:text-4xl">
          Not Generic <span className="gradient-highlight">Marketing Advice</span>
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base text-slate-700 md:text-lg">
          This isn't vague advice like "post consistently" or "make better reels." You'll apply the
          system to your own specialty and your own city.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((e) => (
            <div
              key={e.s}
              className="rounded-xl border-2 border-slate-200 bg-card p-5 shadow-sm transition hover:border-[#3AA8B4]/50 hover:shadow-md"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#326CA1]">{e.s}</div>
              <div className="mt-2 text-sm font-semibold leading-snug text-slate-800 md:text-base">
                {e.f}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-md">
          <CTAButton subtitle={`Only Rs. ${PRICE} — Instant Access`}>
            YES! I Want To Be #1 In My City
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BUILT FOR HEALTHCARE (5 steps + result) ---------------- */

function CredibilitySection() {
  const steps = [
    {
      title: "1. Get Seen by the Right Locals",
      body: "Put your name in front of the people in your city who actually need your specialty — not random followers.",
    },
    {
      title: "2. Build a Warm Audience",
      body: "The step most doctors skip — the one that turns a one-time viewer into someone who keeps listening to you.",
    },
    {
      title: "3. Speak With Authority",
      body: "A simple content formula that makes patients see you as the expert — without ever feeling like you're selling.",
    },
    {
      title: "4. Stay Top-of-Mind",
      body: "Stay in front of your local audience week after week, until your name is the one they remember.",
    },
    {
      title: "5. Get Chosen",
      body: "When the problem shows up, you're the doctor they already know, already trust — and call first.",
    },
  ];
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-black md:text-4xl">
          Built Specifically for{" "}
          <span className="gradient-highlight">Healthcare Practitioners</span>
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base text-slate-700 md:text-lg">
          Created for doctors who want more than random posting, boosted posts and agency promises.
          Five simple steps that work together, so your name keeps showing up — and keeps getting
          chosen:
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-3xl bg-white p-3 pb-5 shadow-sm ring-1 ring-slate-200"
            >
              <StepArt index={i} />
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-12 z-10 hidden size-6 place-items-center rounded-full bg-[#326CA1] text-white shadow lg:grid">
                  <ArrowRight className="size-3.5" />
                </div>
              )}
              <h3 className="mt-4 px-2 font-black text-slate-950">{step.title}</h3>
              <p className="mt-2 px-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border-2 border-[#3AA8B4]/20 bg-white p-6 text-center shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#326CA1]">
            The result
          </div>
          <div className="mt-4">
            <AuthorityCycle />
          </div>
          <div className="mt-2 text-base font-black text-slate-950 md:text-xl">
            Get Seen → Get Remembered → Get Trusted → Get Chosen
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHO FOR ---------------- */

function WhoFor() {
  const list = [
    "Doctors (MBBS, specialists, consultants)",
    "Dental clinic owners",
    "Nutritionists & dietitians",
    "Dermatologists & aesthetic clinics",
    "Gynecologists",
    "Psychologists & therapists",
    "Physiotherapists",
    "Eye, ENT & orthopedic specialists",
    "Hospitals & multi-doctor clinics",
  ];
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-black md:text-5xl">
          Who's This <span className="gradient-highlight">Perfect For?</span>
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {list.map((l) => (
            <div key={l} className="flex items-center gap-3 rounded-lg border bg-card p-4">
              <Users className="size-5 shrink-0 text-[#326CA1]" />
              <span className="font-semibold">{l}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-md">
          <CTAButton subtitle={`Only Rs. ${PRICE} — Launch Price`}>Get Instant Access</CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- OWN PACE (replaces live/replay section) ---------------- */

function OwnPaceSection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-4 flex items-center justify-center">
          <div className="grid size-14 place-items-center rounded-full bg-primary/10">
            <Clock className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-black md:text-4xl">
          Busy With Patients? <span className="gradient-highlight">Learn At Your Own Pace</span>
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-slate-700 md:text-lg">
          There's no live session to attend and no fixed schedule. The system is recorded, so you
          can go through it between patients, in the evening, or on your day off.
        </p>
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center md:p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Included
          </div>
          <div className="mt-2 text-xl font-black text-emerald-900 md:text-2xl">
            Instant access to the complete recorded system.
          </div>
          <p className="mt-3 text-sm text-emerald-900/80 md:text-base">
            Watch at your own pace and come back to any module whenever you need it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRAINER ---------------- */

function TrainerSection() {
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
          <img
            src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/gEjfcPU9sJhDOS0NobUy/media/b28682be-8ac2-41b4-9a64-ad8c57ac0bb7.jpeg"
            alt="Farhan Ali — Healthcare Digital Marketing Expert"
            className="h-auto w-full"
          />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Meet Your Trainer
          </p>
          <h2 className="mt-2 text-4xl font-black md:text-5xl">Farhan Ali</h2>
          <p className="mt-2 text-lg font-semibold text-muted-foreground">
            Digital Marketing Expert for Doctors, Clinics &amp; Hospitals
          </p>
          <p className="mt-4 leading-relaxed">
            Farhan is a Healthcare Digital Marketing Expert with 3+ years of hands-on experience
            helping doctors and clinic owners grow their practice through proven, Pakistan-specific
            patient acquisition systems.
          </p>
          <p className="mt-3 leading-relaxed">He has worked closely with:</p>
          <ul className="mt-3 grid grid-cols-2 gap-y-2">
            {[
              "Diabetologists",
              "Nutritionists",
              "Psychologists",
              "Cardiologists",
              "Dentists",
              "Endocrinologists",
            ].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed">
            The Doctor Local Authority System™ is built on a simple idea: doctors don't need to
            become influencers. They need a practical system that makes the right people notice,
            understand and remember them.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHAT YOU'LL LEAVE WITH ---------------- */

function WhatYoullLeaveWithSection() {
  const outcomes = [
    "A clear position you want to own in your city",
    "A repeatable way to reach the right local audience",
    "A faster way to get noticed than posting alone",
    "A warm local audience that keeps hearing from you",
    "A content formula that builds trust without hard selling",
    "A clear path from familiarity to booked appointments",
    "A simple weekly routine you or your team can run",
  ];
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-black md:text-4xl">
          This Is Not Just Another <span className="gradient-highlight">Marketing Course</span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-700 md:text-lg">
          By the end of the system, you'll know exactly what to do every week to become the doctor
          your city remembers.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {outcomes.map((o) => (
            <div key={o} className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#3AA8B4]/15 text-[#326CA1]">
                <Sparkles className="size-4" />
              </span>
              <span className="text-sm font-semibold text-slate-800 md:text-base">{o}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-yellow-300 bg-yellow-100 px-4 py-3 text-center text-sm font-bold text-slate-900 md:text-base">
          You don't need to implement everything in one day. You'll know the next practical step
          every week.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <CTAButton subtitle={`Only Rs. ${PRICE}`}>
            Yes, Make Me The Doctor They Remember
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SUPPORT / COMMUNITY ---------------- */

function SupportSection() {
  const bullets = [
    "Ask questions as you implement the system",
    "Get practical reminders and implementation guidance",
    "Receive useful templates, ideas and updates",
    "Learn alongside other healthcare practitioners",
  ];
  return (
    <section className="bg-secondary py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-4 flex items-center justify-center">
          <div className="grid size-14 place-items-center rounded-full bg-primary/10">
            <Users2 className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-black md:text-4xl">
          You Won't Be Left <span className="gradient-highlight">On Your Own</span>
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-slate-700 md:text-lg">
          After you get access, you'll also join our private community of doctors and healthcare
          practitioners where you can stay connected, receive updates and get support as you build
          your authority.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border bg-card p-4">
              <HeartHandshake className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="text-sm font-semibold md:text-base">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- GUARANTEE ---------------- */

function GuaranteeSection() {
  const reassurance = [
    "No complicated forms.",
    "No awkward questioning.",
    "No unnecessary back-and-forth.",
  ];
  return (
    <section className="hero-bg py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-3xl bg-[#FFF8E7] shadow-2xl ring-1 ring-black/10">
          <div
            className="relative px-5 py-8 text-center text-white md:px-10 md:py-10"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--cta-from), oklch(0.62 0.24 25))",
            }}
          >
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-white/15 ring-4 ring-white/30 backdrop-blur-sm md:size-20">
              <ShieldCheck className="size-9 md:size-11" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-95 md:text-sm">
              7-Day Money-Back Guarantee
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight md:text-4xl">
              Try the Doctor Authority System™ Completely Risk-Free
            </h2>
          </div>
          <div className="px-5 py-8 text-foreground md:px-10 md:py-12">
            <div className="space-y-4 text-base leading-relaxed md:text-lg">
              <p>Before getting any training, you deserve to know your investment is protected.</p>
              <p>
                Even though the investment is only <span className="font-bold">PKR {PRICE}</span>.
              </p>
            </div>
            <h3 className="mt-8 text-xl font-black md:text-2xl">Here's What You Get Inside:</h3>
            <ul className="mt-5 space-y-2.5">
              {MODULES.map((m) => (
                <li
                  key={m.title}
                  className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-white/60 px-3 py-2"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm leading-snug md:text-base">
                    <span className="font-bold">{m.title}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-4 text-base leading-relaxed md:text-lg">
              <p>Go through the system.</p>
              <p>Apply at least one step to your practice.</p>
              <p className="font-bold">Then make up your own mind.</p>
              <p>
                If you genuinely feel it didn't give you practical, useful steps to become better
                known in your city…
              </p>
              <p>
                Simply message us within <span className="font-bold">7 days</span> and ask for a
                refund.
              </p>
              <p className="font-bold text-emerald-700">We will return your PKR {PRICE}.</p>
            </div>
            <div className="mt-8 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-50 p-5 md:p-6">
              <ul className="space-y-2.5">
                {reassurance.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" />
                    <span className="font-semibold">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto mt-8 max-w-md">
              <CTAButton subtitle={`Only Rs. ${PRICE} — Instant Access`}>
                Get The System Risk-Free
              </CTAButton>
              <p className="mt-3 text-center text-xs font-medium text-muted-foreground md:text-sm">
                7-Day Money-Back Guarantee • Secure Payment • Instant Access
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
    [
      "1. How will I get access?",
      "After your payment is verified, you'll receive your access details on WhatsApp and email.",
    ],
    [
      "2. Is this a live session?",
      "No. It's a recorded, step-by-step system you can go through at your own pace and come back to anytime.",
    ],
    [
      "3. Is this about getting more followers?",
      "No. Followers are only a possible by-product. The goal is local recognition, trust and a clear path to patient inquiries and appointments.",
    ],
    [
      "4. Do I need marketing or technical experience?",
      "No. Every step is explained in simple, practical language for busy doctors.",
    ],
    [
      "5. How much time will this take?",
      "The system is designed to fit around a busy practice. Once it's set up, much of the weekly routine can be handed to a team member.",
    ],
    [
      "6. Will this guarantee appointments?",
      "No ethical marketing system can guarantee a specific number of appointments. The purpose is to build a stronger, more intentional path from local attention to trust and patient action.",
    ],
    [
      "7. What if it's not for me?",
      `You're covered by the 7-day money-back guarantee. Message us within 7 days and we'll refund your Rs. ${PRICE}.`,
    ],
  ];
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl font-black md:text-5xl">FAQs</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Answers to common questions about the Doctor Local Authority System™.
        </p>
        <div className="mt-10 space-y-4">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-lg border bg-card p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold">
                {q}
                <span className="ml-4 text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{a}</p>
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
    <section className="hero-bg py-20 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="font-bold uppercase tracking-widest text-yellow-300">Launch Price</p>
        <h2 className="mt-2 text-2xl font-black md:text-5xl">
          Your city is full of doctors. Make sure patients remember you.
        </h2>
        <p className="mt-4 text-lg text-white/85">
          Get the complete Doctor Local Authority System™ + 5 bonuses for just{" "}
          <span className="font-bold">Rs. {PRICE}</span> today.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <CTAButton subtitle={`Enroll now — only Rs. ${PRICE}`}>
            YES! Make Me #1 In My City
          </CTAButton>
          <p className="mt-4 text-sm font-bold text-yellow-300">✅ 7-Day Money-Back Guarantee</p>
        </div>
        <p className="mt-6 text-sm text-white/70">
          Questions? Email{" "}
          <a className="underline" href="mailto:Farhanali13440@gmail.com">
            Farhanali13440@gmail.com
          </a>{" "}
          or call{" "}
          <a className="underline" href="tel:+923390057379">
            +92 339 0057379
          </a>
        </p>
      </div>
    </section>
  );
}

function ProofSection() {
  // Every proof screenshot from the main site (zeroappleaday.site): doctor reviews first,
  // then the full feedback + payment-proof gallery (shared PROOFS list, so new proofs show here too).
  const proofs: Proof[] = [
    { url: drManalReview.url, kind: "text", alt: "Doctor feedback from Dr. Manal Fatimah" },
    { url: drJasimReview.url, kind: "text", alt: "Doctor feedback from Dr. Jasim Mumtaz" },
    { url: drMehwishReview.url, kind: "text", alt: "Doctor feedback from Dr. Mehwish Rasheed" },
    { url: drManalWhatsapp.url, kind: "text", alt: "WhatsApp feedback from Dr. Manal" },
    ...PROOFS,
  ];
  const feedbackCount = proofs.filter((p) => p.kind === "text").length;
  const paymentCount = proofs.filter((p) => p.kind === "payment").length;

  return (
    <section className="bg-[#0f2a44] py-16 text-white md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Real proof"
          title="Doctors Are Already Responding to Practical Marketing Systems"
          body="Unedited feedback and payment proofs from doctors and healthcare practitioners who have learned from Farhan."
        />
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-bold">
          <span className="rounded-full bg-[#3AA8B4]/20 px-3 py-1.5 text-[#9fe0e6] ring-1 ring-[#3AA8B4]/40">
            {feedbackCount} feedback screenshots
          </span>
          <span className="rounded-full bg-[#95C05B]/20 px-3 py-1.5 text-[#c6e39a] ring-1 ring-[#95C05B]/40">
            {paymentCount} payment proofs
          </span>
        </div>
      </div>

      <div className="mt-10">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 md:gap-5 md:px-10"
          style={{ scrollbarWidth: "thin" }}
        >
          {proofs.map((p, i) => (
            <div
              key={i}
              className="w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white/[0.06] shadow-xl ring-1 ring-white/10 sm:w-[280px] md:w-[300px]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                    p.kind === "payment"
                      ? "bg-[#95C05B]/15 text-[#c6e39a] ring-[#95C05B]/40"
                      : "bg-[#3AA8B4]/15 text-[#9fe0e6] ring-[#3AA8B4]/40"
                  }`}
                >
                  {p.kind === "payment" ? "Payment Proof" : "Feedback"}
                </span>
                <span className="text-[10px] text-white/50">Verified</span>
              </div>
              <div className="flex items-center justify-center bg-black/30 p-2">
                <img
                  src={p.url}
                  alt={p.alt}
                  loading="lazy"
                  className="h-[380px] w-full rounded-lg object-contain sm:h-[420px]"
                />
              </div>
            </div>
          ))}
          <div className="w-4 shrink-0" aria-hidden />
        </div>
        <p className="mt-2 text-center text-xs text-white/50">← swipe to see more →</p>
      </div>

      <div className="mx-auto mt-10 max-w-md px-4">
        <CTAButton />
      </div>
    </section>
  );
}

function AuthorityPage() {
  // Meta Pixel ViewContent — mirrors the Clinic Growth Masterclass sales page.
  useEffect(() => {
    fbqTrack("ViewContent", {
      content_name: "Doctor Local Authority System",
      content_category: "Low Ticket Offer",
      value: PRICE,
      currency: "PKR",
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AuthorityTopbar />
      <Hero />
      <SocialProofBar />
      <WhatIsItSection />
      <IsThisForYouSection />
      <BonusesSection />
      <NotTechnicalSection />
      <BudgetSection />
      <HowItWorks />
      <NotGenericSection />
      <ProofSection />
      <CredibilitySection />
      <WhoFor />
      <OwnPaceSection />
      <TrainerSection />
      <WhatYoullLeaveWithSection />
      <SupportSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCta />
      <Footer />
    </div>
  );
}
