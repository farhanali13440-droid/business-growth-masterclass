import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MEMBER_MODULES, toEmbedUrl } from "@/lib/members-modules";

/**
 * Clinic Growth Masterclass members area.
 * - Account = Supabase Auth user (email + password) created from the thank-you page.
 * - Access  = the email has a Masterclass order whose status is paid-like
 *   ("Pending Payment…", "Paid…", "Confirmed…", "Registered…"). If you change an order's
 *   status to something else (e.g. "Rejected"), that buyer loses access automatically.
 */

function isMasterclassBuyer(status: string | null | undefined): boolean {
  const s = String(status ?? "").toLowerCase();
  return (
    s.startsWith("pending payment") ||
    s.startsWith("paid") ||
    s.startsWith("confirmed") ||
    s.startsWith("registered")
  );
}

async function findBuyerByEmail(email: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin as any)
    .from("clinic_growth_leads")
    .select("id, full_name, lead_status")
    .eq("email", email.trim().toLowerCase())
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return ((data ?? []) as Array<{ id: string; full_name: string; lead_status: string }>).find((r) =>
    isMasterclassBuyer(r.lead_status),
  );
}

/** Thank-you page: which email the account will be created for. */
export const getMembershipSetup = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ leadId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead, error } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .select("email, lead_status")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw error;
    if (!lead || !isMasterclassBuyer(lead.lead_status)) {
      return { eligible: false as const, email: null };
    }
    return { eligible: true as const, email: String(lead.email) };
  });

/** Thank-you page: create the member's login (email from their order + the password they choose). */
export const createMemberAccount = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ leadId: z.string().uuid(), password: z.string().min(8).max(72) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    const { data: lead, error } = await db
      .from("clinic_growth_leads")
      .select("email, full_name, lead_status")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw error;
    if (!lead || !isMasterclassBuyer(lead.lead_status)) {
      return { status: "not_eligible" as const, email: null };
    }
    const email = String(lead.email).trim().toLowerCase();

    const { error: createErr } = await db.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: lead.full_name, lead_id: data.leadId },
    });
    if (createErr) {
      const msg = String(createErr.message ?? "").toLowerCase();
      if (msg.includes("already") || createErr.status === 422) {
        // Never overwrite an existing password from here — they log in or reset instead.
        return { status: "exists" as const, email };
      }
      console.error("[members] createUser failed", createErr);
      throw new Error("Could not create your account. Please try again.");
    }
    return { status: "created" as const, email };
  });

/** Members area: is the logged-in user a Masterclass buyer? Returns modules (+ video links only if yes). */
export const getMemberArea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = String((context.claims as any)?.email ?? "");
    const buyer = email ? await findBuyerByEmail(email) : undefined;
    if (!buyer) {
      return { allowed: false as const, email, name: null, leadId: null, videos: {}, bonuses: [] };
    }
    const { MODULE_VIDEOS, MEMBER_BONUSES } = await import("@/lib/members-videos.server");
    const videos: Record<string, string | null> = {};
    for (const m of MEMBER_MODULES) videos[m.id] = toEmbedUrl(MODULE_VIDEOS[m.id]);
    return {
      allowed: true as const,
      email,
      name: buyer.full_name,
      leadId: buyer.id,
      videos,
      bonuses: MEMBER_BONUSES.filter((b) => /^https:\/\//.test(b.url)),
    };
  });

/**
 * Admin preview of the members area (no login). Video + bonus links are only returned when the
 * request comes from Lovable's preview (or localhost) — on the live domain the preview shows
 * the layout with placeholders, so paid content is never exposed to non-buyers.
 */
export const getMemberAreaPreview = createServerFn({ method: "POST" }).handler(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");
  const { isLovablePreviewHost } = await import("@/lib/admin-preview");
  const req = getRequest();
  let urlHost = "";
  try {
    urlHost = new URL(req.url).hostname;
  } catch {}
  const hostHeader = (req.headers.get("host") ?? "").split(":")[0];
  const hosts = [urlHost, hostHeader].filter(Boolean).map((h) => h.toLowerCase());
  const onLiveDomain = hosts.some((h) => h.endsWith("zeroappleaday.site"));
  const isPreviewHost = !onLiveDomain && hosts.some((h) => isLovablePreviewHost(h));

  const videos: Record<string, string | null> = {};
  if (!isPreviewHost) {
    for (const m of MEMBER_MODULES) videos[m.id] = null;
    return { contentVisible: false as const, videos, bonuses: [] as Array<{ title: string; url: string }> };
  }
  const { MODULE_VIDEOS, MEMBER_BONUSES } = await import("@/lib/members-videos.server");
  for (const m of MEMBER_MODULES) videos[m.id] = toEmbedUrl(MODULE_VIDEOS[m.id]);
  return {
    contentVisible: true as const,
    videos,
    bonuses: MEMBER_BONUSES.filter((b) => /^https:\/\//.test(b.url)),
  };
});
