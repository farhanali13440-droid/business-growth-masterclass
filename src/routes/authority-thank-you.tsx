import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { isAdminPreview } from "@/lib/admin-preview";
import { AdminPreviewBadge } from "@/components/site/AdminPreviewBadge";

/**
 * Post-purchase page for the Doctor Local Authority System™ (/authority → /authority-order → here).
 * Upsell / OTO pages can be inserted between checkout and this page later.
 */
export const Route = createFileRoute("/authority-thank-you")({
  validateSearch: (search: Record<string, unknown>): { lead?: string } => ({
    lead: typeof search.lead === "string" ? search.lead : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Received — Doctor Local Authority System™" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthorityThankYou,
});

function AuthorityThankYou() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const waSupport = `https://wa.me/923135944817?text=${encodeURIComponent(
    "Assalam-o-Alaikum, I just ordered the Doctor Local Authority System and submitted my payment screenshot.",
  )}`;

  useEffect(() => {
    // Only buyers coming from checkout (with a lead id) see this page.
    let lead: string | null = null;
    try {
      lead =
        new URL(window.location.href).searchParams.get("lead") ||
        localStorage.getItem("authority_last_lead");
    } catch {}
    const admin = isAdminPreview();
    setAdminMode(admin);
    if (!lead && !admin) {
      navigate({ to: "/authority", replace: true });
      return;
    }
    setOk(true);
  }, [navigate]);

  if (!ok) {
    return (
      <div className="min-h-screen grid place-items-center bg-sky-50 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  const steps = [
    {
      icon: CheckCircle2,
      title: "Order & screenshot received",
      body: "Your order and payment screenshot have been recorded.",
    },
    {
      icon: Clock,
      title: "We verify your payment",
      body: "Our team checks your payment against your screenshot.",
    },
    {
      icon: MessageCircle,
      title: "Access sent to you",
      body: "You'll receive your access details on WhatsApp and email.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      {adminMode && <AdminPreviewBadge />}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
        Doctor Local Authority System™
      </div>
      <main className="flex-1 px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 shadow-xl">
            <CheckCircle2 className="size-10 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900 md:text-5xl">
            Thank You — Your Order Is In!
          </h1>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            Welcome to the Doctor Local Authority System™. Here's what happens next:
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white">
                <s.icon className="size-5" />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-yellow-400 text-[10px] font-black text-[#0b1735]">
                  {i + 1}
                </span>
              </div>
              <div>
                <div className="font-black text-slate-900">{s.title}</div>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <a
            href={waSupport}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta block w-full px-6 py-4 text-center"
          >
            <span className="inline-flex items-center justify-center gap-2 text-base md:text-lg">
              <MessageCircle className="size-5" /> Message Us on WhatsApp
            </span>
            <span className="mt-1 block text-xs font-medium normal-case tracking-normal opacity-95">
              Questions about your order? We're here to help.
            </span>
          </a>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="size-4 text-sky-600" /> Your order has been securely recorded.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
