import { createServerFn } from "@tanstack/react-start";

const EVENTS = new Set(["page_view", "play", "25", "50", "75", "100", "optin"]);

type VslEventInput = { event: string; session_id: string; pct: number };

function validate(data: unknown): VslEventInput {
  const d = (data ?? {}) as Record<string, unknown>;
  const event = String(d.event ?? "");
  if (!EVENTS.has(event)) throw new Error("Invalid VSL event");
  const session_id = String(d.session_id ?? "").slice(0, 64) || "unknown";
  const pct = Math.max(0, Math.min(100, Math.round(Number(d.pct) || 0)));
  return { event, session_id, pct };
}

export const logVslEvent = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from("vsl_events").insert(data);
    if (error) console.error("[VSL] insert failed", error);
    return { ok: !error };
  });
