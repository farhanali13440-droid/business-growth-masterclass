/**
 * Forced VSL rules for the /strategy-call page.
 * Pure, browser-safe module (no React) so the unlock rule can be tested on its own.
 *
 * The booking buttons stay hidden until the visitor has actually watched
 * UNLOCK_AT_SECONDS of the video (forward seeking is blocked in the player).
 * 180s = by then the visitor has seen the full done-for-you offer and the
 * client results; the "simple math" part of the video starts right after.
 */

export const VSL_SRC = "/vsl/strategy-call-vsl.mp4";
export const VSL_POSTER = "/vsl/strategy-call-vsl-poster.jpg";

/** Seconds of real playback before the next-step buttons appear. */
export const UNLOCK_AT_SECONDS = 180;

const STORAGE_KEY = "cgm_vsl_unlocked_v1";

export function shouldUnlock(watchedSeconds: number, ended = false): boolean {
  return ended || watchedSeconds >= UNLOCK_AT_SECONDS;
}

export function wasUnlockedBefore(): boolean {
  try {
    return typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberUnlock(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}
