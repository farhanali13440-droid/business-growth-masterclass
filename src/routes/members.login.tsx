import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MembersShell, SUPPORT_WA } from "@/components/site/MembersShell";
import { isAdminPreview } from "@/lib/admin-preview";
import { AdminPreviewBadge } from "@/components/site/AdminPreviewBadge";

export const Route = createFileRoute("/members/login")({
  head: () => ({
    meta: [
      { title: "Log In — Clinic Growth Masterclass Members Area" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MembersLogin,
});

function MembersLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  // Already logged in → straight to the members area.
  useEffect(() => {
    setAdminMode(isAdminPreview());
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/members", replace: true });
    });
  }, [navigate]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (error) {
      setError("Incorrect email or password. Use the email you bought the Masterclass with.");
      return;
    }
    navigate({ to: "/members", replace: true });
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/members/reset`,
    });
    setBusy(false);
    if (error) {
      setError("Couldn't send the reset email. Please try again in a minute.");
      return;
    }
    setResetSent(true);
  }

  return (
    <MembersShell>
      {adminMode && (
        <AdminPreviewBadge
          note="Buyers log in here."
          action={{ label: "Open members area", onClick: () => navigate({ to: "/members" }) }}
        />
      )}
      <div className="mx-auto max-w-md px-4 py-10 md:py-16">
        <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
          <div className="mx-auto size-12 rounded-full bg-primary/10 grid place-items-center">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="mt-4 text-center text-xl md:text-2xl font-black text-slate-900">
            {mode === "login" ? "Log In to Your Members Area" : "Reset Your Password"}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            {mode === "login"
              ? "Watch the Clinic Growth Masterclass recordings."
              : "Enter your email and we'll send you a link to set a new password."}
          </p>

          {mode === "forgot" && resetSent ? (
            <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Check your email inbox (and spam folder) for the password reset link.
            </p>
          ) : (
            <form onSubmit={mode === "login" ? onLogin : onForgot} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700" htmlFor="m-email">
                  Email
                </label>
                <input
                  id="m-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              {mode === "login" && (
                <div>
                  <label className="text-sm font-semibold text-slate-700" htmlFor="m-pass">
                    Password
                  </label>
                  <input
                    id="m-pass"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </div>
              )}
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="btn-cta w-full justify-center inline-flex items-center gap-2 px-6 py-3.5 text-base disabled:opacity-70"
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                {mode === "login" ? "Log In" : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "forgot" : "login");
                setError(null);
                setResetSent(false);
              }}
              className="text-sm text-primary underline underline-offset-4"
            >
              {mode === "login" ? "Forgot your password?" : "Back to log in"}
            </button>
          </div>
        </div>

        <a
          href={`https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent("Assalam-o-Alaikum, I need help logging in to the Clinic Growth Masterclass members area.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <MessageCircle className="size-4 text-emerald-600" /> Need help? Message us on WhatsApp
        </a>
      </div>
    </MembersShell>
  );
}
