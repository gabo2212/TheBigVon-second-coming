"use client";

type ChaosSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export function ChaosSlider({ value, onChange }: ChaosSliderProps) {
  return (
    <label className="block rounded-[1.35rem] border border-chrome-100/10 bg-black/25 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-[0.28em] text-chrome-300">Chaos Level</span>
        <span className="rounded-full border border-warning-300/40 bg-warning-500/15 px-3 py-1 font-black text-warning-100">{value}/10</span>
      </div>
      <input
        min={1}
        max={10}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full accent-warning-500"
      />
      <div className="mt-3 flex justify-between text-[0.65rem] uppercase tracking-[0.2em] text-chrome-500">
        <span>Minor roast</span>
        <span>Repo truck aura</span>
      </div>
    </label>
  );
}
