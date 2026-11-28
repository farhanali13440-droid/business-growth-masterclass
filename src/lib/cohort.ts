// Single source of truth for the current Business Growth Masterclass cohort
// date/time. Import from here in both the sales page components and the
// server-side email schedulers so a new cohort only needs to change one line.
//
// Timezone: Asia/Karachi (PKT, UTC+5). To roll to a new cohort, update
// MASTERCLASS_DATE_ISO to the new session start (in UTC) and update the
// label to the new human-readable date.
//
// e.g. 23rd November 2026, 5:00 PM PKT => 2026-11-23T12:00:00Z

export const MASTERCLASS_DATE_ISO = "2026-11-23T12:00:00Z";

export const MASTERCLASS_DATE_LABEL =
  "Masterclass: 23rd (Mon) November at 5:00 PM – 7:30 PM Pakistan Standard Time";

export const COHORT_TIMEZONE = "Asia/Karachi";

/** Session start as epoch ms. */
export function getCohortStartMs(): number {
  return new Date(MASTERCLASS_DATE_ISO).getTime();
}

/** Formatted cohort date, e.g. "23 November 2026" (in PKT). */
export function formatCohortDate(iso: string = MASTERCLASS_DATE_ISO): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: COHORT_TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Formatted cohort start time in PKT, e.g. "5:00 PM PKT". */
export function formatCohortTime(iso: string = MASTERCLASS_DATE_ISO): string {
  const t = new Intl.DateTimeFormat("en-US", {
    timeZone: COHORT_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
  return `${t} PKT`;
}
