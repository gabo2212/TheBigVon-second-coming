import { AlertTriangle } from "lucide-react";
import type { DashboardStat } from "@/lib/types";

type StatChipProps = {
  stat: DashboardStat;
};

const toneClass: Record<DashboardStat["tone"], string> = {
  danger: "border-warning-400/50 bg-warning-500/15 text-warning-100",
  caution: "border-amber-300/40 bg-amber-500/10 text-amber-100",
  neutral: "border-chrome-200/20 bg-chrome-100/5 text-chrome-100",
  good: "border-petrol-200/40 bg-petrol-400/10 text-petrol-100",
};

export function StatChip({ stat }: StatChipProps) {
  return (
    <div className={`rounded-2xl border p-3 ${toneClass[stat.tone]}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] opacity-80">{stat.label}</span>
        {stat.tone === "danger" && <AlertTriangle className="h-3.5 w-3.5" />}
      </div>
      <div className="text-2xl font-black leading-none">{stat.value}</div>
    </div>
  );
}
