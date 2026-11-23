/**
 * Code-drawn visuals for the /authority sales page.
 * Pure CSS/SVG — no image assets, so they stay sharp and load instantly.
 * Colours follow the Zero Apple A Day logo: teal #3AA8B4 → blue #326CA1, leaf green #95C05B, slate #4A5A70.
 * Copy is deliberately outcome-focused and never reveals the mechanism.
 */
import type { LucideIcon } from "lucide-react";
import {
  Award,
  CalendarCheck,
  CalendarDays,
  Crown,
  Eye,
  Flame,
  Handshake,
  Map as MapIcon,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  BellRing,
} from "lucide-react";

/* ---------- Problem: crowd of doctors, only one remembered ---------- */

export function CrowdVisual() {
  const total = 15;
  const you = 7;
  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-[#0f2a44] p-6 text-white shadow-2xl md:p-8">
      <div className="text-center text-xs font-black uppercase tracking-[0.2em] text-[#95C05B]">
        What patients in your city see
      </div>
      <div className="mt-6 grid grid-cols-5 justify-items-center gap-4 md:gap-6">
        {Array.from({ length: total }).map((_, i) =>
          i === you ? (
            <div key={i} className="relative">
              <Crown className="absolute -top-5 left-1/2 size-5 -translate-x-1/2 text-[#95C05B]" />
              <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#3AA8B4] to-[#326CA1] shadow-[0_0_35px_rgba(58,168,180,0.65)] ring-4 ring-[#3AA8B4]/30 md:size-16">
                <UserRound className="size-7 text-white md:size-8" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#95C05B] px-2 py-0.5 text-[10px] font-black text-[#0f2a44]">
                YOU
              </div>
            </div>
          ) : (
            <div
              key={i}
              className="grid size-11 place-items-center rounded-full bg-white/10 opacity-50 md:size-12"
            >
              <UserRound className="size-5 text-white/50" />
            </div>
          ),
        )}
      </div>
      <p className="mt-10 text-center text-sm leading-6 text-white/70 md:text-base">
        Dozens of qualified doctors. Patients only remember a few.{" "}
        <span className="font-bold text-white">The goal: make sure one of them is you.</span>
      </p>
    </div>
  );
}

/* ---------- 5 steps: illustrated tiles ---------- */

const STEP_ART: {
  icon: LucideIcon;
  from: string;
  to: string;
  deco: "rings" | "dots" | "stars" | "pulse" | "check";
}[] = [
  { icon: Eye, from: "from-[#3AA8B4]", to: "to-[#326CA1]", deco: "rings" },
  { icon: Flame, from: "from-[#3AA8B4]", to: "to-[#326CA1]", deco: "dots" },
  { icon: Award, from: "from-[#3AA8B4]", to: "to-[#326CA1]", deco: "stars" },
  { icon: BellRing, from: "from-[#3AA8B4]", to: "to-[#326CA1]", deco: "pulse" },
  { icon: CalendarCheck, from: "from-[#3AA8B4]", to: "to-[#326CA1]", deco: "check" },
];

