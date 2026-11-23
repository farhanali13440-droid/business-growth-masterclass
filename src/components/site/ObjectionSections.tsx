import { CheckCircle2, ShieldCheck, Wallet, Sparkles, PlayCircle, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/site/CtaButton";

/* --------- 1. Is This For You? --------- */
export function IsThisForYouSection() {
  const bullets = [
    "How to get found by people searching for your service in your city",
    "How to create an offer for your specific business",
    "How to turn WhatsApp inquiries into paying clients",
    "How to build trust even if you don't have a big social following",
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Will This Work for Your <span className="gradient-highlight">Business & City?</span>
        </h2>
        <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-700">
          Whether you run a real estate agency, interior design studio, construction company,
          restaurant, barber shop, boutique or any other local service business…
        </p>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700">
          This masterclass shows you how to get more local client inquiries through Google, Facebook,
          Instagram, content and WhatsApp — and how to do it yourself, with AI helping you along the way.
        </p>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700">
          You'll learn principles you can apply to your own business, services, city and type of client.
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

/* --------- 2. What You Will Leave With --------- */
export function WhatYoullLeaveWithSection() {
  const outcomes = [
    "A clear client-getting strategy for your business",
    "A simple, irresistible offer for your service",
    "A plan to generate client inquiries through Meta Ads",
    "A Google Business Profile strategy to get found locally",
    "An AI-powered content system to build trust with potential clients",
    "A WhatsApp follow-up process to convert inquiries into sales",
    "A path to turn one-time clients into repeat clients and referrals",
  ];
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          This Is Not Just Another <span className="gradient-highlight">Marketing Lecture</span>
        </h2>
        <p className="mt-4 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          By the end of the masterclass, you'll know exactly what to do next to grow your business.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {outcomes.map((o) => (
            <div key={o} className="flex items-start gap-3 rounded-xl bg-card border p-4 shadow-sm">
              <span className="mt-0.5 shrink-0 size-7 rounded-full bg-primary/10 text-primary grid place-items-center">
                <Sparkles className="size-4" />
              </span>
              <span className="text-sm md:text-base font-semibold text-slate-800">{o}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm md:text-base font-bold text-slate-900 bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-3 max-w-3xl mx-auto">
          You don't need to implement everything in one day. The checklists and SOPs take you through
          it one step at a time.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <CtaButton subtitle="Business Growth Masterclass — Rs. 999">Yes, I Want More Clients</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* --------- 3. No Marketing or Technical Experience Needed --------- */
export function NotTechnicalSection() {
  const items = [
    "What actually matters for getting more clients",
    "What you can do yourself — with AI's help",
    "What you can hand to a staff member later",
    "Where not to waste money on agencies, boosts and random marketing activities",
  ];
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          No Marketing or <span className="gradient-highlight">Technical Experience Needed</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed">
          You don't need to be an expert in Meta Ads, websites, pixels, automation, funnels or
          Google Business Profile.
        </p>
        <p className="mt-3 text-base md:text-lg text-slate-700 leading-relaxed">
          Everything is explained in simple, practical language for busy business owners. You will understand:
        </p>
        <ul className="mt-6 space-y-3">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border bg-secondary/40 p-4">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold text-slate-800">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------- 4. You Do Not Need a Huge Budget --------- */
export function BudgetSection() {
  const bullets = [
    "Start with the services you already sell",
    "Start with a small local ad budget",
    "Use free tools and AI before paying for advanced systems",
    "Focus on paying clients, not vanity metrics like likes and followers",
  ];
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full bg-emerald-100 grid place-items-center">
            <Wallet className="size-7 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-black">
          You Don't Need a <span className="gradient-highlight">Huge Budget to Start</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
          This masterclass won't push you into spending a lot on ads or software. You'll learn how to
          start with a simple client-getting system and scale only when you see what's working.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl bg-card border p-4">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base font-semibold">{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm md:text-base font-bold text-emerald-900 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3 max-w-3xl mx-auto">
          The goal isn't to spend more. The goal is to make every rupee you spend on marketing bring
          back clients.
        </p>
      </div>
    </section>
  );
}

/* --------- 5. The complete client journey --------- */
export function CredibilitySection() {
  const flow = [
    "Offer",
    "Ads / Google / Content",
    "Client Inquiry",
    "WhatsApp Follow-Up",
    "Paying Client",
    "Repeat Client / Referral",
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Built For <span className="gradient-highlight">Local Service Businesses</span>
        </h2>
        <p className="mt-5 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          The Business Growth Masterclass is for owners who want more than random posting, boosted
          posts and agency promises.
        </p>
        <p className="mt-3 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          It covers the complete client journey:
        </p>

        <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {flow.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 md:gap-3">
                <div className="rounded-lg bg-white border-2 border-primary/30 px-3 py-2 md:px-4 md:py-2.5 shadow-sm">
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary">
                    Step {idx + 1}
                  </div>
                  <div className="text-xs md:text-sm font-black text-slate-900">{step}</div>
                </div>
                {idx < flow.length - 1 && (
                  <ArrowRight className="size-4 md:size-5 text-primary/60 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm md:text-base text-slate-700 max-w-3xl mx-auto">
          Most businesses only work on one step — usually the ad. That's why the inquiries don't
          turn into sales. This masterclass connects all six.
        </p>
      </div>
    </section>
  );
}

/* --------- 6. Busy running your business? Lifetime access --------- */
export function LiveReplayAccessSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full bg-primary/10 grid place-items-center">
            <PlayCircle className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Busy Running Your Business? <span className="gradient-highlight">Watch Anytime</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
          No need to close your shop or block out a whole day. Watch the masterclass whenever it suits
          you — after work, in the evening, or on your day off.
        </p>
        <div className="mt-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 md:p-8 text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Included</div>
          <div className="mt-2 text-xl md:text-2xl font-black text-emerald-900">
            Lifetime access to the complete masterclass.
          </div>
          <p className="mt-3 text-sm md:text-base text-emerald-900/80">
            Watch at your own pace and come back to the important parts whenever you need.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------- 7. Not Generic Advice (business examples) --------- */
export function NotGenericSection() {
  const examples = [
    { s: "Real Estate", f: "Free property consultation → site visit → closed deal" },
    { s: "Interior Designer", f: "Free design consultation → design package → full project" },
    { s: "Construction Company", f: "Free site visit & estimate → contract → referrals" },
    { s: "Restaurant / Food Chain", f: "First-visit offer → WhatsApp list → repeat orders" },
    { s: "Barber / Grooming Studio", f: "First-visit offer → package or membership → regular clients" },
    { s: "Tailor / Boutique", f: "Seasonal offer → custom order → repeat & referrals" },
  ];
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl md:text-4xl font-black">
          Not Generic <span className="gradient-highlight">Marketing Advice</span>
        </h2>
        <p className="mt-5 text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
          This isn't vague motivation like "post consistently" or "make better reels." You'll learn how
          to apply the system to your own business.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((e) => (
            <div key={e.s} className="rounded-xl border-2 border-slate-200 bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">{e.s}</div>
              <div className="mt-2 text-sm md:text-base font-semibold text-slate-800 leading-snug">
                {e.f}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- Checkout: Before You Register reassurance --------- */
export function BeforeYouRegisterBox() {
  const items = [
    "Business Growth Masterclass access",
    "Lifetime access",
    "Implementation checklists",
    "Digital marketing cheat sheets",
    "Step-by-step SOPs",
    "Google, Meta Ads, AI content & WhatsApp sales guidance",
  ];
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="size-5 text-sky-600" />
        <h2 className="text-base font-black text-slate-900">Before You Enroll — Your Order Includes:</h2>
      </div>
      <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-0.5 shrink-0 grid place-items-center size-5 rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="size-3.5" strokeWidth={3} />
            </span>
            <span className="font-semibold">{it}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg bg-sky-50 border border-sky-200 px-4 py-3 text-xs sm:text-sm font-bold text-sky-900 text-center">
        This is for business owners who want more paying clients — not just more followers.
      </p>
    </section>
  );
}

/* --------- Checkout: FAQ --------- */
export function CheckoutFAQ() {
  const faqs = [
    { q: "Who is this for?", a: "Owners of local service businesses in Pakistan — real estate, interior design, construction, restaurants and food chains, barbers, tailors, gyms and similar businesses." },
    { q: "Do I need previous marketing experience?", a: "No. The training is made for beginners and explained in simple language. AI helps you with most of the work." },
    { q: "Will this work in my city?", a: "Yes. The strategies are built around getting local clients in your own city through Google, Meta Ads, content and WhatsApp." },
    { q: "When can I watch it?", a: "Anytime. You get lifetime access, so you can watch at your own pace and come back to it whenever you need." },
    { q: "Will I need a big advertising budget?", a: "No. You'll learn how to start with a small budget and scale based on results. Some strategies, like Google Business Profile, are free." },
    { q: "Do I have to hire an agency after this?", a: "No. The masterclass is designed so you can run the system yourself. It gives you a complete roadmap you can apply on your own." },
  ];
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-lg border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-slate-900 flex justify-between items-center">
              {f.q}
              <span className="ml-4 text-sky-600 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
