/**
 * Admin preview mode — lets the owner open funnel pages that are normally
 * gated behind a checkout lead id (/strategy-call, /thank-you, /authority-thank-you)
 * without filling in the order form.
 *
 * On automatically when:
 *  - the site runs inside Lovable's preview (id-preview--*.lovable.app, *.lovableproject.com) or locally;
 *  - this browser has opened the admin page (/admin/leads1340) — that sets a flag,
 *    so it also works on the live domain for the owner only.
 * Turn it off on the live domain with ?admin=off.
 *
 * Pure, browser-safe module (no React).
 */

const FLAG = "cgm_admin_preview";

/** Placeholder lead id used in preview (valid UUID, matches no real lead). */
export const PREVIEW_LEAD_ID = "00000000-0000-0000-0000-000000000000";

export function isLovablePreviewHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".lovableproject.com") ||
    (h.endsWith(".lovable.app") && h.startsWith("id-preview--"))
  );
}

export function isAdminPreview(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const param = new URL(window.location.href).searchParams.get("admin");
    if (param === "off") {
      localStorage.removeItem(FLAG);
      return false;
    }
    if (isLovablePreviewHost(window.location.hostname)) return true;
    return localStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}

/** Called from the admin page so the owner's browser can preview gated pages on the live site. */
export function enableAdminPreview(): void {
  try {
    localStorage.setItem(FLAG, "1");
  } catch {}
}
