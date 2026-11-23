export const OFFER_TIMEZONE = "Asia/Karachi";
export const PROMO_REGULAR_PRICE = 2500;
export const PROMO_PRICE = 999;
export const PROMO_DELAY_MS = 3000;
export const PROMO_SESSION_KEY = "masterclassPromoShown";

function calendarParts(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: OFFER_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day"),
    hour: value("hour"), minute: value("minute"), second: value("second") };
}

/** Actual expiration instant for today's Pakistani calendar date, never local midnight. */
export function getDailyOfferDeadline(now: Date = new Date()) {
  const today = calendarParts(now);
  const wallMidnight = Date.UTC(today.year, today.month - 1, today.day + 1);
  // Derive the timezone offset through Intl rather than the visitor's timezone.
  const probe = calendarParts(new Date(wallMidnight));
  const offset = Date.UTC(probe.year, probe.month - 1, probe.day, probe.hour,
    probe.minute, probe.second) - wallMidnight;
  const nextMidnightMs = wallMidnight - offset;
  const expiresAtMs = nextMidnightMs - 1000;
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: OFFER_TIMEZONE, day: "numeric", month: "long", year: "numeric",
  }).format(now);
  const suffix = today.day % 100 >= 11 && today.day % 100 <= 13
    ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[today.day % 10] ?? "th";
  const promotionalDateLabel = dateLabel.replace(/^\d+/, `${today.day}${suffix}`);
  return { expiresAtMs, nextMidnightMs, dateLabel, promotionalDateLabel };
}