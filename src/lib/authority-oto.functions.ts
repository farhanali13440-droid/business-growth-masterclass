import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Records the Google Ads upsell / downsell / DIY decision on the buyer's existing
 * clinic_growth_leads row (the one created at /authority-order), so it shows on /admin/leads1340.
 * The main-order screenshot is never overwritten — the OTO screenshot is stored on the add-on entry.
 */
export const OTO_OFFERS = {
  upsell: {
    id: "google-ads-oto",
    title: "Google Ads for Clinics (OTO)",
    price: 5000,
    label: "Google Ads OTO PKR 5,000",
  },
  downsell: {
    id: "google-ads-downsell",
    title: "Google Ads for Clinics (Downsell)",
    price: 3000,
    label: "Google Ads Downsell PKR 3,000",
  },
  // Offered on /google-ads-diy to masterclass buyers who don't qualify for done-for-you.
  diy: {
    id: "google-ads-diy",
    title: "Mini MBA for Your Business (strategy-call downsell)",
    price: 5000,
    label: "Mini MBA PKR 5,000",
  },
} as const;

const schema = z.object({
  leadId: z.string().uuid(),
  offer: z.enum(["upsell", "downsell", "diy"]),
  decision: z.enum(["accepted", "declined"]),
  payment_method: z.string().max(60).optional(),
  screenshot_url: z.string().max(2000).optional(),
  auto_verified: z.boolean().optional(),
});

type Bump = { id?: string; [k: string]: unknown };

export const recordAuthorityOto = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const { data: lead, error } = await db
      .from("clinic_growth_leads")
      .select("id, lead_status, total_amount, selected_order_bumps")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw error;
    if (!lead) throw new Error("Order not found");

    const offer = OTO_OFFERS[data.offer];
    const bumps: Bump[] = Array.isArray(lead.selected_order_bumps)
      ? [...lead.selected_order_bumps]
      : [];
    let status: string = lead.lead_status ?? "";
    let total = Number(lead.total_amount) || 0;

    if (data.decision === "accepted") {
      const entry = {
        id: offer.id,
        title: offer.title,
        price: offer.price,
        payment_method: data.payment_method ?? null,
        screenshot_url: data.screenshot_url ?? null,
        auto_verified: data.auto_verified ?? null,
        submitted_at: new Date().toISOString(),
      };
      const existing = bumps.findIndex((b) => b && b.id === offer.id);
      if (existing >= 0) {
        bumps[existing] = entry; // re-submission: replace, don't double-count
      } else {
        bumps.push(entry);
        total += offer.price;
      }
      if (!status.includes(offer.label)) status = `${status} + ${offer.label}`;
    } else if (data.offer === "downsell" && !status.includes("Google Ads Declined")) {
      status = `${status} (Google Ads Declined)`;
    } else if (data.offer === "diy" && !status.includes("Mini MBA Declined")) {
      status = `${status} (Mini MBA Declined)`;
    }

    const { error: upErr } = await db
      .from("clinic_growth_leads")
      .update({
        selected_order_bumps: bumps,
        total_amount: total,
        lead_status: status.slice(0, 500),
      })
      .eq("id", data.leadId);
    if (upErr) throw upErr;
    return { ok: true };
  });
