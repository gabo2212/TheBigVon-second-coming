"use client";

import { modes } from "@/lib/modes";
import type { ModeId } from "@/lib/types";

type ModeSelectorProps = {
  value: ModeId;
  onChange: (value: ModeId) => void;
};

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`rounded-[1.35rem] border p-4 text-left transition hover:-translate-y-0.5 ${
            value === mode.id
              ? "border-warning-300 bg-warning-500/15 shadow-[0_0_35px_rgba(238,49,49,0.2)]"
              : "border-chrome-100/10 bg-black/25 hover:border-petrol-200/40"
          }`}
        >
          <p className="font-display text-lg font-black uppercase text-chrome-50">{mode.label}</p>
          <p className="mt-2 text-sm leading-6 text-chrome-300">{mode.description}</p>
        </button>
      ))}
    </div>
  );
}
