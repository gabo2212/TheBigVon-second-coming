import { FileText } from "lucide-react";
import type { SkitScene } from "@/lib/types";

type SubtitleCardProps = {
  scene: SkitScene;
};

export function SubtitleCard({ scene }: SubtitleCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-chrome-100/10 bg-black/35 p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full border border-warning-300/30 bg-warning-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-warning-100">
          Scene {scene.order}
        </span>
        <FileText className="h-4 w-4 text-petrol-200" />
      </div>
      <h4 className="mb-3 font-display text-xl font-black uppercase text-chrome-50">{scene.caption}</h4>
      <p className="leading-7 text-chrome-200">{scene.line}</p>
      {scene.overlay && (
        <p className="mt-4 rounded-xl border border-petrol-200/20 bg-petrol-400/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-petrol-100">
          {scene.overlay}
        </p>
      )}
    </article>
  );
}
