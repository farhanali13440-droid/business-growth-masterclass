import { createServerFn } from "@tanstack/react-start";

type AdminLead = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  specialty: string | null;
  selected_order_bumps: Array<string | Record<string, string | number | boolean | null>>;
  total_amount: number;
  payment_method: string;
  lead_status: string;
  payment_screenshot_url: string | null;
  created_at: string;
  registration_email_sent: boolean | null;
  registration_email_sent_at: string | null;
  registration_email_error: string | null;
};

export const listAllLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const pageSize = 500;
  const maxRows = 5000;
  const leads: AdminLead[] = [];

  try {
    for (let from = 0; from < maxRows; from += pageSize) {
      let rows: AdminLead[] | null = null;
      let lastError: unknown = null;

      // The backend host can occasionally fail DNS resolution in preview.
      // Retry only this small, paged request instead of failing the whole RPC.
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const { data, error } = await (supabaseAdmin as any)
            .from("clinic_growth_leads")
            .select(
              "id, full_name, email, whatsapp, specialty, selected_order_bumps, total_amount, payment_method, lead_status, payment_screenshot_url, created_at, registration_email_sent, registration_email_sent_at, registration_email_error",
            )
            .order("created_at", { ascending: false })
            .range(from, from + pageSize - 1);
          if (error) throw error;
          rows = (data ?? []).map((row: any) => ({
            ...row,
            // Keep string bumps (masterclass) and object add-ons (authority checkout / Google Ads OTO).
            selected_order_bumps: Array.isArray(row.selected_order_bumps) ? row.selected_order_bumps : [],
          })) as AdminLead[];
          break;
        } catch (error) {
          lastError = error;
          console.warn(`[admin-leads] page ${from} attempt ${attempt} failed`, error);
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 400));
          }
        }
      }

      if (!rows) throw lastError ?? new Error("Lead query failed");
      leads.push(...rows);
      if (rows.length < pageSize) break;
    }

    return { leads, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach the database";
    console.error("[admin-leads] listAllLeads failed after retries", error);
    return { leads, error: message };
  }
});
