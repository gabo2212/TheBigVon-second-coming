import { GaugeCircle } from "lucide-react";
import type { DashboardStat } from "@/lib/types";
import { StatChip } from "@/components/stat-chip";

type DashboardPreviewProps = {
  stats: DashboardStat[];
  title?: string;
};

export function DashboardPreview({ stats, title = "Demon Mode Dashboard" }: DashboardPreviewProps) {
  const dangerStats = stats.filter((stat) => stat.tone === "danger").length;
  const heat = Math.min(100, dangerStats * 24 + stats.length * 7);

  return (
    <section className="case-panel warning-scan rounded-[2rem] p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-warning-200/80">Live Overlay</p>
          <h3 className="font-display text-2xl font-black uppercase text-chrome-50">{title}</h3>
        </div>
        <div className="rounded-full border border-warning-300/30 bg-warning-500/10 p-3 text-warning-200">
          <GaugeCircle className="h-6 w-6" />
        </div>
      </div>
      <div className="mb-5">
        <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.24em] text-chrome-400">
          <span>Repo Risk Meter</span>
          <span>{heat}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-chrome-100/10">
          <div className="gauge-fill h-full rounded-full bg-gradient-to-r from-petrol-300 via-amber-300 to-warning-500" style={{ width: `${heat}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatChip key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
