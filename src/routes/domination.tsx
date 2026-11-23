import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, BadgeCheck, CheckCircle2, ChevronDown, Gift, Lock, MapPin, Play,
  Search, ShieldCheck, Star, Target, TrendingUp, Trophy, Users, XCircle,
} from "lucide-react";
import { fbqTrack } from "@/lib/fbpixel";
import { Footer } from "@/components/site/Footer";
import { CtaButton } from "@/components/site/CtaButton";
import { ProofGallery } from "@/components/site/ProofGallery";
import farhanInstructor from "@/assets/farhan-instructor.jpeg.asset.json";
import drManalFatimahReview from "@/assets/dr-manal-fatimah-review.jpeg.asset.json";
import drJasimReview from "@/assets/dr-jasim-mumtaz-review.jpeg.asset.json";
import drMehwishReview from "@/assets/dr-mehwish-rasheed-review.jpeg.asset.json";
import drAmnahReview from "@/assets/proof/text-dr-amnah.jpg.asset.json";

/**
 * Doctors Local Domination System — low-ticket offer (PKR 999)
 * Sales page at zeroappleaday.site/domination
 * Sequence mirrors the Clinic Growth Masterclass page ("/").
 */

const PRICE = 999;
const PRODUCT_NAME = "Doctors Local Domination System";
/** Next step in the funnel. Checkout page will be built at this path. */
const CHECKOUT_PATH = "/domination/checkout";

