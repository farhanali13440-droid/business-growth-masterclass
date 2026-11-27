/**
 * Google Ads for Clinics — one-time offer (upsell, PKR 5,000) and downsell (PKR 3,000).
 * Funnel: /authority → /authority-order → /authority-oto → (no) /authority-downsell → /authority-thank-you
 * "diy" variant — Mini MBA for Your Business (PKR 5,000), the downsell for masterclass buyers who don't qualify
 * for done-for-you: /order → /strategy-call (application + Calendly) → /thank-you
 * Layout/copy structure modelled on a proven upsell → "meet halfway" downsell funnel.
 */
import { useEffect, useRef, useState } from "react";
import { isAdminPreview, PREVIEW_LEAD_ID } from "@/lib/admin-preview";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronsRight,
  ClipboardCheck,
  Copy,
  ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  MapPin,
  Megaphone,
  MessageCircle,
  Search,
  Workflow,
  Bot,
  LineChart,
  MonitorPlay,
  PenLine,
  PhoneCall,
  Upload,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { fbqTrack } from "@/lib/fbpixel";
import { compressImage, uploadScreenshot } from "@/lib/screenshot-upload";
import { preloadOcr, readPaymentScreenshot } from "@/lib/payment-ocr";
import { evaluateReading, type ScreenshotReading } from "@/lib/payment-verify";
import { recordAuthorityOto } from "@/lib/authority-oto.functions";
import farhanInstructor from "@/assets/farhan-instructor.jpeg.asset.json";
import drManalReview from "@/assets/dr-manal-fatimah-review.jpeg.asset.json";
import drJasimReview from "@/assets/dr-jasim-mumtaz-review.jpeg.asset.json";
import drMehwishReview from "@/assets/dr-mehwish-rasheed-review.jpeg.asset.json";

export type OtoVariant = "upsell" | "downsell" | "diy";

const PRODUCT_NAME = "Google Ads for Clinics";
const DIY_PRODUCT_NAME = "Mini MBA for Your Business";
const FULL_PRICE = 5000;
const DOWNSELL_PRICE = 3000;
const PAY_LATER = FULL_PRICE - DOWNSELL_PRICE;
const PAY_LATER_DAYS = 14;
const PAYMENT_ACCOUNTS = {
  easypaisa: { label: "Easypaisa", name: "Farhan Ali Rasheed", account: "03135944817" },
  jazzcash: { label: "JazzCash", name: "Farhan Ali Rasheed", account: "03135944817" },
} as const;
type PayMethod = keyof typeof PAYMENT_ACCOUNTS;
const SUPPORT_WA = "923135944817";
const MAX_FAILED_CHECKS = 2;

/** What's inside — "usually" values are placeholders; today's prices add up to FULL_PRICE. */
const COMPONENTS: {
  icon: LucideIcon;
  title: string;
  short: string;
  tag: string;
  desc: string;
  usual: number;
  today: number;
}[] = [
  {
    icon: MonitorPlay,
    title: "Clinic Google Ads Setup Walkthrough",
    short: "Setup Walkthrough",
    tag: "Step-by-step videos",
    desc: "Screen-by-screen videos to set up your clinic's Google Ads account correctly — even if you've never opened Google Ads before.",
    usual: 6000,
    today: 1200,
  },
  {
    icon: KeyRound,
    title: "Patient Keyword Vault",
    short: "Keyword Vault",
    tag: "By specialty",
    desc: "The exact words patients type when they need your specialty — in English and Roman Urdu — so you only show up for the right searches.",
    usual: 4000,
    today: 800,
  },
  {
    icon: PenLine,
    title: "Clinic Ad Copy Templates",
    short: "Ad Templates",
    tag: "Copy & paste",
    desc: "Fill-in-the-blank ads that make patients call or WhatsApp you — not just click and leave.",
    usual: 4000,
    today: 800,
  },
  {
    icon: MapPin,
    title: "Local Targeting & Budget Blueprint",
    short: "Budget Blueprint",
    tag: "Small budget",
    desc: "Show your ads only near your clinic and start with a small daily budget — so not a single rupee goes to clicks from other cities.",
    usual: 4000,
    today: 800,
  },
  {
    icon: PhoneCall,
    title: "Call & WhatsApp Tracking Setup",
    short: "Call Tracking",
    tag: "Know what works",
    desc: "See exactly which ads bring calls and WhatsApp messages, so you keep what works and switch off what doesn't.",
    usual: 3500,
    today: 700,
  },
  {
    icon: ClipboardCheck,
    title: "Weekly Optimisation Checklist",
    short: "Weekly Checklist",
    tag: "15 min / week",
    desc: "A simple weekly checklist to keep costs down and patient inquiries up — without becoming a Google Ads expert.",
    usual: 3500,
    today: 700,
  },
];
/** Mini MBA for Your Business — the strategy-call downsell. Today's prices add up to FULL_PRICE. */
const DIY_COMPONENTS: typeof COMPONENTS = [
  {
    icon: Search,
    title: "Google Ads for Local Businesses",
    short: "Google Ads",
    tag: "Step-by-step",
    desc: "Set up and run Google Ads yourself so people in your city who are searching for your service right now find you first.",
    usual: 6000,
    today: 1200,
  },
  {
    icon: Megaphone,
    title: "Advanced Meta Ads Playbook",
    short: "Meta Ads Pro",
    tag: "Scale what works",
    desc: "Go beyond boosting posts: retargeting, lead ads and scaling the Facebook & Instagram ads that bring paying clients.",
    usual: 4000,
    today: 800,
  },
  {
    icon: Workflow,
    title: "Funnels & Landing Pages",
    short: "Funnels",
    tag: "Turn clicks into leads",
    desc: "Build simple pages that turn ad clicks into WhatsApp inquiries and bookings — without a developer.",
    usual: 4000,
    today: 800,
  },
  {
    icon: Bot,
    title: "WhatsApp Automation & CRM",
    short: "Automation",
    tag: "No lead forgotten",
    desc: "Automate replies, reminders and follow-ups so every inquiry gets handled — even when you're busy.",
    usual: 4000,
    today: 800,
  },
  {
    icon: LineChart,
    title: "Tracking & Numbers For Owners",
    short: "Tracking",
    tag: "Know your numbers",
    desc: "See which ads, pages and messages bring clients and what each client costs you — so you spend only on what works.",
    usual: 3500,
    today: 700,
  },
  {
    icon: ClipboardCheck,
    title: "Growth Strategy & Scaling Plan",
    short: "Growth Plan",
    tag: "Think like a CEO",
    desc: "Pricing, offers, repeat business and referrals — the business side of growth that turns marketing into profit.",
    usual: 3500,
    today: 700,
  },
];
const TOTAL_VALUE = COMPONENTS.reduce((s, c) => s + c.usual, 0);
const pctOff = (usual: number, today: number) => Math.round((1 - today / usual) * 100);

