import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  QUESTIONS,
  answerLabel,
  isComplete,
  scoreApplication,
  type ApplicationAnswers,
  type Tier,
} from "@/lib/call-qualification";

/**
 * Strategy-call application (post-masterclass purchase).
 * Scores the answers on the server, saves them on the buyer's clinic_growth_leads row
 * (as an entry in selected_order_bumps with id "call-application", so it shows on /admin/leads1340),
 * and only returns the booking link to qualified doctors.
 *
 * The first submission is locked: pressing Back and changing answers returns the original result.
 */

// Booking link — only ever sent to qualified doctors.
const BOOKING_URL = "https://calendly.com/farhanali13440/30min";

export const APPLICATION_ID = "call-application";

const TIER_TITLE: Record<Tier, string> = {
  qualified: "Strategy Call Application — QUALIFIED",
  almost: "Strategy Call Application — ALMOST (1:1 / DIY)",
  diy: "Strategy Call Application — DIY",
};

const schema = z.object({
  leadId: z.string().uuid(),
  answers: z.record(z.string(), z.string().max(200)),
});

type Bump = { id?: string; [k: string]: unknown };

export type ApplicationResult = { tier: Tier; bookingUrl: string | null };

export const submitCallApplication = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }): Promise<ApplicationResult> => {
    const answers = Object.fromEntries(
      QUESTIONS.map((q) => [q.id, String(data.answers[q.id] ?? "").trim()]),
    ) as Partial<ApplicationAnswers>;
    if (!isComplete(answers)) throw new Error("Please answer every question.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const { data: lead, error } = await db
      .from("clinic_growth_leads")
      .select("id, selected_order_bumps")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw error;
    if (!lead) throw new Error("Order not found");

    const bumps: Bump[] = Array.isArray(lead.selected_order_bumps)
      ? [...lead.selected_order_bumps]
      : [];

    // Locked: return the original decision if they already applied.
    const existing = bumps.find((b) => b && typeof b === "object" && b.id === APPLICATION_ID);
    if (existing && typeof existing.tier === "string") {
      const tier = existing.tier as Tier;
      return { tier, bookingUrl: tier === "qualified" ? BOOKING_URL : null };
    }

    const tier = scoreApplication(answers);
    bumps.push({
      id: APPLICATION_ID,
      title: TIER_TITLE[tier],
      tier,
      price: 0,
      submitted_at: new Date().toISOString(),
      // Human-readable answers for the admin page.
      answers: QUESTIONS.map((q) => ({
        q: q.title,
        a: answerLabel(q.id, answers[q.id]),
      })),
    });

    const { error: upErr } = await db
      .from("clinic_growth_leads")
      .update({ selected_order_bumps: bumps })
      .eq("id", data.leadId);
    if (upErr) throw upErr;

    return { tier, bookingUrl: tier === "qualified" ? BOOKING_URL : null };
  });
