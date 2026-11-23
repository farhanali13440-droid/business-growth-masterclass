import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MembersShell } from "@/components/site/MembersShell";

/** Logged-in members change their password. */
export const Route = createFileRoute("/members/password")({
  head: () => ({
    meta: [
      { title: "Change Password — Members Area" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ChangePassword,
});

function ChangePassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/members/login", replace: true });
      else setReady(true);
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError("Couldn't change your password. Please try again.");
    setDone(true);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/members/login", replace: true });
  }

  return (
    <MembersShell onLogout={logout}>
      <div className="mx-auto max-w-md px-4 py-10 md:py-16">
        <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
          <div className="mx-auto size-12 rounded-full bg-primary/10 grid place-items-center">
            {done ? (
              <CheckCircle2 className="size-6 text-emerald-600" />
            ) : (
              <KeyRound className="size-6 text-primary" />
            )}
          </div>
          <h1 className="mt-4 text-center text-xl md:text-2xl font-black text-slate-900">
            {done ? "Password Changed" : "Change Your Password"}
          </h1>
          {done ? (
            <a
              href="/members"
              className="btn-cta mt-6 w-full justify-center inline-flex items-center gap-2 px-6 py-3.5 text-base"
            >
              Back to Members Area
            </a>
          ) : ready ? (
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
                {busy && <Loader2 className="size-4 animate-spin" />} Save New Password
              </button>
            </form>
          ) : (
            <div className="mt-6 grid place-items-center">
              <Loader2 className="size-5 animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </div>
    </MembersShell>
  );
}