export const Route = createFileRoute("/domination")({
  head: () => ({
    meta: [
      { title: "Doctors Local Domination System — Become The #1 Clinic In Your City" },
      {
        name: "description",
        content:
          "The step-by-step system Pakistani doctors use to become the #1 clinic in their city on Google Maps, reviews and local search. Only Rs. 999.",
      },
      { property: "og:title", content: "Doctors Local Domination System — Farhan Ali" },
      {
        property: "og:description",
        content:
          "Become the first clinic patients find, trust and call in your city — without depending on expensive agencies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DominationPage,
});

function DominationPage() {
  useEffect(() => {
    fbqTrack("ViewContent", {
      content_name: PRODUCT_NAME,
      content_category: "Low Ticket Offer",
      value: PRICE,
      currency: "PKR",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <DominationTopbar />
      <Hero />
      <SocialProofBar />
      <WhatIsItSection />
      <IsThisForYouSection />
      <BonusesSection />
      <NotTechnicalSection />
      <BudgetSection />
      <HowItWorks />
      <NotGenericSection />
      <ProofGallery />
      <WhoFor />
      <TrainerSection />
      <WhatYoullLeaveWithSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ---------------- TOPBAR ---------------- */

function DominationTopbar() {
  return (
    <div className="w-full bg-topbar text-white text-xs">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-1.5 sm:py-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
        <a href="/domination" className="font-extrabold tracking-widest text-[11px] sm:text-sm border border-white/40 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 leading-tight flex flex-col items-center shrink-0">
          <span>LOCAL&nbsp;DOMINATION</span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.25em] font-medium">SYSTEM FOR DOCTORS</span>
        </a>
        <div className="flex flex-col items-end gap-0 leading-tight min-w-0">
          <span className="font-semibold text-[10px] sm:text-xs">Need Help?</span>
          <a href="mailto:Farhanali13440@gmail.com" className="underline text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">Farhanali13440@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section className="hero-bg text-white">
      <div className="mx-auto max-w-[380px] sm:max-w-2xl md:max-w-7xl px-3 sm:px-4 pt-4 pb-8 md:pt-10 md:pb-16">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md pl-1.5 pr-3 py-1 sm:pl-2 sm:pr-5 sm:py-2 shadow-sm">
            <span className="flex items-center justify-center size-5 sm:size-7 rounded-full bg-yellow-300/20 ring-1 ring-yellow-300/40 shrink-0">
              <BadgeCheck className="size-3 sm:size-4 text-yellow-300" />
            </span>
            <span className="text-[10px] sm:text-sm font-semibold tracking-wide text-white/95 leading-snug text-center">
              For Doctors, Dentists, Nutritionists &amp; Clinic Owners across Pakistan
            </span>
          </div>
        </div>

        <h1 className="mt-4 md:mt-8 text-center text-[22px] leading-[1.15] sm:text-3xl md:text-5xl lg:text-6xl font-black md:leading-[1.05] uppercase">
          Discover How To Become The{" "}
          <span className="gradient-highlight">#1 Clinic In Your City</span>{" "}
          — The First Name Patients Find, Trust &amp;{" "}
          <span className="gradient-highlight">Call</span>!
        </h1>
        <p className="mt-3 md:mt-6 text-center max-w-3xl mx-auto text-sm md:text-xl text-white/85 leading-snug">
          Even if your competitors have been in practice longer, you have zero Google reviews today,
          or you've never touched marketing before.
        </p>

        <div className="mt-5 md:mt-10 grid md:grid-cols-5 gap-5 md:gap-6 items-start">
          <div className="md:col-span-3">
            <MapsMockup />

            <div className="mt-4 md:mt-6">
              <CtaButton subtitle={`Get instant access for just ${PRICE} PKR`}>
                YES! I Want To Dominate My City
              </CtaButton>
              <div className="mt-3 text-center text-[11px] md:text-xs font-bold text-yellow-300 uppercase tracking-wider">
                ✅ Step-By-Step System + 4 Fast-Start Bonuses
              </div>
            </div>

            <TopTestimonials />
          </div>

          <aside className="md:col-span-2 bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden md:sticky md:top-4">
            <ProductBox />
            <div className="p-6 text-center">
              <div className="text-lg font-extrabold">LAUNCH PRICE — LIMITED TIME</div>
              <div className="mt-2 text-3xl font-black text-destructive">
                ONLY <span>Rs. {PRICE}</span>
              </div>
              <p className="mt-4 text-sm">
                Get the complete <span className="font-bold">{PRODUCT_NAME}</span> for just{" "}
                <span className="font-bold">Rs. {PRICE}!</span>
              </p>
              <div className="mt-3 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                ✅ 7-Day Money-Back Guarantee
              </div>

              <InlineLeadForm />

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> 100% Secure 256-Bit Encrypted Checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/** Visual of a Google Maps "local pack" with the user's clinic ranked #1 — built in CSS, no image needed. */
function MapsMockup() {
  const results = [
    { name: "Your Clinic", rating: "4.9", reviews: "187", tag: "Open now · Book on WhatsApp", top: true },
    { name: "Competitor Clinic A", rating: "4.1", reviews: "23", tag: "Closes 9 PM", top: false },
    { name: "Competitor Clinic B", rating: "3.8", reviews: "9", tag: "Hours not listed", top: false },
  ];
  return (
    <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 bg-white text-slate-900">
      <div className="bg-topbar text-white text-center py-1.5 md:py-2 px-3 text-[11px] md:text-sm font-semibold leading-snug">
        This Is What Patients Should See When They Search Your Specialty In Your City
      </div>
      <div className="p-3 md:p-5">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
          <Search className="size-4 text-slate-500 shrink-0" />
          <span className="text-sm md:text-base text-slate-700 truncate">best skin specialist near me</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {results.map((r, i) => (
            <div
              key={r.name}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                r.top ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300/60" : "border-slate-200 bg-white opacity-70"
              }`}
            >
              <div className={`size-9 md:size-10 rounded-full grid place-items-center font-black shrink-0 ${r.top ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-extrabold text-sm md:text-base truncate ${r.top ? "text-emerald-800" : ""}`}>{r.name}</span>
                  {r.top && (
                    <span className="hidden sm:inline-block bg-yellow-400 text-[#0b1735] text-[10px] font-black px-2 py-0.5 rounded uppercase">#1 in your city</span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs md:text-sm">
                  <span className="font-bold">{r.rating}</span>
                  <span className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3 fill-yellow-500" />)}
                  </span>
                  <span className="text-slate-500">({r.reviews})</span>
                </div>
                <div className="text-[11px] md:text-xs text-slate-500">{r.tag}</div>
              </div>
              <MapPin className={`size-5 shrink-0 ${r.top ? "text-red-500 fill-red-500/20" : "text-slate-400"}`} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-500">Illustration only</p>
      </div>
    </div>
  );
}

/** Product "box" for the order card — built in CSS so no new image asset is required. */
function ProductBox() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-5 border-b">
      <div className="relative mx-auto max-w-xs rounded-2xl bg-gradient-to-br from-[#0b1735] via-[#13265a] to-[#0b1735] p-6 text-white shadow-2xl ring-1 ring-black/10">
        <div className="absolute -top-3 -right-3 rotate-6 bg-yellow-400 text-[#0b1735] text-[11px] font-black px-3 py-1 rounded-lg shadow">
          Rs. {PRICE}
        </div>
        <Trophy className="mx-auto size-12 text-yellow-300" />
        <div className="mt-3 text-center text-[11px] font-bold tracking-[0.25em] text-yellow-300 uppercase">Farhan Ali presents</div>
        <div className="mt-1 text-center text-2xl font-black leading-tight">
          Doctors Local<br />Domination System
        </div>
        <div className="mt-3 text-center text-xs text-white/75">Become the #1 clinic in your city</div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wide">
          <div className="rounded bg-white/10 py-1.5">Google Maps</div>
          <div className="rounded bg-white/10 py-1.5">Reviews</div>
          <div className="rounded bg-white/10 py-1.5">Local Ads</div>
        </div>
      </div>
    </div>
  );
}

function InlineLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      id="lead-form"
      className="mt-5 space-y-3 text-left scroll-mt-24"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        const fullName = name.trim();
        const emailNorm = email.trim().toLowerCase();
        const wa = whatsapp.trim();
        const spec = specialty.trim();
        const cityName = city.trim();

        if (fullName.length < 2) return setError("Please enter your full name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) return setError("Please enter a valid email address.");
        if (wa.replace(/\D/g, "").length < 10) return setError("Please enter a valid WhatsApp number (e.g. 03XX XXXXXXX).");
        if (!spec) return setError("Please enter your medical speciality / field of practice.");
        if (!cityName) return setError("Please enter your city.");

        setSubmitting(true);
        try {
          fbqTrack("Lead", {
            content_name: `${PRODUCT_NAME} — Step 1 Opt-In`,
            value: 0,
            currency: "PKR",
          });
        } catch {}

        // Lead is saved on the checkout step (built next) so it doesn't overwrite
        // Masterclass rows in clinic_growth_leads. Details travel via URL params.
        const params = new URLSearchParams({
          full_name: fullName,
          email: emailNorm,
          whatsapp: wa,
          specialty: spec,
          city: cityName,
        });
        window.location.assign(`${CHECKOUT_PATH}?${params.toString()}`);
      }}
    >
      {[
        { v: name, set: setName, ph: "Full Name*", ac: "name", type: "text" },
        { v: email, set: setEmail, ph: "Email*", ac: "email", type: "email" },
        { v: whatsapp, set: setWhatsapp, ph: "WhatsApp Number* (e.g. 03XX XXXXXXX)", ac: "tel", type: "tel" },
        { v: specialty, set: setSpecialty, ph: "Medical Speciality / Field of Practice*", ac: "off", type: "text" },
        { v: city, set: setCity, ph: "Your City*", ac: "address-level2", type: "text" },
      ].map((f) => (
        <input
          key={f.ph}
          required
          type={f.type}
          value={f.v}
          onChange={(e) => f.set(e.target.value)}
          placeholder={f.ph}
          autoComplete={f.ac}
          maxLength={120}
          className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ))}
      {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn-cta w-full px-4 py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span>{submitting ? "PLEASE WAIT..." : "GO TO STEP #2"}</span>
          <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
        </span>
        <div className="text-xs font-medium normal-case tracking-normal opacity-95">Get Instant Access Now</div>
      </button>
      <p className="text-[11px] text-center text-muted-foreground">
        Your details are kept private. Payment is on the next step.
      </p>
    </form>
  );
}

/* ---------------- TESTIMONIALS (same as Masterclass page) ---------------- */

function TopTestimonials() {
  const reviews = [
    { img: drManalFatimahReview.url, name: "Dr. Manal Fatimah", place: "Lahore, Pakistan" },
    { img: drJasimReview.url, name: "Dr. Jasim Mumtaz", place: "Peshawar" },
    { img: drMehwishReview.url, name: "Dr. Mehwish Rasheed", place: "" },
    { img: drAmnahReview.url, name: "Dr. Amnah", place: "" },
  ];
  return (
    <div className="mt-6 md:mt-8">
      <div className="text-center mb-5 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          What Doctors Say After <span className="text-yellow-400">Training With Farhan</span>
        </h2>
        <p className="mt-2 text-white/70 text-sm md:text-base">
          Real feedback from doctors and healthcare practitioners who attended the Clinic Growth Masterclass.
        </p>
      </div>
      {reviews.map((r, i) => (
        <div key={r.name} className={`${i === 0 ? "mt-6" : "mt-5"} rounded-lg bg-white/5 ring-1 ring-white/10 p-3 sm:p-4 text-white/95`}>
          <img
            src={r.img}
            alt={`WhatsApp review screenshot from ${r.name}`}
            className="w-full h-auto rounded-md ring-1 ring-white/10 shadow-md object-contain"
            loading="lazy"
          />
          <div className="mt-3 px-1">
            <p className="font-bold leading-tight">- {r.name}</p>
            {r.place && <p className="text-xs sm:text-sm text-white/80 leading-snug">{r.place}</p>}
          </div>
        </div>
      ))}
      <div className="mt-7 mb-2 max-w-md mx-auto">
        <CtaButton>YES! I WANT TO BE #1 IN MY CITY</CtaButton>
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
    <section className="bg-white py-10 border-b">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold mb-8">Trusted By Leading Clinics &amp; Doctors Across Pakistan</h2>
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="marquee-track" aria-hidden={dup === 1}>
              {names.map((n) => (
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

function RedTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded-md ring-2 ring-red-700/40 shadow-sm">
      {children}
    </span>
  );
}

function WhatIsItSection() {
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl md:text-5xl font-black text-center">
          What is the <br className="md:hidden" />
          <span className="gradient-highlight">Doctors Local Domination System?</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed">
          The Doctors Local Domination System is a step-by-step system to make your clinic the
          first name patients see, trust and call when they search for your specialty in your city.
          <br /><br />
          Without paying expensive agencies, begging patients for reviews, or posting on social media every day.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          Here's what's really happening in your city right now…
          <br /><br />
          A patient types <span className="font-bold">"best gynecologist near me"</span> or{" "}
          <span className="font-bold">"dentist in Johar Town"</span> into Google. Three clinics show up on the map.
          They pick one of those three — and almost never scroll further.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <RedTag>If you're not in those top 3, you don't exist for that patient.</RedTag>
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          It doesn't matter how qualified you are, how many years you've practiced, or how good your
          treatment is. The clinic with the better Google profile, more reviews and stronger local
          presence gets the call — every single day.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          <RedTag>The Local Domination System flips that.</RedTag>
          <br /><br />
          I've mapped out exactly what to fix, in what order, so you can become the most visible and
          most trusted clinic for your specialty in your area.
        </p>

        <CurriculumAccordion />

        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle={`Instant Access — Only Rs. ${PRICE}`}>YES! Give Me The System</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- IS THIS FOR YOU ---------------- */

function IsThisForYouSection() {
  const bullets = [
    "How to rank in the top 3 on Google Maps for your specialty",
    "How to collect 5-star reviews without awkwardly asking",
    "How to outshine older, bigger clinics in your area",
    "How to turn local searches into WhatsApp bookings",
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Will This Work for Your <span className="gradient-highlight">Specialty &amp; City?</span>
        </h2>
        <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-700">
          Whether you're in Karachi, Lahore, Islamabad, Peshawar, Multan, Faisalabad or a smaller city —
          and whether you're a doctor, dentist, nutritionist, physiotherapist, psychologist,
          dermatologist, gynecologist or clinic owner…
        </p>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700">
          Patients in every city search the same way: on Google, on Maps, and by asking around. This
          system works on all three.
        </p>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700">
          In fact, smaller cities are often <span className="font-bold">easier</span> to dominate —
          because most clinics there haven't even claimed their Google profile yet.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border bg-secondary/40 px-4 py-3">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold">{b}</span>
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
    {
      tag: "Fast Start Bonus #1",
      title: "Google Business Profile Optimization Checklist",
      copy: "The exact 40-point checklist to set up and optimize your clinic's Google profile — tick it off in one afternoon.",
      value: "Rs. 10,000",
      icon: MapPin,
    },
    {
      tag: "Fast Start Bonus #2",
      title: "5-Star Review WhatsApp Scripts",
      copy: "Copy-paste messages your receptionist can send after every visit to collect genuine 5-star reviews on autopilot.",
      value: "Rs. 8,000",
      icon: Star,
    },
    {
      tag: "Fast Start Bonus #3",
      title: "Competitor Spy Sheet",
      copy: "A simple worksheet to find exactly why the top clinics in your city rank above you — and how to overtake them.",
      value: "Rs. 7,000",
      icon: Target,
    },
    {
      tag: "Fast Start Bonus #4",
      title: "30-Day Local Domination Action Plan",
      copy: "A day-by-day plan so you know exactly what to do each week to climb to #1 — no guesswork.",
      value: "Rs. 12,000",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          You Also Unlock Instant Access To<br />
          <span className="gradient-highlight">4 Additional Bonuses!</span>
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {bonuses.map((b) => (
            <div key={b.title} className="rounded-2xl border bg-card overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-[#0b1735] via-[#13265a] to-[#0b1735] py-10 grid place-items-center">
                <div className="size-20 rounded-2xl bg-yellow-400/15 ring-2 ring-yellow-300/50 grid place-items-center">
                  <b.icon className="size-10 text-yellow-300" />
                </div>
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
          Total Bonus Value: <span className="line-through">Rs. 37,000</span> —{" "}
          <span className="text-destructive">included FREE with your access today.</span>
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle={`Get The System + All 4 Bonuses For Rs. ${PRICE}`}>YES! I Want The Bonuses</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- OBJECTIONS ---------------- */

function NotTechnicalSection() {
  const items = [
    "Exactly which settings on your Google profile actually affect ranking",
    "What you can do yourself in 30 minutes a week",
    "What your receptionist or assistant can handle for you",
    "Where NOT to waste money on fake reviews, random SEO agencies or boosted posts",
  ];
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          No Marketing or <span className="gradient-highlight">Technical Experience Needed</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed">
          You don't need to understand SEO, algorithms, websites or ads.
        </p>
        <p className="mt-3 text-base md:text-lg text-slate-700 leading-relaxed">
          Everything is explained in simple, practical language for busy healthcare practitioners. You will understand:
        </p>
        <ul className="mt-6 space-y-3">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border bg-white p-4">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold text-slate-800">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BudgetSection() {
  const bullets = [
    "Google Business Profile is 100% free",
    "Reviews cost nothing — just the right process",
    "Local ads are optional and can start small",
    "Focus on calls and bookings, not likes and followers",
  ];
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          You Don't Need a <span className="gradient-highlight">Big Budget to Dominate Locally</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
          Most of what makes a clinic #1 in its city is free. It's about doing the right things,
          consistently, in the right order.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border bg-secondary/40 px-4 py-3">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    { icon: Lock, title: "Step 1 — Get Instant Access", text: `Grab the system for just Rs. ${PRICE} and get your access details on WhatsApp & email.` },
    { icon: Play, title: "Step 2 — Follow The System", text: "Work through each step at your own pace — most doctors finish the core setup in a weekend." },
    { icon: Trophy, title: "Step 3 — Become #1 In Your City", text: "Climb the local rankings, collect reviews, and become the clinic patients choose first." },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">
          How Does The <span className="gradient-highlight">Local Domination System</span> Work?
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Become the go-to clinic in your city in just 3 steps…
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

/* ---------------- NOT GENERIC ---------------- */

function NotGenericSection() {
  const generic = [
    "Generic SEO tips written for restaurants and shops",
    "\"Just post more on Instagram\" advice",
    "Agencies charging monthly fees with no visible ranking",
    "Strategies built for the US or UK market",
  ];
  const ours = [
    "Built specifically for doctors and clinics",
    "Made for how Pakistani patients search and book",
    "WhatsApp-first booking flow patients actually use",
    "Ethical — no fake reviews, no PMDC-risky claims",
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          This Is Not <span className="gradient-highlight">Generic SEO Advice</span>
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-black text-lg text-red-700">What doesn't work for clinics</h3>
            <ul className="mt-4 space-y-3">
              {generic.map((g) => (
                <li key={g} className="flex items-start gap-3">
                  <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-black text-lg text-emerald-700">The Local Domination System</h3>
            <ul className="mt-4 space-y-3">
              {ours.map((o) => (
                <li key={o} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle={`Only Rs. ${PRICE} — Instant Access`}>YES! I Want To Be #1</CtaButton>
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
        <div className="mt-10 max-w-md mx-auto">
          <CtaButton subtitle={`Only Rs. ${PRICE} — Launch Price`}>Get Instant Access</CtaButton>
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
            alt="Farhan Ali — Healthcare Digital Marketing Expert"
            className="w-full h-auto"
          />
        </div>
        <div>
          <p className="uppercase tracking-widest text-primary font-bold text-sm">Meet Your Trainer</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-black">Farhan Ali</h2>
          <p className="mt-2 text-lg font-semibold text-muted-foreground">
            Digital Marketing Expert for Doctors, Clinics &amp; Hospitals
          </p>
          <p className="mt-4 leading-relaxed">
            Farhan is a Healthcare Digital Marketing Expert with 3+ years of hands-on experience helping
            doctors and clinic owners grow their practice through proven, Pakistan-specific patient
            acquisition systems.
          </p>
          <p className="mt-3 leading-relaxed">He has worked closely with:</p>
          <ul className="mt-3 grid grid-cols-2 gap-y-2">
            {["Diabetologists", "Nutritionists", "Psychologists", "Cardiologists", "Dentists", "Endocrinologists"].map((s) => (
              <li key={s} className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" />{s}</li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed">
            Local visibility — Google Maps, reviews and local trust — is the first thing Farhan fixes
            for every clinic he works with, because it's the fastest, cheapest way to get more patients
            calling.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHAT YOU'LL LEAVE WITH ---------------- */

function WhatYoullLeaveWithSection() {
  const outcomes = [
    "A fully optimized Google Business Profile for your clinic",
    "A review system that brings in 5-star reviews every week",
    "A clear picture of who you're competing against — and how to beat them",
    "Local content that builds trust with patients in your area",
    "A simple local ad plan to reach patients within a few km",
    "A WhatsApp booking flow that turns searches into appointments",
    "A 30-day plan to climb to the #1 spot in your city",
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          What You'll <span className="gradient-highlight">Walk Away With</span>
        </h2>
        <p className="mt-4 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          By the end of the system, you'll have everything in place to become the most visible and most
          trusted clinic for your specialty in your city.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {outcomes.map((o) => (
            <div key={o} className="flex items-start gap-3 rounded-xl bg-card border p-4 shadow-sm">
              <span className="mt-0.5 shrink-0 size-7 rounded-full bg-primary/10 text-primary grid place-items-center">
                <Trophy className="size-4" />
              </span>
              <span className="text-sm md:text-base font-semibold text-slate-800">{o}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <CtaButton subtitle={`Only Rs. ${PRICE}`}>Yes, Make My Clinic #1</CtaButton>
        </div>
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
    "You can keep the training resources and bonuses.",
  ];
  return (
    <section className="py-12 md:py-20 hero-bg">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 bg-[#FFF8E7]">
          <div
            className="relative px-5 py-8 md:px-10 md:py-10 text-center text-white"
            style={{ backgroundImage: "linear-gradient(135deg, var(--cta-from), oklch(0.62 0.24 25))" }}
          >
            <div className="mx-auto mb-4 size-16 md:size-20 rounded-full bg-white/15 ring-4 ring-white/30 grid place-items-center backdrop-blur-sm">
              <ShieldCheck className="size-9 md:size-11" />
            </div>
            <p className="uppercase tracking-widest text-xs md:text-sm font-bold opacity-95">7-Day Money-Back Guarantee</p>
            <h2 className="mt-2 text-2xl md:text-4xl font-black leading-tight">
              Try The Local Domination System Completely Risk-Free
            </h2>
          </div>

          <div className="px-5 py-8 md:px-10 md:py-12 text-foreground">
            <div className="space-y-4 text-base md:text-lg leading-relaxed">
              <p>Go through the system.</p>
              <p>Apply at least one step to your clinic's Google profile.</p>
              <p className="font-bold">Then make up your own mind.</p>
              <p>
                If you genuinely feel it did not give you practical, useful steps to become more visible
                to local patients…
              </p>
              <p>
                Simply message us within <span className="font-bold">7 days</span> and ask for a refund.
              </p>
              <p className="font-bold text-emerald-700">We will return your PKR {PRICE}.</p>
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

            <div className="mt-8 max-w-md mx-auto">
              <CtaButton subtitle={`Only Rs. ${PRICE} — Instant Access`}>Get The System Risk-Free →</CtaButton>
              <p className="mt-3 text-center text-xs md:text-sm text-muted-foreground font-medium">
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
    {
      q: "1. How will I get access?",
      a: "Right after your payment is confirmed, you'll receive your access details on WhatsApp and email. You can start immediately and go at your own pace.",
    },
    {
      q: "2. I already have a Google Business Profile. Is this still for me?",
      a: "Yes. Most clinics have a profile that's only 20–30% optimized. The system shows you exactly what's missing and how to fix it so you rank above competitors.",
    },
    {
      q: "3. Do I need a website?",
      a: "No. You can rank on Google Maps and get patient calls without a website. If you do have one, we'll show you how to make it support your local ranking.",
    },
    {
      q: "4. How long until I see results?",
      a: "Many changes — like a fully optimized profile and new reviews — start making a difference within weeks. How fast you reach #1 depends on your city, specialty and how consistently you follow the 30-day plan.",
    },
    {
      q: "5. Is this only for Pakistani doctors?",
      a: "It's built for how patients search and book in Pakistan — WhatsApp-first, Urdu and English search terms, and local cities. The principles work anywhere, but every example is Pakistan-specific.",
    },
    {
      q: "6. What if it doesn't work for me?",
      a: `You're covered by our 7-day money-back guarantee. If you don't find it practical and useful, message us within 7 days and we'll refund your Rs. ${PRICE}.`,
    },
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl md:text-5xl font-black">FAQs</h2>
        <p className="text-center text-muted-foreground mt-2">
          Answers to common questions about the Doctors Local Domination System.
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
        <p className="uppercase tracking-widest text-yellow-300 font-bold">Launch Price</p>
        <h2 className="mt-2 text-2xl md:text-5xl font-black">
          Every day you wait, a competitor gets the patient who searched for you.
        </h2>
        <p className="mt-4 text-lg text-white/85">
          Get the complete Doctors Local Domination System for just <span className="font-bold">Rs. {PRICE}</span> today.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <CtaButton subtitle={`Instant Access — Only Rs. ${PRICE}`}>YES! Make My Clinic #1</CtaButton>
          <p className="mt-4 text-sm font-bold text-yellow-300">✅ 7-Day Money-Back Guarantee</p>
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
      label: "STEP #1",
      title: "Google Maps Top-3 Blueprint",
      desc: "Set up and optimize your Google Business Profile so you show up in the top 3 when patients search your specialty nearby.",
      intro: "The map pack is where most local patients choose their doctor. This is how you get in it.",
      points: [
        "The categories, services & keywords that actually move rankings",
        "Photos, posts and Q&A that signal an active, trusted clinic",
        "Common mistakes that get clinic profiles suspended — and how to avoid them",
      ],
    },
    {
      label: "STEP #2",
      title: "5-Star Review Engine",
      desc: "A simple, ethical system to collect a steady stream of genuine 5-star reviews from your happy patients every week.",
      intro: "Reviews are the #1 trust signal for new patients — and a major ranking factor.",
      points: [
        "The perfect moment and wording to request a review",
        "WhatsApp automation your receptionist can run",
        "How to reply to reviews (including negative ones) professionally",
      ],
    },
    {
      label: "STEP #3",
      title: "Competitor Takedown Analysis",
      desc: "Find out exactly why the clinics above you are ranking — and the gaps you can use to overtake them.",
      intro: "Stop guessing. See your local market the way Google sees it.",
      points: [
        "Audit the top 3 clinics in your city in 20 minutes",
        "Spot the weaknesses they don't know they have",
        "Build your plan to outrank them, one step at a time",
      ],
    },
    {
      label: "STEP #4",
      title: "Local Authority Content",
      desc: "Create simple, city-specific content that makes patients in your area see you as THE expert for your specialty.",
      intro: "Become the doctor patients recognise before they ever walk into your clinic.",
      points: [
        "Content ideas built around your city and patient questions",
        "Google posts & social posts that reinforce your local ranking",
        "Turn one patient FAQ into a week of trust-building content",
      ],
    },
    {
      label: "STEP #5",
      title: "Local Radius Ads",
      desc: "Reach patients within a few kilometres of your clinic with small, targeted Meta ads — only when you're ready to scale.",
      intro: "Optional, but powerful: put your clinic in front of every nearby patient.",
      points: [
        "Radius targeting set-up for clinics",
        "Ad ideas that bring local WhatsApp inquiries",
        "How to start small and only spend more on what works",
      ],
    },
    {
      label: "STEP #6",
      title: "Search-To-Booking Conversion",
      desc: "Turn profile views and calls into booked appointments with a WhatsApp-first booking process.",
      intro: "Ranking #1 is useless if calls go unanswered. This closes the loop.",
      points: [
        "WhatsApp Business setup with quick replies & labels",
        "The booking script that converts inquiries into visits",
        "Track how many patients come from Google every month",
      ],
    },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <div className="inline-block text-xs font-bold tracking-[0.25em] text-primary uppercase">The System</div>
        <h3 className="mt-2 text-2xl md:text-4xl font-black uppercase tracking-tight">
          What's Inside The Doctors Local Domination System
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
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
              >
                <img
                  src={farhanInstructor.url}
                  alt="Farhan Ali — Instructor"
                  className="size-16 md:size-20 rounded-xl object-cover ring-2 ring-primary/40 shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] md:text-xs font-bold tracking-[0.18em] text-primary uppercase">{m.label}</div>
                  <h4 className="mt-1 text-base md:text-xl font-extrabold leading-tight">{m.title}</h4>
                  <p className="mt-1 text-xs md:text-sm text-white/70 line-clamp-2">{m.desc}</p>
                  <span className="mt-2 inline-block bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-2 py-0.5 rounded">
                    Farhan Ali
                  </span>
                </div>
                <ChevronDown className={`size-5 md:size-6 text-white/80 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-4 md:px-5 pb-5 pt-1 border-t border-white/10">
                    <p className="mt-4 text-sm md:text-base text-white/75">{m.intro}</p>
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
