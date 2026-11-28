/**
 * Business Growth Masterclass — members area modules (titles & descriptions).
 * Order here = order members watch them in. Each module unlocks after the previous one is completed.
 *
 * The VIDEO LINKS are NOT here (this file is sent to the browser). Paste them in
 * src/lib/members-videos.server.ts — they're only sent to logged-in buyers.
 */
export type MemberModule = {
  id: string;
  label: string;
  title: string;
  desc: string;
  points: string[];
};

export const MEMBER_MODULES: MemberModule[] = [
  // For now the masterclass is uploaded as 3 recordings. Once each topic is edited into its own
  // module, replace these with the real module names (and add their videos in members-videos.server.ts).
  {
    id: "m1",
    label: "Part 1",
    title: "Part 1: Business Growth Masterclass",
    desc: "Business Growth Masterclass recording — Part 1 of 3. Watch the full video to unlock Part 2.",
    points: [],
  },
  {
    id: "m2",
    label: "Part 2",
    title: "Part 2: Business Growth Masterclass",
    desc: "Business Growth Masterclass recording — Part 2 of 3. Watch the full video to unlock Part 3.",
    points: [],
  },
  {
    id: "m3",
    label: "Part 3",
    title: "Part 3: Business Growth Masterclass",
    desc: "Business Growth Masterclass recording — Part 3 of 3.",
    points: [],
  },
];

/** A module is unlocked when every module before it is completed. */
export function isUnlocked(index: number, completed: Set<string>): boolean {
  return MEMBER_MODULES.slice(0, index).every((m) => completed.has(m.id));
}

/**
 * Turn a normal YouTube / Vimeo / Bunny / Loom share link into an embeddable player URL.
 * Already-embeddable URLs are returned unchanged. Returns null for an empty/invalid link.
 */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  const link = (raw ?? "").trim();
  if (!link) return null;
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|live|shorts)\/([^/?]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
  }
  if (host === "vimeo.com") {
    const [id, hash] = u.pathname.split("/").filter(Boolean);
    if (!id || !/^\d+$/.test(id)) return null;
    return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`;
  }
  if (host === "loom.com" && u.pathname.startsWith("/share/")) {
    return `https://www.loom.com/embed/${u.pathname.split("/")[2]}`;
  }
  return u.protocol === "https:" ? link : null;
}