export function StepArt({ index }: { index: number }) {
  const a = STEP_ART[index % STEP_ART.length];
  const Icon = a.icon;
  return (
    <div
      className={`relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br ${a.from} ${a.to}`}
    >
      {a.deco === "rings" && (
        <>
          <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/15" />
          <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25" />
        </>
      )}
      {a.deco === "dots" &&
        [
          [12, 18],
          [78, 22],
          [20, 72],
          [82, 70],
          [50, 12],
        ].map(([x, y], k) => (
          <div
            key={k}
            className="absolute grid size-6 place-items-center rounded-full bg-white/25"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <UserRound className="size-3.5 text-white" />
          </div>
        ))}
      {a.deco === "stars" &&
        [
          [14, 20],
          [80, 18],
          [18, 70],
          [84, 68],
        ].map(([x, y], k) => (
          <Star
            key={k}
            className="absolute size-4 fill-white/70 text-white/70"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      {a.deco === "pulse" && (
        <>
          <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/15" />
          <div className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[#326CA1]">
            Dr. You
          </div>
        </>
      )}
      {a.deco === "check" && (
        <div className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[#5f8f2a]">
          Booked ✓
        </div>
      )}
      <div className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-white shadow-xl">
        <Icon className="size-7 text-[#326CA1]" />
      </div>
      <div className="absolute bottom-2 left-3 text-3xl font-black text-white/30">0{index + 1}</div>
    </div>
  );
}

/* ---------- Circular result diagram ---------- */

export function AuthorityCycle() {
  const nodes = ["Get Seen", "Warm Audience", "Authority", "Top-of-Mind", "Get Chosen"];
  const cx = 200,
    cy = 200,
    r = 140;
  const pts = nodes.map((_, i) => {
    const ang = (-90 + i * 72) * (Math.PI / 180);
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  });
  const colors = ["#3AA8B4", "#3591AF", "#337EA8", "#326CA1", "#95C05B"];
  const arc = (i: number) => {
    const a1 = (-90 + i * 72 + 17) * (Math.PI / 180);
    const a2 = (-90 + (i + 1) * 72 - 17) * (Math.PI / 180);
    return `M ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}`;
  };
  return (
    <svg
      viewBox="0 0 400 400"
      className="mx-auto h-auto w-full max-w-[360px]"
      role="img"
      aria-label="Get Seen, Warm Audience, Authority, Top-of-Mind, Get Chosen — leading to more appointments"
    >
      <defs>
        <marker
          id="cyc-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#3AA8B4" />
        </marker>
        <radialGradient id="cyc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3AA8B4" />
          <stop offset="100%" stopColor="#326CA1" />
        </radialGradient>
      </defs>
      {nodes.map((_, i) => (
        <path
          key={i}
          d={arc(i)}
          fill="none"
          stroke="#9fd3d9"
          strokeWidth="3"
          strokeDasharray="6 6"
          markerEnd="url(#cyc-arrow)"
        />
      ))}
      <circle cx={cx} cy={cy} r="62" fill="url(#cyc-core)" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight="900" fill="white">
        MORE
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="13" fontWeight="900" fill="white">
        APPOINTMENTS
      </text>
      {pts.map(([x, y], i) => (
        <g key={nodes[i]}>
          <circle cx={x} cy={y} r="34" fill={colors[i]} />
          <circle cx={x} cy={y} r="34" fill="none" stroke="white" strokeWidth="4" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="16" fontWeight="900" fill="white">
            {i + 1}
          </text>
          <text
            x={x}
            y={y + (y > cy ? 52 : -44)}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill="#4A5A70"
          >
            {nodes[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Module icons ---------- */

export const MODULE_ICONS: LucideIcon[] = [
  Crown,
  MapIcon,
  Rocket,
  Handshake,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
];

/* ---------- Bonus product covers ---------- */

const COVERS: { icon: LucideIcon; from: string; to: string }[] = [
  { icon: CalendarDays, from: "from-[#3AA8B4]", to: "to-[#326CA1]" },
  { icon: Handshake, from: "from-[#326CA1]", to: "to-[#3AA8B4]" },
  { icon: Rocket, from: "from-[#3AA8B4]", to: "to-[#326CA1]" },
  { icon: Star, from: "from-[#326CA1]", to: "to-[#3AA8B4]" },
  { icon: MapIcon, from: "from-[#326CA1]", to: "to-[#3AA8B4]" },
];

export function BonusCover({ index, title }: { index: number; title: string }) {
  const c = COVERS[index % COVERS.length];
  const Icon = c.icon;
  return (
    <div className="relative mx-auto w-28 shrink-0 [perspective:600px] sm:w-32">
      <div className="relative aspect-[3/4] w-full [transform:rotateY(-14deg)] [transform-style:preserve-3d]">
        <div
          className={`absolute inset-0 overflow-hidden rounded-r-lg rounded-l-sm bg-gradient-to-br ${c.from} ${c.to} p-2.5 text-white shadow-[8px_10px_20px_rgba(15,23,42,0.35)]`}
        >
          <div className="absolute inset-y-0 left-0 w-2 bg-black/25" />
          <div className="absolute -right-6 -top-6 size-16 rounded-full bg-white/15" />
          <div className="relative pl-1.5">
            <div className="text-[8px] font-black uppercase tracking-widest text-white/80">
              Bonus #{index + 1}
            </div>
            <div className="mt-2 grid size-8 place-items-center rounded-lg bg-white/20">
              <Icon className="size-4" />
            </div>
            <div className="mt-2 text-[10px] font-black leading-tight sm:text-[11px]">{title}</div>
          </div>
          <div className="absolute bottom-2 left-4 right-2 text-[7px] font-bold uppercase tracking-wider text-white/70">
            Doctor Authority System™
          </div>
        </div>
      </div>
    </div>
  );
}
