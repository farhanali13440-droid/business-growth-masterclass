import { createFileRoute, useNavigate } from "@tanstack/react-router";
import productStack from "@/assets/doctor-authority-product-stack.png.asset.json";

import bumpPromptsImg from "@/assets/bump-prompts.png.asset.json";
import { useMemo, useState, useEffect, useRef } from "react";
import { Footer } from "@/components/site/Footer";
import { PROOFS } from "@/components/site/ProofGallery";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  CreditCard,
  Upload,
  ImageIcon,
  Check,
  Gift,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fbqTrack } from "@/lib/fbpixel";
import { createScreenshotSignedUrl } from "@/lib/payment-screenshot.functions";
import { preloadOcr, readPaymentScreenshot } from "@/lib/payment-ocr";
import { evaluateReading, type ScreenshotReading } from "@/lib/payment-verify";

/** Shrink phone screenshots (often 3–5 MB) to a ~200 KB JPEG so upload + verification are fast. */
async function compressImage(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

const SUPPORT_WA = "923135944817";
const MAX_FAILED_CHECKS = 2;

type OrderSearch = {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
};

function pickStr(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return undefined;
}

export const Route = createFileRoute("/authority-order")({
  validateSearch: (search: Record<string, unknown>): OrderSearch => ({
    name: pickStr(search.name, search.full_name, search.fullname),
    email: pickStr(search.email),
    phone: pickStr(search.phone, search.whatsapp, search.mobile),
    specialty: pickStr(search.specialty, search.speciality, search.field),
  }),
  head: () => ({
    meta: [
      { title: "Checkout — Doctor Local Authority System™" },
      {
        name: "description",
        content:
          "Complete your order for the Doctor Local Authority System™ and start building local authority around your name.",
      },
    ],
  }),
  component: OrderPage,
});

type Bump = {
  id: "prompts";
  title: string;
  shortTitle: string;
  price: number;
  badge: string;
  image: string;
  checkboxHeadline: string;
  description: string;
};

const BUMPS: readonly Bump[] = [
  {
    id: "prompts",
    title: "AI Prompt Vault for Doctors & Clinics",
    shortTitle: "AI Prompt Vault",
    price: 699,
    badge: "Recommended Add-On",
    image: bumpPromptsImg.url,
    checkboxHeadline: "Yes! Add the AI Prompt Vault to My Order",
    description:
      "Create clinic ads, video scripts, social posts, WhatsApp messages and website copy in minutes using ready-to-use AI prompts designed for doctors.",
  },
] as const;

const INCLUDED_ITEMS: { label: string; highlight?: boolean }[] = [
  { label: "The Doctor Local Authority System™" },
  { label: "Authority Positioning" },
  { label: "Local Reach Method" },
  { label: "The Visibility Accelerator" },
  { label: "The Trust Bridge" },
  { label: "The Authority Content Formula" },
  { label: "Appointment Conversion Flow" },
  { label: "The Weekly Authority Routine" },
  { label: "5 Implementation Bonuses", highlight: true },
  { label: "30-Day Authority Content Calendar" },
  { label: "Trust Bridge Launch Kit" },
  { label: "Visibility Accelerator Swipe File" },
  { label: "Patient Trust & Social Proof Kit" },
  { label: "90-Day Local Authority Roadmap" },
];

const PAYMENT_ACCOUNTS = {
  easypaisa: { label: "Easypaisa", name: "Farhan Ali Rasheed", account: "03135944817" },
  jazzcash: { label: "JazzCash", name: "Farhan Ali Rasheed", account: "03135944817" },
} as const;
type PayMethod = keyof typeof PAYMENT_ACCOUNTS;

const MAIN_PRODUCT = { title: "Doctor Local Authority System™", price: 999 };

const SHOW_ORDER_BUMPS = true;

function OrderPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const ghlName = (search.name ?? "").trim();
  const ghlEmail = (search.email ?? "").trim().toLowerCase();
  const ghlPhone = (search.phone ?? "").trim();
  const ghlSpecialty = (search.specialty ?? "").trim();
  const hasGhlContact = !!(ghlName && ghlEmail && ghlPhone);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (hasGhlContact) {
        sessionStorage.setItem(
          "ghl_lead",
          JSON.stringify({
            name: ghlName,
            email: ghlEmail,
            phone: ghlPhone,
            specialty: ghlSpecialty,
          }),
        );
      }
    } catch {
      /* ignore */
    }
  }, [hasGhlContact, ghlName, ghlEmail, ghlPhone, ghlSpecialty]);

  function getLead() {
    if (hasGhlContact) {
      return {
        full_name: ghlName,
        email: ghlEmail,
        whatsapp: ghlPhone,
        specialty: ghlSpecialty || undefined,
        source: "GHL Opt-In",
      };
    }
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("ghl_lead");
        if (raw) {
          const p = JSON.parse(raw) as {
            name?: string;
            email?: string;
            phone?: string;
            specialty?: string;
          };
          if (p.name && p.email && p.phone) {
            return {
              full_name: p.name,
              email: p.email.toLowerCase(),
              whatsapp: p.phone,
              specialty: p.specialty || undefined,
              source: "GHL Opt-In",
            };
          }
        }
      } catch {
        /* ignore */
      }
    }
    return null;
  }

  const [bumps, setBumps] = useState<Record<string, boolean>>({});
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("easypaisa");
  const [submitting, setSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const purchaseFiredRef = useRef(false);

  // Screenshot verification + background upload, both started the moment a file is picked.
  const [checking, setChecking] = useState(false);
  const [reading, setReading] = useState<ScreenshotReading | null>(null);
  const [failedChecks, setFailedChecks] = useState(0);
  const verifyRef = useRef<Promise<ScreenshotReading> | null>(null);
  const uploadRef = useRef<Promise<string | null> | null>(null);
  const pickIdRef = useRef(0);

  useEffect(() => {
    fbqTrack("InitiateCheckout", { value: MAIN_PRODUCT.price, currency: "PKR" });
    // Warm up the free in-browser screenshot reader while the buyer is making the payment.
    preloadOcr();
  }, []);

  const items = useMemo(() => {
    const list: { id: string; title: string; price: number; qty: number }[] = [
      { id: "main", title: MAIN_PRODUCT.title, price: MAIN_PRODUCT.price, qty: 1 },
    ];
    if (SHOW_ORDER_BUMPS) {
      for (const b of BUMPS) {
        if (bumps[b.id]) list.push({ id: b.id, title: b.shortTitle, price: b.price, qty: 1 });
      }
    }
    return list;
  }, [bumps]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Re-evaluated whenever the total changes (e.g. add-on ticked after uploading).
  const outcome = reading ? evaluateReading(reading, total) : null;
  const blocked = failedChecks >= MAX_FAILED_CHECKS && outcome?.status === "fail";

  function uploadInBackground(blob: Blob): Promise<string | null> {
    return (async () => {
      const lead = getLead();
      const safeEmail = (lead?.email ?? "direct").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
      const path = `${Date.now()}-${safeEmail}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });
      if (upErr) throw upErr;
      try {
        const { url } = await createScreenshotSignedUrl({ data: { path } });
        return url;
      } catch (e) {
        console.error("Signed URL creation failed", e);
        return path;
      }
    })().catch((err) => {
      console.error("Screenshot upload failed", err);
      return null;
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setUploadError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Image must be smaller than 15MB.");
      return;
    }
    const pickId = ++pickIdRef.current;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setReading(null);
    setChecking(true);

    const blob = await compressImage(file);
    if (pickId !== pickIdRef.current) return; // a newer file was picked
    uploadRef.current = uploadInBackground(blob);
    verifyRef.current = readPaymentScreenshot(blob);
    const r = await verifyRef.current;
    if (pickId !== pickIdRef.current) return;
    setReading(r);
    setChecking(false);
    if (evaluateReading(r, total).status === "fail") setFailedChecks((n) => n + 1);
    // Let the buyer pick the same file again if they want to retry.
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!screenshot || !verifyRef.current) {
      setUploadError("Please upload your payment screenshot before submitting.");
      return;
    }
    setSubmitting(true);

    // Wait for the check if it's still running (usually already done by now).
    const finalReading = await verifyRef.current;
    const finalOutcome = evaluateReading(finalReading, total);
    if (finalOutcome.status === "fail") {
      setReading(finalReading);
      setUploadError(
        "This screenshot couldn't be verified. Please upload your payment confirmation (see the message below).",
      );
      setSubmitting(false);
      return;
    }

    const selectedBumps = BUMPS.filter((b) => bumps[b.id]).map((b) => ({
      id: b.id,
      title: b.title,
      price: b.price,
    }));

    // Details come from the /authority opt-in form (URL params, kept in sessionStorage).
    const stored = getLead();
    const isDirect = !stored;
    const leadFullName = stored?.full_name ?? "Direct Visitor";
    const leadEmail = stored?.email ?? `direct-${Date.now()}@unknown.local`;
    const leadWhatsapp = stored?.whatsapp ?? "unknown";
    const leadSpecialty = stored?.specialty;
    const leadStatus = isDirect
      ? "Doctor Authority System - Direct Checkout / Missing GHL Details"
      : finalOutcome.status === "unavailable"
        ? "Doctor Authority System - Pending Payment (Not Auto-Verified)"
        : "Doctor Authority System - Pending Payment";

    // Upload started in the background when the file was picked; retry once if it failed.
    let screenshotPath = uploadRef.current ? await uploadRef.current : null;
    if (!screenshotPath) {
      uploadRef.current = uploadInBackground(await compressImage(screenshot));
      screenshotPath = await uploadRef.current;
    }
    if (!screenshotPath) {
      setUploadError("Failed to upload screenshot. Please check your internet and try again.");
      setSubmitting(false);
      return;
    }

    let savedLeadId: string | null = null;
    let savedOrder: { strategy_session_order_bump_selected: unknown } | null = null;
    try {
      const { upsertLead } = await import("@/lib/leads.functions");
      const saved = await upsertLead({
        data: {
          full_name: leadFullName,
          email: leadEmail,
          whatsapp: leadWhatsapp,
          specialty: leadSpecialty,
          selected_order_bumps: selectedBumps,
          total_amount: total,
          payment_method: PAYMENT_ACCOUNTS[paymentMethod].label,
          lead_status: leadStatus,
          payment_screenshot_url: screenshotPath,
        },
      });
      savedLeadId = saved.id;
      savedOrder = saved;
    } catch (err) {
      console.error("Failed to save lead", err);
    }

    if (!savedLeadId || !savedOrder) {
      console.warn("[FINAL CHECKOUT REDIRECT] missing saved order — stopping redirect", {
        savedLeadId,
      });
      setUploadError(
        "Payment proof uploaded, but we couldn't save your order details. Please submit again.",
      );
      setSubmitting(false);
      return;
    }

    if (!purchaseFiredRef.current) {
      purchaseFiredRef.current = true;
      fbqTrack("Purchase", {
        value: total,
        currency: "PKR",
        content_name: MAIN_PRODUCT.title,
      });
      console.log("Meta Pixel Purchase fired after payment screenshot submit");
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("authority_last_lead", savedLeadId);
      }
    } catch {}

    navigate({ to: "/authority-oto", search: { lead: savedLeadId }, replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 overflow-x-hidden max-w-full">
      {/* Top blue bar */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <Lock className="size-3.5 sm:size-4" />
        <span>Secure Checkout • Doctor Local Authority System™</span>
      </div>

      {/* Headline */}
      <div className="px-4 pt-8 pb-6 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          You're One Step Away From{" "}
          <span className="text-sky-600">Becoming the Doctor People Remember</span>
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Complete your order below to get the Doctor Local Authority System™ and start building
          your local authority.
        </p>
      </div>

      <main className="flex-1 px-4 pb-16">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-5 gap-6">
          {/* LEFT */}
          <form className="lg:col-span-3 space-y-5 min-w-0" onSubmit={handleSubmit}>
            {/* Your Order */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 mb-4">
                Your Doctor Authority System™
              </h2>
              <div className="divide-y divide-slate-100">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 text-sm text-slate-700 break-words">{i.title}</div>
                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                      Rs. {i.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Bumps — TEMPORARILY HIDDEN (7-day conversion test). Toggle SHOW_ORDER_BUMPS above to restore. */}
            {SHOW_ORDER_BUMPS && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-base font-black text-slate-900">Upgrade Your Order</h2>
                  <span className="text-xs font-bold uppercase tracking-wide text-sky-600 bg-sky-50 rounded-full px-2 py-0.5">
                    Optional
                  </span>
                </div>
                <div className="space-y-3">
                  {BUMPS.map((b) => {
                    const checked = !!bumps[b.id];
                    return (
                      <label
                        key={b.id}
                        className={`box-border block w-full max-w-full min-w-0 rounded-xl border-2 p-4 cursor-pointer transition ${
                          checked
                            ? "border-orange-500 border-dashed bg-orange-50/70"
                            : "border-slate-200 border-solid hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-3 w-full min-w-0 max-w-full">
                          {/* Checkbox + headline */}
                          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 items-start w-full min-w-0 max-w-full">
                            <div className="mt-0.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  setBumps((s) => ({ ...s, [b.id]: e.target.checked }))
                                }
                                className="sr-only peer"
                              />
                              <span
                                className={`grid place-items-center size-5 rounded border-2 transition ${
                                  checked
                                    ? "bg-orange-500 border-orange-500 text-white"
                                    : "bg-white border-slate-300"
                                }`}
                              >
                                {checked && <Check className="size-3.5" strokeWidth={3} />}
                              </span>
                            </div>
                            <span
                              className="text-sm sm:text-base font-black text-slate-900 leading-snug min-w-0 max-w-full whitespace-normal break-words"
                              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                            >
                              {b.checkboxHeadline}
                            </span>
                          </div>

                          {/* Badge */}
                          <div>
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full max-w-full break-words ${
                                checked ? "bg-orange-500 text-white" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {b.badge}
                            </span>
                          </div>

                          {/* Short description */}
                          <p
                            className="text-xs sm:text-sm text-slate-600 leading-relaxed min-w-0 max-w-full break-words"
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {b.description}
                          </p>

                          {/* Thumbnail */}
                          <div className="w-24 sm:w-28 shrink-0">
                            <img
                              src={b.image}
                              alt={b.title}
                              loading="lazy"
                              className="block w-full h-auto rounded-lg border border-slate-200 bg-slate-50"
                            />
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-lg sm:text-xl font-black text-orange-600">
                              Add for PKR {b.price.toLocaleString()}
                            </span>
                            {checked && (
                              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                                ✓ Added
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Payment Method */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <CreditCard className="size-4 text-sky-600" /> Payment Method
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                Select method, send payment, then upload screenshot below.
              </p>

              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PayMethod)}
                  className="appearance-none w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-11 text-sm font-bold text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 cursor-pointer"
                >
                  <option value="easypaisa">📱 Easypaisa</option>
                  <option value="jazzcash">📲 JazzCash</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              </div>

              <div className="mt-4 rounded-xl bg-sky-50 border border-sky-100 p-4 text-sm space-y-2">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Account Name</span>
                  <span className="font-bold text-slate-900">
                    {PAYMENT_ACCOUNTS[paymentMethod].name}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Account Number</span>
                  <span className="font-bold text-slate-900 tracking-wider">
                    {PAYMENT_ACCOUNTS[paymentMethod].account}
                  </span>
                </div>
              </div>
            </section>

            {/* Screenshot upload */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="size-4 text-sky-600" /> Upload Payment Screenshot
                <span className="text-red-500">*</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Attach the payment confirmation screen showing the amount and receiver (Farhan Ali
                Rasheed). We check it instantly.
              </p>

              <label
                htmlFor="screenshot"
                className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-sky-50 hover:border-sky-400 transition cursor-pointer px-4 py-8 text-center"
              >
                {screenshotPreview ? (
                  <>
                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot preview"
                      className="max-h-44 rounded-lg border border-slate-200"
                    />
                    <span className="text-xs text-slate-500 truncate max-w-full">
                      {screenshot?.name} — tap to change
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="size-7 text-sky-600" />
                    <span className="text-sm font-bold text-slate-800">
                      Tap to upload screenshot
                    </span>
                    <span className="text-xs text-slate-500">PNG or JPG</span>
                  </>
                )}
                <input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {uploadError && (
                <p className="mt-3 text-xs font-semibold text-red-600">{uploadError}</p>
              )}

              {checking && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-800">
                  <Loader2 className="size-4 animate-spin" /> Checking your payment screenshot…
                </div>
              )}
              {!checking && outcome?.status === "pass" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="size-4" /> Payment screenshot verified — Rs.{" "}
                  {total.toLocaleString()} to Farhan Ali Rasheed.
                </div>
              )}
              {!checking && outcome?.status === "fail" && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
                  <div className="flex items-start gap-2 font-bold">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>We couldn't verify this screenshot.</span>
                  </div>
                  <p className="mt-1 pl-6 text-xs leading-5">
                    {outcome.reason === "amount"
                      ? `The amount doesn't match your order total of Rs. ${total.toLocaleString()}. Please upload the screenshot of your Rs. ${total.toLocaleString()} payment.`
                      : outcome.reason === "payee"
                        ? "We couldn't see the receiver name (Farhan Ali Rasheed) or account number (03135944817). Please upload the full confirmation screen."
                        : `Please upload the payment confirmation screen showing Rs. ${total.toLocaleString()} sent to Farhan Ali Rasheed (03135944817).`}
                  </p>
                  {blocked && (
                    <a
                      href={`https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent(`Assalam-o-Alaikum, I paid Rs. ${total.toLocaleString()} for the Doctor Local Authority System but my screenshot isn't being accepted on the checkout. I'll send it here.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 ml-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <MessageCircle className="size-4" /> Already paid? Send it to us on WhatsApp
                    </a>
                  )}
                </div>
              )}
            </section>

            {/* Mobile submit inline (desktop uses sticky sidebar) */}
            <div className="lg:hidden">
              <SubmitButton submitting={submitting} checking={checking} total={total} />
            </div>
          </form>

          {/* RIGHT — sticky summary */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-center py-2.5 font-black uppercase tracking-wider text-xs">
                  Order Summary
                </div>
                <img
                  src={productStack.url}
                  alt="Doctor Local Authority System™ product stack"
                  className="w-full h-auto"
                />
                <div className="p-5">
                  <div className="space-y-2 text-sm">
                    {items.map((i) => (
                      <div key={i.id} className="flex justify-between gap-3">
                        <span className="text-slate-700 truncate">{i.title}</span>
                        <span className="font-bold text-slate-900 whitespace-nowrap">
                          Rs. {i.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase text-slate-500 tracking-wider">
                      Total
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>

                  {/* Desktop submit (form submit via native form pairing) */}
                  <div className="hidden lg:block mt-5">
                    <SubmitButton
                      submitting={submitting}
                      checking={checking}
                      total={total}
                      onClick={() => {
                        (document.querySelector("form") as HTMLFormElement | null)?.requestSubmit();
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="size-3.5" /> 100% Secure &amp; Safe Payments
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
                <div className="size-10 rounded-full bg-amber-100 grid place-items-center shrink-0">
                  <ShieldCheck className="size-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Secure Order &amp; Payment Review
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your payment details are handled securely and your order is recorded for our
                    team to review.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <section className="bg-white pb-10 pt-2 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="size-5 text-orange-500" />
              <h2 className="text-base font-black text-slate-900">Here's What You'll Get</h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {INCLUDED_ITEMS.map((it) => (
                <li
                  key={it.label}
                  className={`flex items-start gap-2 text-sm ${
                    it.highlight
                      ? "text-orange-700 font-black bg-orange-50 border border-orange-200 rounded-lg px-2 py-1.5"
                      : "text-slate-700"
                  }`}
                >
                  <span
                    className={`mt-0.5 shrink-0 grid place-items-center size-5 rounded-full text-white ${
                      it.highlight ? "bg-orange-500" : "bg-emerald-500"
                    }`}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className={it.highlight ? "font-black" : "font-semibold"}>{it.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reused sales-page testimonials */}
      <section className="bg-sky-50 pb-16 pt-4 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Real Reviews From <span className="text-sky-600">Doctors</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Real feedback from doctors who have engaged with practical healthcare marketing
                systems.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {PROOFS.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={p.url}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 sm:h-72 object-contain bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <AuthorityCheckoutFAQ />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SubmitButton({
  submitting,
  checking = false,
  total,
  onClick,
}: {
  submitting: boolean;
  checking?: boolean;
  total: number;
  onClick?: () => void;
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={submitting || checking}
      className="w-full rounded-xl px-6 py-4 text-white font-black uppercase tracking-wide shadow-lg bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span className="inline-flex items-center justify-center gap-2 text-sm sm:text-base">
        {submitting
          ? "SUBMITTING..."
          : checking
            ? "CHECKING SCREENSHOT..."
            : `PAY RS. ${total.toLocaleString()} & GET ACCESS`}
        <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
      </span>
    </button>
  );
}

function AuthorityCheckoutFAQ() {
  const faqs = [
    {
      q: "How do I get access after paying?",
      a: "Once our team verifies your payment screenshot, we send your access details on WhatsApp and email.",
    },
    {
      q: "Is this a live session?",
      a: "No. It's a recorded, step-by-step system you can go through at your own pace and come back to anytime.",
    },
    {
      q: "Do I need previous marketing experience?",
      a: "No. Everything is explained in simple, practical language for busy doctors.",
    },
    {
      q: "Will this work in my city and specialty?",
      a: "Yes. The system is built around the specialty, city and patient problem you want to be known for.",
    },
    {
      q: "Is this only for doctors?",
      a: "It's for doctors, dentists, nutritionists, physiotherapists, psychologists, aesthetic practitioners, clinic owners and other healthcare professionals.",
    },
  ];
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">
        Frequently Asked Questions
      </h2>
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
