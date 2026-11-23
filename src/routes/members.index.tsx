import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Loader2,
  MessageCircle,
  PhoneCall,
  PlayCircle,
  Rocket,
  Megaphone,
  X,
  Gift,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMemberArea, getMemberAreaPreview } from "@/lib/members.functions";
import { isAdminPreview, PREVIEW_LEAD_ID } from "@/lib/admin-preview";
import { AdminPreviewBadge } from "@/components/site/AdminPreviewBadge";
import { LessonPlayer } from "@/components/site/LessonPlayer";
import { REQUIRED_WATCH } from "@/lib/watch-progress";
import { MEMBER_MODULES, isUnlocked } from "@/lib/members-modules";
import { MembersShell, SUPPORT_WA } from "@/components/site/MembersShell";

export const Route = createFileRoute("/members/")({
  validateSearch: (s: Record<string, unknown>): { m?: string } => ({
    m: typeof s.m === "string" ? s.m : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Members Area — Clinic Growth Masterclass" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MembersArea,
});

type Area = Awaited<ReturnType<typeof getMemberArea>>;

function track(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", event, params);
    }
  } catch {}
}

function MembersArea() {
  const navigate = useNavigate();
  const { m } = Route.useSearch();
  const [area, setArea] = useState<Area | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  // Admin preview (see src/lib/admin-preview.ts): owner can view the members area without a buyer login.
  const [adminMode, setAdminMode] = useState(false);
  const [previewContentVisible, setPreviewContentVisible] = useState(true);
  // Fraction of the current video actually watched (0–1), reported by LessonPlayer.
  const [watched, setWatched] = useState(0);

  // "Now recorded" announcement — shown until the member closes it (remembered on this device).
  useEffect(() => {
    try {
      setShowNotice(localStorage.getItem("cgm_recorded_notice_closed") !== "1");
    } catch {
      setShowNotice(true);
    }
  }, []);

  function closeNotice() {
    setShowNotice(false);
    try {
      localStorage.setItem("cgm_recorded_notice_closed", "1");
    } catch {}
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const admin = isAdminPreview();
      async function loadPreview() {
        const res = await getMemberAreaPreview();
        if (cancelled) return;
        setAdminMode(true);
        setPreviewContentVisible(res.contentVisible);
        setArea({
          allowed: true,
          email: "admin-preview",
          name: "Admin",
          leadId: PREVIEW_LEAD_ID,
          videos: res.videos,
          bonuses: res.bonuses,
        });
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (admin) {
          try {
            await loadPreview();
          } catch (err) {
            console.error("[members] preview load failed", err);
            if (!cancelled) setLoadError("Couldn't load the admin preview.");
          }
        } else {
          navigate({ to: "/members/login", replace: true });
        }
        return;
      }
      const saved = data.session.user.user_metadata?.cgm_completed;
      if (Array.isArray(saved)) setCompleted(new Set(saved.map(String)));
      try {
        const res = await getMemberArea();
        if (!res.allowed && admin) {
          await loadPreview();
          return;
        }
        if (!cancelled) setArea(res);
      } catch (err) {
        console.error("[members] load failed", err);
        if (!cancelled) setLoadError("We couldn't load your members area. Please refresh the page.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/members/login", replace: true });
  }

  // Selected module: ?m=… if unlocked, otherwise the first one not finished yet.
  const currentIndex = useMemo(() => {
    const req = MEMBER_MODULES.findIndex((x) => x.id === m);
    if (req >= 0 && (adminMode || isUnlocked(req, completed))) return req;
    const next = MEMBER_MODULES.findIndex((x) => !completed.has(x.id));
    return next >= 0 ? next : MEMBER_MODULES.length - 1;
  }, [m, completed, adminMode]);

  if (loadError) {
    return (
      <MembersShell onLogout={logout}>
        <p className="mx-auto max-w-md px-4 py-16 text-center text-sm text-red-600">{loadError}</p>
      </MembersShell>
    );
  }

  if (!area) {
    return (
      <MembersShell>
        <div className="grid place-items-center py-24 text-sm text-slate-500">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </MembersShell>
    );
  }

  if (!area.allowed) {
    return (
      <MembersShell onLogout={logout}>
        <div className="mx-auto max-w-md px-4 py-14 text-center">
          <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
            <Lock className="mx-auto size-8 text-slate-400" />
            <h1 className="mt-3 text-xl font-black text-slate-900">No Masterclass Access Found</h1>
            <p className="mt-2 text-sm text-slate-600">
              We couldn't find a Clinic Growth Masterclass order for{" "}
              <span className="font-semibold">{area.email}</span>. If you've paid, message us and
              we'll sort it out quickly.
            </p>
            <a
              href={`https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent(`Assalam-o-Alaikum, I bought the Clinic Growth Masterclass but can't access the members area. My email: ${area.email}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="size-4" /> Message us on WhatsApp
            </a>
          </div>
        </div>
      </MembersShell>
    );
  }

  const current = MEMBER_MODULES[currentIndex];
  const videoUrl = area.videos[current.id];
  const doneCount = MEMBER_MODULES.filter((x) => completed.has(x.id)).length;
  const pct = Math.round((doneCount / MEMBER_MODULES.length) * 100);
  const isLast = currentIndex === MEMBER_MODULES.length - 1;
  // Completion needs the video to be (almost) fully watched — skipping ahead doesn't count.
  const canComplete = adminMode || (!!videoUrl && watched >= REQUIRED_WATCH);
  const callHref = `/strategy-call?lead=${encodeURIComponent(area.leadId)}&from=members`;
  const firstName = (area.name ?? "").trim().split(/\s+/)[0];

  function goTo(id: string) {
    navigate({ to: "/members", search: { m: id } });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function markComplete() {
    if (saving || !canComplete) return;
    setSaving(true);
    const next = new Set(completed);
    next.add(current.id);
    setCompleted(next);
    track("MasterclassModuleCompleted", { module: current.id });
    try {
      if (!adminMode) await supabase.auth.updateUser({ data: { cgm_completed: Array.from(next) } });
    } catch (err) {
      console.error("[members] progress save failed", err);
    }
    setSaving(false);
    if (!isLast) goTo(MEMBER_MODULES[currentIndex + 1].id);
  }

  const CallCta = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg ${compact ? "p-4" : "p-6"}`}
    >
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
        <Rocket className="size-4" /> Want it done for you?
      </div>
      <h3 className={`mt-2 font-black leading-snug ${compact ? "text-base" : "text-lg"}`}>
        Need help implementing this in your clinic?
      </h3>
      <a
        href={callHref}
        onClick={() => track("MembersBookCallClicked", { module: current.id })}
        className="btn-cta mt-4 w-full justify-center inline-flex items-center gap-2 px-4 py-3 text-sm md:text-base"
      >
        <PhoneCall className="size-4" /> Book a Free Strategy Call
        <ArrowRight className="btn-cta-arrow size-4" aria-hidden="true" />
      </a>
    </div>
  );

  return (
    <MembersShell onLogout={adminMode ? undefined : logout}>
      {adminMode && (
        <AdminPreviewBadge note="Members area as a buyer sees it — all parts unlocked, no watch lock, progress isn't saved." />
      )}
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        {showNotice && (
          <div className="relative mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 pr-11 md:p-5 md:pr-12 shadow-sm">
            <button
              type="button"
              onClick={closeNotice}
              aria-label="Close announcement"
              className="absolute right-3 top-3 rounded-full p-1 text-amber-800/70 hover:bg-amber-100 hover:text-amber-900"
            >
              <X className="size-5" />
            </button>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                <Megaphone className="size-5" />
              </span>
              <div>
                <p className="font-black text-slate-900 md:text-lg">
                  Good news: you can now watch the Masterclass anytime
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  At the request of many busy doctors, the live masterclass is now a recorded
                  course — watch at your own pace. — Farhan
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              Welcome{firstName ? `, ${firstName}` : ""} 👋
            </p>
            <h1 className="text-xl md:text-3xl font-black text-slate-900">
              Clinic Growth Masterclass
            </h1>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>
                {doneCount} of {MEMBER_MODULES.length} parts completed
              </span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Mobile: call CTA above the video */}
        <div className="mt-5 lg:hidden">
          <CallCta compact />
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          {/* Player */}
          <section className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="aspect-video bg-slate-900">
              {videoUrl ? (
                <LessonPlayer
                  key={current.id}
                  moduleId={current.id}
                  embedUrl={videoUrl}
                  title={current.title}
                  onProgress={setWatched}
                />
              ) : (
                <div className="grid h-full place-items-center px-6 text-center text-white/80">
                  <div>
                    <PlayCircle className="mx-auto size-12 text-white/40" />
                    {adminMode && !previewContentVisible ? (
                      <>
                        <p className="mt-3 font-semibold">Videos are hidden in preview on the live site.</p>
                        <p className="mt-1 text-sm text-white/60">
                          Open /members in Lovable's preview to see them, or log in with a buyer account.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 font-semibold">This lesson is being uploaded.</p>
                        <p className="mt-1 text-sm text-white/60">Please check back shortly.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 md:p-7">
              <h2 className="text-lg md:text-2xl font-black text-slate-900">{current.title}</h2>
              {current.points.length > 0 && (
              <ul className="mt-4 grid gap-2">
                {current.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-800">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {p}
                  </li>
                ))}
              </ul>
              )}
              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                {completed.has(current.id) ? (
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <CheckCircle2 className="size-5" /> Completed
                  </span>
                ) : canComplete ? (
                  <button
                    type="button"
                    onClick={markComplete}
                    disabled={saving}
                    className="btn-cta justify-center inline-flex items-center gap-2 px-6 py-3.5 text-base disabled:opacity-70"
                  >
                    {isLast ? "Mark as Complete" : "Mark Complete & Unlock Next Part"}
                    <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
                  </button>
                ) : (
                  <div className="w-full sm:max-w-md">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500">
                      <Lock className="size-4" />
                      {videoUrl
                        ? `Watch the full video to ${isLast ? "complete" : "unlock the next part"}`
                        : "Available once this video is uploaded"}
                    </div>
                    {videoUrl && (
                      <div className="mt-2">
                        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min(100, (watched / REQUIRED_WATCH) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {completed.has(current.id) && !isLast && (
                  <button
                    type="button"
                    onClick={() => goTo(MEMBER_MODULES[currentIndex + 1].id)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary"
                  >
                    Next part <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
              {isLast && completed.has(current.id) && (
                <div className="mt-5 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-black text-emerald-900">
                    🎉 You've completed the Clinic Growth Masterclass!
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right sidebar: call CTA + module list */}
          <aside className="space-y-5 lg:sticky lg:top-4">
            <div className="hidden lg:block">
              <CallCta />
            </div>
            <nav className="bg-card rounded-2xl border shadow-sm p-3">
              <div className="px-2 pb-2 pt-1 text-xs font-black uppercase tracking-wider text-slate-500">
                Masterclass Videos
              </div>
              <ol className="space-y-1">
                {MEMBER_MODULES.map((mod, i) => {
                  const unlocked = adminMode || isUnlocked(i, completed);
                  const done = completed.has(mod.id);
                  const active = i === currentIndex;
                  return (
                    <li key={mod.id}>
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => goTo(mod.id)}
                        className={`w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          active
                            ? "bg-primary/10 ring-1 ring-primary/30"
                            : unlocked
                              ? "hover:bg-slate-50"
                              : "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {done ? (
                            <CheckCircle2 className="size-5 text-emerald-600" />
                          ) : unlocked ? (
                            active ? (
                              <PlayCircle className="size-5 text-primary" />
                            ) : (
                              <Circle className="size-5 text-slate-400" />
                            )
                          ) : (
                            <Lock className="size-5 text-slate-400" />
                          )}
                        </span>
                        <span className="text-sm font-semibold leading-snug text-slate-900">
                          {mod.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {area.bonuses.length > 0 && (
              <div className="bg-card rounded-2xl border-2 border-amber-200 shadow-sm p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700">
                  <Gift className="size-4" /> Your Bonuses
                </div>
                <ul className="mt-3 space-y-2">
                  {area.bonuses.map((b) => (
                    <li key={b.url}>
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("MembersBonusOpened", { bonus: b.title })}
                        className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold leading-snug text-slate-900 hover:bg-amber-100"
                      >
                        <ExternalLink className="mt-0.5 size-4 shrink-0 text-amber-700" />
                        <span>{b.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </MembersShell>
  );
}
