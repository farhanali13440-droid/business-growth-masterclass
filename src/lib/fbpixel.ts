// Meta Pixel helper (client-only)
export const FB_PIXEL_ID = "1628248005456688";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export function fbqTrack(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      if (eventId) window.fbq("track", event, params, { eventID: eventId });
      else window.fbq("track", event, params);
      console.log(`[Meta Pixel] ${event} fired`, params ?? {});
    } else {
      console.warn(`[Meta Pixel] fbq not available — ${event} not fired`);
    }
  } catch (e) {
    console.warn("[Meta Pixel] track failed", e);
  }
}

export function fbqTrackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", event, params);
    }
  } catch (e) {
    console.warn("[Meta Pixel] trackCustom failed", e);
  }
}
