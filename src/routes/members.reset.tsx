import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MembersShell } from "@/components/site/MembersShell";

/** Landing page for the password-reset email link. */
export const Route = createFileRoute("/members/reset")({
  head: () => ({
    meta: [
      { title: "Set a New Password — Members Area" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MembersReset,
});

function MembersReset() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The reset link signs the user in; wait for that session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const t = setTimeout(() => setExpired(true), 6000);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError("Couldn't update your password. Please request a new reset link.");
    navigate({ to: "/members", replace: true });
  }

  return (
    <MembersShell>
      <div className="mx-auto max-w-md px-4 py-10 md:py-16">
        <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
          <div className="mx-auto size-12 rounded-full bg-primary/10 grid place-items-center">
            <KeyRound className="size-6 text-primary" />
          </div>
          <h1 className="mt-4 text-center text-xl md:text-2xl font-black text-slate-900">
            Set a New Password
          </h1>
          {!ready ? (
            <p className="mt-6 text-center text-sm text-slate-600">
              {expired ? (
                <>
                  This reset link has expired or was already used.{" "}
                  <a href="/members/login" className="text-primary underline">
                    Request a new one
                  </a>
                  .
                </>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Checking your link…
                </span>
              )}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <input
                type="password"
                placeholder="New password (min. 8 characters)"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary"
              />
              <input
                type="password"
                placeholder="Confirm new password"
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
                {busy && <Loader2 className="size-4 animate-spin" />} Save & Go to Members Area
              </button>
            </form>
          )}
        </div>
      </div>
    </MembersShell>
  );
}
