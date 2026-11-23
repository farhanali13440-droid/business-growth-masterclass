import { PlayCircle, ListChecks, FileText, ClipboardList, Sparkles, MessageCircle, MapPin, Bot } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Code-drawn product visuals for the Business Growth Masterclass.
 * They replace the old clinic-branded PNG mockups, so they need no image assets
 * and stay on-brand with the site's navy / indigo / gold palette.
 */

export function ProductStackVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#0b1735] via-[#1b1f5e] to-[#2a1660] text-white ${
        compact ? "p-4" : "p-5 sm:p-7"
      }`}
    >
      <div className="absolute -top-16 -right-16 size-48 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-indigo-400/25 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-[1.4fr_1fr] gap-3 sm:gap-4 items-center">
        {/* Main "course" card */}
        <div className="rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm p-3 sm:p-4 shadow-2xl -rotate-2">
          <div className="text-[9px] sm:text-[10px] font-black tracking-[0.25em] text-yellow-300 uppercase">
            Masterclass
          </div>
          <div className={`mt-1 font-black leading-tight uppercase ${compact ? "text-base" : "text-lg sm:text-2xl"}`}>
            Business Growth <span className="text-yellow-300">Masterclass</span>
          </div>
          <div className="mt-3 aspect-video rounded-lg bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/30 ring-1 ring-white/20 grid place-items-center">
            <PlayCircle className={`${compact ? "size-8" : "size-10 sm:size-14"} text-white drop-shadow`} />
          </div>
          <div className="mt-2 inline-block rounded-full bg-yellow-400 text-[#0b1735] text-[9px] sm:text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
            Lifetime Access
          </div>
        </div>

        {/* Resource cards */}
        <div className="space-y-2 sm:space-y-2.5">
          <ResourceChip icon={ListChecks} label="Checklists" />
          <ResourceChip icon={FileText} label="Cheat Sheets" />
          <ResourceChip icon={ClipboardList} label="SOPs" />
        </div>
      </div>
    </div>
  );
}

function ResourceChip({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white text-[#0b1735] px-2.5 py-2 shadow-lg">
      <span className="grid place-items-center size-6 sm:size-7 rounded-md bg-indigo-100 text-indigo-700 shrink-0">
        <Icon className="size-3.5 sm:size-4" />
      </span>
      <span className="text-[11px] sm:text-sm font-extrabold leading-tight">{label}</span>
    </div>
  );
}

const BONUS_ICONS = {
  checklist: ListChecks,
  cheatsheet: FileText,
  whatsapp: MessageCircle,
  map: MapPin,
} as const;

export type BonusIcon = keyof typeof BONUS_ICONS;

export function BonusCover({ icon, kind, title }: { icon: BonusIcon; kind: string; title: string }) {
  const Icon = BONUS_ICONS[icon];
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#0b1735] via-[#1b1f5e] to-[#2a1660] text-white grid place-items-center p-6">
      <div className="absolute -top-10 -right-10 size-40 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />
      <div className="relative w-[70%] max-w-xs rounded-xl bg-white text-[#0b1735] shadow-2xl p-4 rotate-[-3deg]">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center size-8 rounded-lg bg-indigo-100 text-indigo-700">
            <Icon className="size-4" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">{kind}</span>
        </div>
        <div className="mt-2 text-sm sm:text-base font-black leading-tight">{title}</div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 rounded bg-slate-200 w-full" />
          <div className="h-1.5 rounded bg-slate-200 w-5/6" />
          <div className="h-1.5 rounded bg-slate-200 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function PromptVaultThumb() {
  return (
    <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-[#0b1735] via-[#1b1f5e] to-[#2a1660] text-white grid place-items-center p-2 text-center">
      <div>
        <div className="mx-auto grid place-items-center size-9 rounded-xl bg-yellow-400 text-[#0b1735]">
          <Bot className="size-5" />
        </div>
        <div className="mt-1.5 text-[10px] font-black uppercase leading-tight">
          AI Prompt <span className="text-yellow-300">Vault</span>
        </div>
        <div className="mt-0.5 flex items-center justify-center gap-0.5 text-[8px] font-bold text-white/80">
          <Sparkles className="size-2.5" /> Business Owners
        </div>
      </div>
    </div>
  );
}