const BENEFITS: { strong: string; rest: string }[] = [
  {
    strong: "Get patients who are searching for your specialty right now",
    rest: " — not months from now",
  },
  {
    strong: "Show up at the top of Google",
    rest: ' when someone types "your specialty near me" in your city',
  },
  { strong: "Run it yourself", rest: " — no agency, no monthly management fee, ever" },
  { strong: "Only pay for people near your clinic", rest: ", not clicks from other cities" },
  {
    strong: "Start with a small daily budget",
    rest: " and stop wasting money on the wrong searches",
  },
  { strong: "Know exactly which ads bring calls and WhatsApp messages", rest: " — no guesswork" },
  {
    strong: "Stack it with your Authority System:",
    rest: " they search, they find you, and they already trust your name",
  },
  { strong: "Keep full control of your budget and your patients", rest: " — forever" },
];

const DIY_TESTIMONIALS = [
  { image: drManalReview.url, name: "Masterclass Student", place: "Lahore" },
  { image: drJasimReview.url, name: "Masterclass Student", place: "Peshawar" },
  { image: drMehwishReview.url, name: "Masterclass Student", place: "Pakistan" },
];

const TESTIMONIALS = [
  { image: drManalReview.url, name: "Dr. Manal Fatimah", place: "Lahore" },
  { image: drJasimReview.url, name: "Dr. Jasim Mumtaz", place: "Peshawar" },
  { image: drMehwishReview.url, name: "Dr. Mehwish Rasheed", place: "Pakistan" },
];

function pkr(n: number) {
  return `PKR ${n.toLocaleString()}`;
}

function getLeadId(variant: OtoVariant): string | null {
  try {
    return (
      new URL(window.location.href).searchParams.get("lead") ||
      localStorage.getItem(variant === "diy" ? "cgm_last_lead" : "authority_last_lead")
    );
  } catch {
    return null;
  }
}

/** Strategy-call applicants who were close to qualifying ("almost") also see the paid 1:1 option. */
function getTier(): string | null {
  try {
    return new URL(window.location.href).searchParams.get("t");
  } catch {
    return null;
  }
}

const DIY_BENEFITS: { strong: string; rest: string }[] = [
  {
    strong: "Show up at the top of Google in your city",
    rest: ' — when someone searches for your service "near me"',
  },
  {
    strong: "Get clients who are searching for your service right now",
    rest: " — not months from now",
  },
  { strong: "Learn the advanced techniques agencies use", rest: " — Google Ads, advanced Meta Ads, funnels and automation" },
  { strong: "Do it yourself, step by step", rest: " — no agency and no monthly management fee, ever" },
  {
    strong: "Know your numbers like a CEO",
    rest: " — what each client costs you and which ads actually make money",
  },
  { strong: "Automate your follow-up on WhatsApp", rest: " so no inquiry slips through the cracks" },
  {
    strong: "Take your Business Growth Masterclass to the next level",
    rest: " — this is the advanced part of the system",
  },
  { strong: "Keep full control of your budget and your clients", rest: " — forever" },
];

