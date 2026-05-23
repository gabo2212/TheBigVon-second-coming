import { Siren } from "lucide-react";
import { getMode } from "@/lib/modes";
import type { SkitProject } from "@/lib/types";

type ThumbnailPreviewProps = {
  project: SkitProject;
};

export function ThumbnailPreview({ project }: ThumbnailPreviewProps) {
  const mode = getMode(project.mode ?? project.theme);
  const topStats = project.dashboard.slice(0, 3);

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border border-warning-300/30 bg-[radial-gradient(circle_at_50%_10%,rgba(238,49,49,0.44),transparent_36%),linear-gradient(180deg,#171719,#050505)] p-5 shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-warning-500/25 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-warning-200/50 bg-black/50 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.2em] text-warning-100">
            {mode.label}
          </span>
          <Siren className="h-5 w-5 text-warning-200" />
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.34em] text-petrol-100">Case File</p>
          <h3 className="font-display text-4xl font-black uppercase leading-none text-warning-100">{project.title}</h3>
        </div>
        <div className="space-y-2">
          {topStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between rounded-xl border border-warning-100/10 bg-black/45 px-3 py-2 text-xs">
              <span className="uppercase tracking-[0.2em] text-chrome-300">{stat.label}</span>
              <span className="font-black text-warning-100">{stat.value}</span>
            </div>
          ))}
        </div>
        <p className="rounded-2xl bg-warning-100 px-4 py-3 text-center font-black uppercase tracking-[0.12em] text-black">
          {project.ending}
        </p>
      </div>
    </div>
  );
}
