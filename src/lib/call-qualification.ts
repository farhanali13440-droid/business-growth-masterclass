/**
 * Strategy-call pre-qualification — questions + routing rules.
 * Pure, browser-safe module (no React, no server imports) so the rules can be unit-tested.
 *
 * Tiers:
 *  - "qualified" → may book the free implementation call (Calendly)
 *  - "almost"    → serious but not a fit yet → Mini MBA downsell page + paid 1:1 session option
 *  - "diy"       → Mini MBA downsell page
 *
 * To change who qualifies, edit QUALIFYING_BUDGETS (or the rules in scoreApplication).
 */

export type Option = { value: string; label: string };
export type Question = {
  id: keyof ApplicationAnswers;
  title: string;
  help?: string;
  options?: Option[];
  /** free-text question (business type + city) */
  text?: { placeholder: string };
};

export type ApplicationAnswers = {
  role: string;
  specialty_city: string;
  monthly_patients: string;
  goal: string;
  preference: string;
  budget: string;
  ad_budget: string;
  timeline: string;
  decision_maker: string;
};

export type Tier = "qualified" | "almost" | "diy";

export const QUESTIONS: Question[] = [
  {
    id: "role",
    title: "Which best describes you?",
    options: [
      { value: "owner", label: "I own the business" },
      { value: "partner", label: "I'm a partner in the business" },
      { value: "manager", label: "I manage the business (operations or marketing)" },
      { value: "employed", label: "I work at someone else's business" },
      { value: "student", label: "I'm a student / haven't started a business yet" },
    ],
  },
  {
    id: "specialty_city",
    title: "What type of business do you run, and in which city?",
    text: { placeholder: "e.g. Real estate agency, Lahore" },
  },
  {
    id: "monthly_patients",
    title: "Roughly how many NEW clients or customers does your business get every month?",
    options: [
      { value: "lt20", label: "Less than 20" },
      { value: "20-50", label: "20 – 50" },
      { value: "50-150", label: "50 – 150" },
      { value: "150+", label: "More than 150" },
    ],
  },
  {
    id: "goal",
    title: "What is your biggest goal right now?",
    options: [
      { value: "more_patients", label: "Get more new clients consistently" },
      { value: "new_service", label: "Grow a specific service or product" },
      { value: "new_clinic", label: "Grow a new business or a new branch" },
      { value: "online_presence", label: "Build my name & online presence in my city" },
    ],
  },
  {
    id: "preference",
    title: "How would you prefer to grow your business?",
    options: [
      { value: "diy", label: "I want to learn it and do it myself" },
      { value: "dwy", label: "I want expert guidance while I / my team implement it" },
      { value: "dfy", label: "I want an expert team to do it for me" },
    ],
  },
  {
    id: "budget",
    title:
      "If an expert team handled your business's marketing for you, how much could you invest in that team every month?",
    help: "Not including ad spend — we'll ask about that next. This helps us recommend the right path for you.",
    options: [
      { value: "lt30k", label: "Less than PKR 30,000" },
      { value: "30-49k", label: "PKR 30,000 – 49,000" },
      { value: "50-100k", label: "PKR 50,000 – 1,00,000" },
      { value: "100k+", label: "More than PKR 1,00,000" },
    ],
  },
  {
    id: "ad_budget",
    title: "And how much could you spend on ads every month (paid directly to Google / Meta)?",
    options: [
      { value: "none", label: "Nothing — I don't want to spend on ads" },
      { value: "lt20k", label: "Less than PKR 20,000" },
      { value: "20-50k", label: "PKR 20,000 – 50,000" },
      { value: "50k+", label: "More than PKR 50,000" },
    ],
  },
  {
    id: "timeline",
    title: "When do you want to start?",
    options: [
      { value: "now", label: "Immediately" },
      { value: "30d", label: "Within the next 30 days" },
      { value: "exploring", label: "I'm just exploring for now" },
    ],
  },
  {
    id: "decision_maker",
    title: "Are you the person who makes the final decision on this investment?",
    options: [
      { value: "yes", label: "Yes, it's my decision" },
      { value: "partner", label: "I decide together with a partner" },
      { value: "no", label: "No, someone else decides" },
    ],
  },
];

/** Management budgets that meet the PKR 50,000/month done-for-you minimum (ad spend is separate). */
export const QUALIFYING_BUDGETS = new Set(["50-100k", "100k+"]);
/** Budget just under the minimum — still worth a paid 1:1 session. */
const NEAR_BUDGETS = new Set(["30-49k"]);

export function isComplete(a: Partial<ApplicationAnswers>): a is ApplicationAnswers {
  return QUESTIONS.every((q) => {
    const v = a[q.id];
    if (typeof v !== "string" || !v.trim()) return false;
    if (q.options) return q.options.some((o) => o.value === v);
    return v.trim().length >= 2 && v.length <= 200;
  });
}

export function scoreApplication(a: ApplicationAnswers): Tier {
  // Hard knock-outs: can't hire us, or wants to do it alone.
  if (a.role === "employed" || a.role === "student") return "diy";
  if (a.decision_maker === "no") return "diy";
  if (a.preference === "diy") return "diy";

  const budgetOk = QUALIFYING_BUDGETS.has(a.budget);
  const budgetNear = NEAR_BUDGETS.has(a.budget);
  const ready = a.timeline === "now" || a.timeline === "30d";
  const willRunAds = a.ad_budget !== "none";

  if (budgetOk && ready && willRunAds) return "qualified";
  // Serious decision-maker who wants help, but budget or timing isn't there yet.
  if (budgetOk || budgetNear) return "almost";
  return "diy";
}

export function answerLabel(id: keyof ApplicationAnswers, value: string): string {
  const q = QUESTIONS.find((x) => x.id === id);
  return q?.options?.find((o) => o.value === value)?.label ?? value;
}