/* ---------- Visuals (brand teal #3AA8B4 → blue #326CA1, leaf green #95C05B) ---------- */

function MiniCard({ c, className = "" }: { c: (typeof COMPONENTS)[number]; className?: string }) {
  const Icon = c.icon;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3AA8B4] to-[#326CA1] p-3 text-white shadow-[0_15px_40px_rgba(0,0,0,0.45)] ring-2 ring-[#9fe0e6]/50 ${className}`}
    >
      <div className="absolute -right-6 -top-6 size-16 rounded-full bg-white/15" />
      <div className="grid size-8 place-items-center rounded-lg bg-white/20">
        <Icon className="size-4" />
      </div>
      <div className="mt-2 text-[11px] font-black leading-tight sm:text-xs">{c.short}</div>
      <div className="mt-2 inline-block rounded bg-white px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#326CA1]">
        {c.tag}
      </div>
    </div>
  );
}

/** Product bundle collage: Farhan in the centre, component cards fanned around. */
function BundleVisual({
  size = "lg",
  dark = false,
  comps = COMPONENTS,
  line1 = "Google Ads",
  line2 = "for Clinics",
}: {
  size?: "lg" | "sm";
  dark?: boolean;
  comps?: typeof COMPONENTS;
  line1?: string;
  line2?: string;
}) {
  const sm = size === "sm";
  return (
    <div className={`relative mx-auto ${sm ? "max-w-sm" : "max-w-3xl"}`}>
      <div
        className={`text-center font-black leading-none ${dark ? "text-white" : "text-slate-950"} ${sm ? "text-2xl" : "text-4xl md:text-6xl"}`}
      >
        {line1}
      </div>
      <div
        className={`text-center font-black leading-none ${dark ? "text-yellow-300" : "text-sky-600"} ${sm ? "text-2xl" : "text-4xl md:text-6xl"}`}
      >
        {line2}
      </div>
      <div className={`mt-6 flex items-end justify-center ${sm ? "gap-1" : "gap-1.5 sm:gap-3"}`}>
        <MiniCard
          c={comps[0]}
          className={`${sm ? "w-16" : "w-16 sm:w-28"} -rotate-12 translate-y-4`}
        />
        <MiniCard c={comps[1]} className={`${sm ? "w-16" : "w-16 sm:w-28"} -rotate-6`} />
        <div
          className={`relative z-10 overflow-hidden rounded-2xl bg-[#0f2a44] shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-2 ring-[#5fd3dc] ${sm ? "w-24" : "w-24 sm:w-40"}`}
        >
          <img
            src={farhanInstructor.url}
            alt="Farhan Ali"
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f2a44] via-[#0f2a44]/90 to-transparent p-2 pt-6 text-center">
            <div className="text-[10px] font-black leading-tight text-white sm:text-xs">
              Taught by Farhan Ali
            </div>
            <div className="mt-1 inline-block rounded bg-[#95C05B] px-1.5 py-0.5 text-[8px] font-black uppercase text-[#0f2a44]">
              Step by step
            </div>
          </div>
        </div>
        <MiniCard c={comps[2]} className={`${sm ? "w-16" : "w-16 sm:w-28"} rotate-6`} />
        <MiniCard
          c={comps[4]}
          className={`${sm ? "w-16" : "w-16 sm:w-28"} rotate-12 translate-y-4`}
        />
      </div>
    </div>
  );
}

