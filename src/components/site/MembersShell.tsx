import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { Footer } from "@/components/site/Footer";

export const MEMBERS_URL = "https://zeroappleaday.site/members";
export const SUPPORT_WA = "923135944817";

/** Header + footer shared by the members area pages. */
export function MembersShell({
  children,
  onLogout,
}: {
  children: ReactNode;
  onLogout?: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <header className="w-full bg-topbar text-white">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-3">
          <Link
            to="/members"
            className="font-extrabold tracking-widest text-[11px] sm:text-sm border border-white/40 rounded px-2 py-1 leading-tight flex flex-col items-center shrink-0"
          >
            <span>CLINIC&nbsp;GROWTH</span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] font-medium">
              MEMBERS AREA
            </span>
          </Link>
          {onLogout && (
            <div className="flex items-center gap-4">
              <Link
                to="/members/password"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/80 hover:text-white"
              >
                <KeyRound className="size-4" /> Change password
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/80 hover:text-white"
              >
                <LogOut className="size-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
