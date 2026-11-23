import { useEffect, useState } from "react";
import { ArrowRight, Copy, GraduationCap, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createMemberAccount, getMembershipSetup } from "@/lib/members.functions";
import { MEMBERS_URL } from "@/components/site/MembersShell";
import { PREVIEW_LEAD_ID } from "@/lib/admin-preview";

/**
 * Thank-you page box: buyer sets a password for the members area (email comes from their order),
 * gets logged in automatically, and is shown the members link to bookmark.
 */
export function MemberAccountBox({ leadId }: { leadId: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "form" | "done" | "exists" | "hidden">("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Admin preview of the thank-you page: show the form with a sample email.
      if (leadId === PREVIEW_LEAD_ID) {
        setEmail("doctor@example.com");
        setState("form");
        return;
      }
      try {
        const setup = await getMembershipSetup({ data: { leadId } });
        if (cancelled) return;
        if (!setup.eligible || !setup.email) return setState("hidden");
        setEmail(setup.email);
        const { data } = await supabase.auth.getSession();
        const sessionEmail = data.session?.user.email?.toLowerCase();
        setState(sessionEmail === setup.email.toLowerCase() ? "done" : "form");
      } catch (err) {
        console.error("[members] setup failed", err);
        if (!cancelled) setState("hidden");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email) return;
    if (leadId === PREVIEW_LEAD_ID) {
      setState("done"); // preview only — no account is created
      return;
    }
    if (password.length < 8) return setError("Please use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      const res = await createMemberAccount({ data: { leadId, password } });
      if (res.status === "exists") {
        setState("exists");
      } else if (res.status === "created") {
        await supabase.auth.signInWithPassword({ email, password });
        try {
          if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
            (window as any).fbq("trackCustom", "MembersAccountCreated");
          }
        } catch {}
        setState("done");
      } else {
        setError("We couldn't find your order. Please contact us on WhatsApp.");
      }
    } catch (err) {
      console.error("[members] create failed", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(MEMBERS_URL).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  }

  if (state === "hidden" || state === "loading") return null;

  const LinkBox = () => (
    <div className="mt-5 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-4">
      <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
        <Star className="size-3.5" /> Save / bookmark this link
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          readOnly
          value={MEMBERS_URL}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
        />
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-primary px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10"
        >
          <Copy className="size-4" /> {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        Log in any time with <span className="font-semibold">{email}</span> and your password.
      </p>
    </div>
  );

  return (
    <section className="bg-card rounded-2xl border-2 border-primary/30 shadow-sm p-6 md:p-8 text-center">
      <div className="mx-auto size-12 rounded-full bg-primary/10 grid place-items-center">
        <GraduationCap className="size-6 text-primary" />
      </div>

      {state === "form" && (
        <>
          <h2 className="mt-3 text-lg md:text-2xl font-black text-slate-900">
            Create Your Members Area Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This is where you'll watch the Clinic Growth Masterclass, module by module. Choose a
            password for <span className="font-semibold text-slate-900">{email}</span>.
          </p>
          <form onSubmit={onSubmit} className="mx-auto mt-5 max-w-sm space-y-3 text-left">
            <input type="email" value={email ?? ""} readOnly autoComplete="username" className="sr-only" />
            <input
              type="password"
              placeholder="Create password (min. 8 characters)"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary"
            />
            <input
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary"
            />
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="btn-cta w-full justify-center inline-flex items-center gap-2 px-6 py-3.5 text-base disabled:opacity-70"
            >
              {busy && <Loader2 className="size-4 animate-spin" />} Create My Account
            </button>
          </form>
        </>
      )}

      {state === "done" && (
        <>
          <h2 className="mt-3 text-lg md:text-2xl font-black text-slate-900">
            ✅ Your Members Area Is Ready
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Watch the Clinic Growth Masterclass recordings, one module at a time.
          </p>
          <LinkBox />
          <a
            href="/members"
            className="btn-cta mt-5 w-full md:w-auto justify-center inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg"
          >
            Go to My Members Area <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
          </a>
        </>
      )}

      {state === "exists" && (
        <>
          <h2 className="mt-3 text-lg md:text-2xl font-black text-slate-900">
            You Already Have a Members Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Log in with your existing password. Forgot it? Use "Forgot your password?" on the log-in
            page.
          </p>
          <LinkBox />
          <a
            href="/members/login"
            className="btn-cta mt-5 w-full md:w-auto justify-center inline-flex items-center gap-2 px-6 py-4 text-base md:text-lg"
          >
            Log In to My Members Area <ArrowRight className="btn-cta-arrow size-5" aria-hidden="true" />
          </a>
        </>
      )}
    </section>
  );
}