function Testimonials({
  heading,
  items = TESTIMONIALS,
}: {
  heading: React.ReactNode;
  items?: typeof TESTIMONIALS;
}) {
  return (
    <section className="hero-bg px-4 py-14 md:py-20">
      <h2 className="mx-auto max-w-4xl text-center text-2xl font-black leading-tight text-white md:text-4xl">
        {heading}
      </h2>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
        {items.map((t) => (
          <div
            key={t.image}
            className="overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10"
          >
            <div className="bg-black/20 p-3">
              <img
                src={t.image}
                alt={`WhatsApp feedback from ${t.name}`}
                loading="lazy"
                className="h-72 w-full rounded-xl object-contain"
              />
            </div>
            <div className="p-4">
              <div className="font-black text-white">{t.name}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/40">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Verified WhatsApp feedback
              </div>
              <div className="mt-2 text-xs text-white/50">{t.place}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AuthorityOto({ variant }: { variant: OtoVariant }) {
  const navigate = useNavigate();
  const isDiy = variant === "diy";
  const PRODUCT = isDiy ? DIY_PRODUCT_NAME : PRODUCT_NAME;
  const price = variant === "downsell" ? DOWNSELL_PRICE : FULL_PRICE;
  const thankYouPath = isDiy ? "/thank-you" : "/authority-thank-you";
  const comps = isDiy ? DIY_COMPONENTS : COMPONENTS;
  const totalValue = comps.reduce((sum, c) => sum + c.usual, 0);
  const bundle = isDiy
    ? { comps, line1: "Mini MBA", line2: "for Your Business" }
    : { comps };
  const [leadId, setLeadId] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  // DIY downsell: checkout is always visible on the page (no extra click needed).
  const [showPay, setShowPay] = useState(variant === "diy");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [method, setMethod] = useState<PayMethod>("easypaisa");
  const [preview, setPreview] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [reading, setReading] = useState<ScreenshotReading | null>(null);
  const [failedChecks, setFailedChecks] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const verifyRef = useRef<Promise<ScreenshotReading> | null>(null);
  const uploadRef = useRef<Promise<string | null> | null>(null);
  const pickIdRef = useRef(0);

  // Only buyers coming from checkout see this page.
  useEffect(() => {
    let id = getLeadId(variant);
    if (!id && isDiy && isAdminPreview()) id = PREVIEW_LEAD_ID;
    if (!id) {
      navigate({ to: isDiy ? "/" : "/authority", replace: true });
      return;
    }
    setLeadId(id);
    setTier(getTier());
    preloadOcr();
  }, [navigate, variant, isDiy]);

  const outcome = reading ? evaluateReading(reading, price) : null;
  const blocked = failedChecks >= MAX_FAILED_CHECKS && outcome?.status === "fail";

  function openPayment() {
    setShowPay(true);
    setTimeout(
      () =>
        document.getElementById("oto-pay")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG).");
      return;
    }
    const pickId = ++pickIdRef.current;
    fileRef.current = file;
    setPreview(URL.createObjectURL(file));
    setReading(null);
    setChecking(true);
    const blob = await compressImage(file);
    if (pickId !== pickIdRef.current) return;
    uploadRef.current = uploadScreenshot(blob, `oto-${variant}-${leadId ?? "x"}`);
    verifyRef.current = readPaymentScreenshot(blob);
    const r = await verifyRef.current;
    if (pickId !== pickIdRef.current) return;
    setReading(r);
    setChecking(false);
    if (evaluateReading(r, price).status === "fail") setFailedChecks((n) => n + 1);
    e.target.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !leadId) return;
    if (!fileRef.current || !verifyRef.current) {
      setError("Please upload your payment screenshot first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const r = await verifyRef.current;
    const o = evaluateReading(r, price);
    if (o.status === "fail") {
      setError("This screenshot couldn't be verified — see the message above the button.");
      setSubmitting(false);
      return;
    }
    let url = uploadRef.current ? await uploadRef.current : null;
    if (!url)
      url = await uploadScreenshot(
        await compressImage(fileRef.current),
        `oto-${variant}-${leadId}`,
      );
    if (!url) {
      setError("Failed to upload screenshot. Please check your internet and try again.");
      setSubmitting(false);
      return;
    }
    try {
      await recordAuthorityOto({
        data: {
          leadId,
          offer: variant,
          decision: "accepted",
          payment_method: PAYMENT_ACCOUNTS[method].label,
          screenshot_url: url,
          auto_verified: o.status === "pass",
        },
      });
    } catch (err) {
      console.error("OTO save failed", err);
      setError(
        "Your screenshot was uploaded, but we couldn't save your order. Please press submit again.",
      );
      setSubmitting(false);
      return;
    }
    try {
      fbqTrack("Purchase", {
        value: price,
        currency: "PKR",
        content_name: `${PRODUCT} (${variant === "upsell" ? "OTO" : variant === "diy" ? "Strategy-call downsell" : "Downsell"})`,
      });
    } catch {}
    navigate({ to: thankYouPath, search: { lead: leadId }, replace: true });
  }

  async function onDecline() {
    if (!leadId || declining) return;
    setDeclining(true);
    if (variant === "upsell") {
      navigate({ to: "/authority-downsell", search: { lead: leadId }, replace: true });
      return;
    }
    try {
      await Promise.race([
        recordAuthorityOto({
          data: { leadId, offer: isDiy ? "diy" : "downsell", decision: "declined" },
        }),
        new Promise((r) => setTimeout(r, 3000)),
      ]);
    } catch (err) {
      console.error("Decline save failed", err);
    }
    navigate({ to: thankYouPath, search: { lead: leadId }, replace: true });
  }

  if (!leadId) {
    return (
      <div className="grid min-h-screen place-items-center bg-sky-50 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  const yesLabel =
    variant === "upsell"
      ? "YES! I Want Patients Who Are Searching For Me"
      : isDiy
        ? "YES! I Want The Mini MBA For My Business"
        : `YES – I Want To Try It ALL First For Just ${pkr(DOWNSELL_PRICE)}`;
  const yesSub =
    variant === "downsell"
      ? `Then ${pkr(PAY_LATER)} in ${PAY_LATER_DAYS} days — only if you love it`
      : `One-time payment of ${pkr(FULL_PRICE)} · Easypaisa / JazzCash${isDiy ? " · No monthly fees" : ""}`;
  const noLabel =
    variant === "upsell"
      ? "No thanks Farhan, I'll figure out Google on my own."
      : isDiy
        ? "No thanks, take me to my masterclass confirmation page."
        : "No thanks Farhan, I'll pass on this too.";

  const YesButton = () => (
    <div className="mx-auto max-w-xl text-center">
      <button
        type="button"
        onClick={openPayment}
        className="btn-cta block w-full px-5 py-4 text-center"
      >
        <span className="inline-flex items-center justify-center gap-1.5 text-base md:text-lg">
          {yesLabel} <ChevronsRight className="size-5 shrink-0" />
        </span>
        <span className="mt-1 block text-xs font-medium normal-case tracking-normal opacity-95">
          {yesSub}
        </span>
      </button>
    </div>
  );
  const NoLink = ({ dark = false }: { dark?: boolean }) => (
    <button
      type="button"
      onClick={onDecline}
      disabled={declining}
      className={`mx-auto mt-4 flex items-center justify-center gap-1.5 text-center text-xs underline underline-offset-4 md:text-sm ${dark ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}
    >
      <X className="size-3.5 text-red-500" />
      {declining ? "One moment…" : noLabel}
    </button>
  );
  const Cta = ({ dark = false }: { dark?: boolean }) => (
    <div className="px-4">
      <YesButton />
      <NoLink dark={dark} />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-sky-50 text-slate-900">
      {/* Top bar — same as the checkout page */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2.5 text-center text-xs font-bold text-white sm:text-sm">
        <AlertTriangle className="size-4 shrink-0 text-amber-300" />
        {variant === "upsell" ? (
          <span>
            <span className="text-amber-300">WAIT</span> — Don't close this page. Read this while we
            verify your payment…
          </span>
        ) : isDiy && tier === "declined" ? (
          <span>
            <span className="text-amber-300">WAIT</span> — before you go to your confirmation page,
            read this…
          </span>
        ) : isDiy ? (
          <span>
            <span className="text-amber-300">Thank you for your answers</span> — here's the best
            next step for your business right now…
          </span>
        ) : (
          <span>
            <span className="text-amber-300">WAIT</span> — I really want you getting patients from
            Google from week 1…
          </span>
        )}
      </div>

      {variant !== "downsell" ? (
        <>
          {isDiy && tier === "declined" ? (
            <section className="hero-bg px-4 pb-12 pt-10 text-center text-white md:pt-14">
              <div className="mx-auto w-fit rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-300 ring-1 ring-white/20">
                Prefer to do it yourself?
              </div>
              <h1 className="mx-auto mt-5 max-w-4xl text-2xl font-black leading-tight md:text-5xl md:leading-[1.1]">
                Okay — If You'd Rather Do It Yourself,{" "}
                <span className="gradient-highlight">
                  Get The Mini MBA For Your Business
                </span>{" "}
                And Learn The Advanced Digital Marketing Agencies Use — For Just {pkr(FULL_PRICE)}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/80 md:text-lg">
                No agency. No monthly fees. In <span className="font-bold text-white">{PRODUCT}</span>{" "}
                I show you, step by step, the advanced techniques — Google Ads, advanced Meta Ads,
                funnels, automation and your numbers — so people near you who are searching for your
                service <i>right now</i> find you and contact you first. One-time payment of{" "}
                <span className="font-bold text-yellow-300">{pkr(FULL_PRICE)}</span>.
              </p>
              <div className="mt-7">
                <Cta dark />
              </div>
            </section>
          ) : isDiy ? (
            <section className="hero-bg px-4 pb-12 pt-10 text-center text-white md:pt-14">
              <div className="mx-auto w-fit rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-300 ring-1 ring-white/20">
                Your recommended path: Do It Yourself
              </div>
              <h1 className="mx-auto mt-5 max-w-4xl text-2xl font-black leading-tight md:text-5xl md:leading-[1.1]">
                Based On Your Answers, You Don't Need An Agency Yet —{" "}
                <span className="gradient-highlight">
                  Here's How To Grow Your Business Like A Pro, Yourself
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/80 md:text-lg">
                Done-for-you is a fit for businesses that are ready for a monthly team and ad budget.
                Right now, the faster and smarter path for you is{" "}
                <span className="font-bold text-white">{PRODUCT}</span> — advanced digital
                marketing, step by step: Google Ads, advanced Meta Ads, funnels, automation and
                the numbers behind growth, for a{" "}
                <span className="font-bold text-yellow-300">one-time {pkr(FULL_PRICE)}</span>. No
                agency. No monthly fees.
              </p>
              <div className="mt-7">
                <Cta dark />
              </div>
            </section>
          ) : (
          <section className="hero-bg px-4 pb-12 pt-10 text-center text-white md:pt-14">
            <h1 className="mx-auto max-w-4xl text-2xl font-black leading-tight md:text-5xl md:leading-[1.1]">
              Instead Of Waiting Months For Your City To Notice You,{" "}
              <span className="gradient-highlight">
                Let Me Show You How To Put Your Clinic At The Top Of Google
              </span>{" "}
              — So Patients Who Are Searching <i>Right Now</i> Call You First…
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/80 md:text-lg">
              Add <span className="font-bold text-white">{PRODUCT}</span> to your{" "}
              <span className="font-bold text-yellow-300">Doctor Authority System™</span> and go
              from "patients will remember me someday" to "patients are calling me this week."
            </p>
            <div className="mt-7">
              <Cta dark />
            </div>
          </section>
          )}

          {isDiy && tier === "almost" && (
            <section className="bg-amber-50 px-4 py-8">
              <div className="mx-auto max-w-2xl rounded-2xl border-2 border-amber-200 bg-white p-6 text-center shadow-sm">
                <div className="text-xs font-black uppercase tracking-wider text-amber-700">
                  Prefer personal guidance?
                </div>
                <h2 className="mt-2 text-lg font-black text-slate-900 md:text-xl">
                  Book a 1:1 Business Growth Session With Farhan — {pkr(5000)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your business is close to being a fit for our done-for-you service. If you'd like
                  Farhan to look at your business personally and give you a step-by-step plan you
                  can implement with your own team, book a paid 1:1 session on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent("Assalam-o-Alaikum, I'd like to book the PKR 5,000 1:1 Business Growth Session with Farhan.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => fbqTrack("Lead", { content_name: "1:1 Session Interest" })}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  <MessageCircle className="size-4" /> Book my 1:1 session on WhatsApp
                </a>
              </div>
            </section>
          )}

          {/* BUNDLE + BENEFITS */}
          <section className="bg-white px-4 py-12 text-center md:py-16">
            <h2 className="text-xl font-black md:text-3xl">
              {isDiy ? "Here's Everything Inside " : "Add "}
              <span className="gradient-highlight">{PRODUCT}</span>
              {isDiy ? "" : " To Your Order Today"}
            </h2>
            <div className="mt-8">
              <BundleVisual {...bundle} />
            </div>

            <ol className="mx-auto mt-14 max-w-2xl divide-y divide-slate-200 text-left">
              {(isDiy ? DIY_BENEFITS : BENEFITS).map((b, i) => (
                <li key={b.strong} className="flex items-start gap-4 py-5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-black text-sky-700 ring-1 ring-sky-200">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-slate-600 md:text-base">
                    <span className="font-bold text-slate-900">{b.strong}</span>
                    {b.rest}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Cta />
            </div>
          </section>

          <Testimonials
            items={isDiy ? DIY_TESTIMONIALS : TESTIMONIALS}
            heading={
              isDiy ? (
                <>
                  Here's What Students Are Saying After{" "}
                  <span className="text-yellow-400">Learning From Farhan</span>
                </>
              ) : (
                <>
                  Here's What Doctors Are Saying After{" "}
                  <span className="text-yellow-400">Learning From Farhan</span>
                </>
              )
            }
          />

          {/* VALUE STACK */}
          <section className="bg-secondary px-4 py-12 md:py-16">
            <h2 className="mx-auto max-w-4xl text-center text-2xl font-black leading-tight md:text-4xl">
              {isDiy
                ? "Everything You Need To Market Your Business Like A Pro — "
                : "Everything You Need To Run Google Ads For Your Own Clinic — "}
              <span className="gradient-highlight">Without Paying An Agency Every Month</span>
            </h2>
            <p className="mt-4 text-center text-slate-600">
              Here's everything you get for{" "}
              <span className="font-black text-destructive">
                {pctOff(totalValue, FULL_PRICE)}% OFF
              </span>
              …
            </p>
            <div className="mt-8">
              <Cta />
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comps.map((c) => (
                <div
                  key={c.title}
                  className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm"
                >
                  <MiniCard c={c} className="w-32" />
                  <h3 className="mt-5 text-lg font-black leading-tight">
                    Get The <span className="text-sky-600">{c.title}</span>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{c.desc}</p>
                  <p className="mt-4 text-sm font-bold text-slate-700">
                    Usually goes for {pkr(c.usual)}…
                  </p>
                  <p className="text-sm font-black">
                    Yours today for just{" "}
                    <span className="text-emerald-600">
                      {pkr(c.today)} ({pctOff(c.usual, c.today)}% off)
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="hero-bg mx-auto mt-12 max-w-md rounded-2xl p-6 text-center text-white shadow-2xl">
              <BundleVisual size="sm" dark {...bundle} />
              <div className="mt-6 text-lg font-bold">
                TOTAL VALUE:{" "}
                <span className="line-through decoration-red-500">{pkr(totalValue)}</span>
              </div>
              <div className="mt-1 text-2xl font-black md:text-3xl">
                Today: <span className="text-yellow-300">Just {pkr(FULL_PRICE)}</span>{" "}
                <span className="text-white/80">({pctOff(totalValue, FULL_PRICE)}% OFF)</span>
              </div>
            </div>
            {!showPay && (
              <div className="mt-8">
                <Cta />
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* DOWNSELL HERO */}
          <section className="hero-bg px-4 pb-12 pt-10 text-center text-white md:pt-14">
            <h1 className="mx-auto max-w-3xl text-2xl font-black leading-tight md:text-4xl">
              So Let's Meet Halfway –{" "}
              <span className="gradient-highlight">
                Get Everything For Just {pkr(DOWNSELL_PRICE)} Today…
              </span>{" "}
              And Then In 2 Weeks, <i>If You're Absolutely Thrilled With It,</i> Send The Remaining{" "}
              {pkr(PAY_LATER)}…
            </h1>
            <div className="mt-6 text-3xl font-black text-yellow-300 md:text-4xl">Fair?</div>
            <div className="mt-6">
              <Cta dark />
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="bg-white px-4 py-12 text-center md:py-16">
            <h2 className="text-2xl font-bold md:text-4xl">
              Here's how <span className="font-black">it works</span>
            </h2>
            <p className="mt-5 text-slate-700">
              Pay <span className="font-bold text-destructive">{pkr(DOWNSELL_PRICE)} today</span> —
              for {PRODUCT}…
            </p>
            <p className="mt-3 text-slate-700">
              …and I'll give you <i>everything</i>{" "}
              <span className="font-bold text-destructive underline">right now.</span>
            </p>

            <div className="hero-bg mx-auto mt-10 max-w-lg rounded-2xl p-6 text-left text-white shadow-2xl md:p-8">
              <div className="mx-auto w-fit rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0b1735]">
                ⚡ The "maybe" option
              </div>
              <div className="mt-4 text-center text-3xl font-black">
                Pay today — <span className="text-yellow-300">just {pkr(DOWNSELL_PRICE)}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {COMPONENTS.map((c) => (
                  <li key={c.title} className="flex items-start gap-2 text-sm text-white/90">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 text-slate-700">
              Go through it. Use it. See if it's as good as I say it is.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-center md:grid-cols-2">
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                <div className="text-xl">
                  If you <span className="font-black text-emerald-700">love it</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Send the{" "}
                  <span className="font-bold text-slate-900">remaining {pkr(PAY_LATER)}</span> on
                  Easypaisa or JazzCash{" "}
                  <span className="font-bold text-emerald-700">within {PAY_LATER_DAYS} days</span>.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-6">
                <div className="text-xl">
                  If you <span className="font-black text-sky-700">don't</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  <span className="font-bold text-sky-700">You keep everything.</span> The
                  walkthrough, the keyword vault, the ad templates — all yours.{" "}
                  <span className="font-bold text-slate-900">No second payment. No questions.</span>
                </p>
              </div>
            </div>
          </section>

          <section className="bg-secondary px-4 py-12 text-center md:py-16">
            <h2 className="text-3xl font-black md:text-5xl">
              That's it. No risk. <span className="gradient-highlight">Just a maybe.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-slate-600 md:text-base">
              So the real question isn't{" "}
              <i>"should I invest {pkr(FULL_PRICE)} in Google Ads right now?"</i>
              <br />
              <span className="font-bold text-slate-900">
                The real question you should be asking yourself is:
              </span>
            </p>
            <div className="hero-bg mx-auto mt-8 max-w-lg rounded-2xl p-8 text-white shadow-2xl">
              <p className="text-2xl font-black leading-tight md:text-3xl">
                "How can I want{" "}
                <span className="text-yellow-300">patients who are searching for me on Google</span>{" "}
                this week…
                <br />
                <br />
                and NOT take this deal?"
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-lg space-y-4 text-left text-sm text-slate-700 md:text-base">
              <p className="font-bold text-slate-900">
                You already said yes to becoming the doctor your city remembers…
              </p>
              <p className="font-bold text-slate-900">
                This is how{" "}
                <span className="text-destructive">patients who are searching right now</span> find
                you first — <i>without waiting months for it.</i>
              </p>
              <p>If there's even a maybe — that's exactly what this was built for.</p>
              <p className="font-bold text-sky-700">Pay just {pkr(DOWNSELL_PRICE)} today.</p>
              <p>Get everything now.</p>
              <p>Use it…</p>
              <p>
                Then decide in <span className="font-bold underline">{PAY_LATER_DAYS} days</span> if
                it was worth it…
              </p>
              <p>You keep everything either way.</p>
              <p>If that's not a no-brainer fair deal, then I don't know what is…</p>
            </div>
          </section>

          <Testimonials
            heading={
              <>
                Here's What Doctors Are Saying{" "}
                <span className="text-yellow-400">After Learning From Farhan</span>
              </>
            }
          />
          {!showPay && (
            <section className="bg-white py-12">
              <Cta />
            </section>
          )}
        </>
      )}

      {showPay && (
        <section id="oto-pay" className="scroll-mt-4 bg-sky-50 px-4 py-12 md:py-16">
          <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5">
            <div className="text-center">
              <ArrowDown className="mx-auto size-6 text-sky-600" />
              <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                {isDiy ? `Get ${PRODUCT} — Checkout` : `Complete Your ${PRODUCT} Order`}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Send <span className="font-bold">{pkr(price)}</span>, then upload the screenshot
                below.
              </p>
            </div>

            {isDiy && (
              <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                <h3 className="font-black text-slate-900">How to pay (takes 2 minutes)</h3>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
                  <li>
                    <span className="font-bold">1.</span> Open your <b>Easypaisa</b> or <b>JazzCash</b>{" "}
                    app (or any bank app).
                  </li>
                  <li>
                    <span className="font-bold">2.</span> Send <b>{pkr(price)}</b> to{" "}
                    <b>{PAYMENT_ACCOUNTS[method].account}</b> — account name{" "}
                    <b>{PAYMENT_ACCOUNTS[method].name}</b>.
                  </li>
                  <li>
                    <span className="font-bold">3.</span> Take a <b>screenshot</b> of the payment
                    confirmation screen (it must show the amount and receiver name).
                  </li>
                  <li>
                    <span className="font-bold">4.</span> <b>Upload the screenshot below</b> and tap{" "}
                    <b>Submit</b>. Our team will send your course access within a few minutes.
                  </li>
                </ol>
              </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-black text-slate-900">1. Send {pkr(price)}</h3>
              <div className="relative mt-3">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PayMethod)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="easypaisa">📱 Easypaisa</option>
                  <option value="jazzcash">📲 JazzCash</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              </div>
              <div className="mt-4 space-y-2 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Account Name</span>
                  <span className="font-bold">{PAYMENT_ACCOUNTS[method].name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Account Number</span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold tracking-wider">
                      {PAYMENT_ACCOUNTS[method].account}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(PAYMENT_ACCOUNTS[method].account).then(
                          () => {
                            setCopiedNumber(true);
                            setTimeout(() => setCopiedNumber(false), 2000);
                          },
                          () => {},
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-sky-300 bg-white px-2 py-1 text-xs font-bold text-sky-700 hover:bg-sky-100"
                    >
                      <Copy className="size-3.5" /> {copiedNumber ? "Copied!" : "Copy"}
                    </button>
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-black text-[#326CA1]">{pkr(price)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-black text-slate-900">
                <ImageIcon className="size-4 text-sky-600" /> 2. Upload Payment Screenshot
              </h3>
              <label
                htmlFor="oto-screenshot"
                className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-sky-400 hover:bg-sky-50"
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Payment screenshot preview"
                      className="max-h-44 rounded-lg border border-slate-200"
                    />
                    <span className="text-xs text-slate-500">Tap to change</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-7 text-sky-600" />
                    <span className="text-sm font-bold text-slate-800">
                      Tap to upload screenshot
                    </span>
                    <span className="text-xs text-slate-500">
                      Show the amount and receiver (Farhan Ali Rasheed)
                    </span>
                  </>
                )}
                <input
                  id="oto-screenshot"
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  className="sr-only"
                />
              </label>

              {checking && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-800">
                  <Loader2 className="size-4 animate-spin" /> Checking your payment screenshot…
                </div>
              )}
              {!checking && outcome?.status === "pass" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="size-4" /> Payment screenshot verified — {pkr(price)} to
                  Farhan Ali Rasheed.
                </div>
              )}
              {!checking && outcome?.status === "fail" && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
                  <div className="flex items-start gap-2 font-bold">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" /> We couldn't verify this
                    screenshot.
                  </div>
                  <p className="mt-1 pl-6 text-xs leading-5">
                    {outcome.reason === "amount"
                      ? `The amount doesn't match ${pkr(price)}. Please upload the screenshot of your ${pkr(price)} payment.`
                      : outcome.reason === "payee"
                        ? "We couldn't see the receiver name (Farhan Ali Rasheed) or account number (03135944817). Please upload the full confirmation screen."
                        : `Please upload the confirmation screen showing ${pkr(price)} sent to Farhan Ali Rasheed (03135944817).`}
                  </p>
                  {blocked && (
                    <a
                      href={`https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent(`Assalam-o-Alaikum, I paid ${pkr(price)} for ${PRODUCT} but my screenshot isn't being accepted. I'll send it here.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-6 mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <MessageCircle className="size-4" /> Already paid? Send it to us on WhatsApp
                    </a>
                  )}
                </div>
              )}
              {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
            </section>

            <button
              type="submit"
              disabled={submitting || checking}
              className="btn-cta w-full px-5 py-4 text-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="inline-flex items-center justify-center gap-2 text-base md:text-lg">
                {submitting
                  ? "SUBMITTING…"
                  : checking
                    ? "CHECKING SCREENSHOT…"
                    : `Submit & ${isDiy ? "Get" : "Add"} ${PRODUCT}`}
                <ArrowRight className="btn-cta-arrow size-5" />
              </span>
            </button>
            <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="size-3.5" /> Your order is recorded securely for our team to verify.
            </p>
            <NoLink dark={false} />
          </form>
        </section>
      )}

      <Footer />
    </div>
  );
}
