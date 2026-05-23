"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertOctagon, FileWarning, Loader2, Sparkles, Wand2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChaosSlider } from "@/components/chaos-slider";
import { DashboardPreview } from "@/components/dashboard-preview";
import { ModeSelector } from "@/components/mode-selector";
import { modes } from "@/lib/modes";
import { cacheProject, saveProject } from "@/lib/storage";
import type { EndingStyle, FormatType, GenerateRequest, ModeId, SkitProject } from "@/lib/types";

const samples = [
  "Pulled up in a Hellcat with 707 hp and $14 in gas.",
  "Bro said he had exotic but pulled out barbecue chips.",
  "He said he was 5 minutes away for 2 hours and posted wings.",
  "I posted the rental like it was mine and Enterprise called my mom.",
  "Woke up in Demon Mode then remembered court was at 9:30.",
];

const endings: EndingStyle[] = ["humiliating", "broke", "exposed", "mechanical_failure", "legal_panic", "group_chat_roast"];
const formats: FormatType[] = ["tiktok_skit", "reels_caption", "shorts_script", "case_file"];

const previewStats = [
  { label: "Demon Mode", value: "UNSTABLE", tone: "danger" as const },
  { label: "Gas Money", value: "CRITICAL", tone: "danger" as const },
  { label: "Stare Factor", value: "FADING", tone: "caution" as const },
  { label: "Punchline", value: "ARMED", tone: "good" as const },
  { label: "Real Crime", value: "BLOCKED", tone: "good" as const },
  { label: "Consequences", value: "LOCKED", tone: "neutral" as const },
];

export function CreateForm() {
  const router = useRouter();
  const [scenario, setScenario] = useState(samples[0]);
  const [mode, setMode] = useState<ModeId>("hellcat_demon");
  const [chaosLevel, setChaosLevel] = useState(8);
  const [endingStyle, setEndingStyle] = useState<EndingStyle>("humiliating");
  const [format, setFormat] = useState<FormatType>("tiktok_skit");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsLoading(true);

    const payload: GenerateRequest = {
      scenario,
      mode,
      chaosLevel,
      endingStyle,
      format,
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "The skit generator stalled out.");
      }

      const project = data.project as SkitProject;
      saveProject(project);

      const persistence = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (!persistence.ok) {
        window.sessionStorage.setItem(
          "demondash.localstackNotice",
          "LocalStack persistence is offline, so this project was saved in browser storage only.",
        );
      } else {
        const persistenceData = (await persistence.json()) as { project?: SkitProject };

        if (persistenceData.project) {
          cacheProject(persistenceData.project);
        }

        if (project.safety_rewrites.status === "rewritten") {
          window.sessionStorage.setItem(
            "demondash.localstackNotice",
            "Safety rewrite applied and the project was saved to LocalStack.",
          );
        }
      }

      router.push(`/results/${project.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went sideways.");
    } finally {
      setIsLoading(false);
    }
  }

  const selectedMode = modes.find((item) => item.id === mode) ?? modes[0];

  return (
    <AppShell
      eyebrow="MVP Generator"
      title="Turn bad decisions into dramatic skits."
      description="Write the messy setup, pick the chaos flavor, and DemonDash turns it into a cinematic parody with warning gauges, caption cards, and a consequence-first punchline."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="case-panel rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-petrol-200/20 bg-petrol-400/10 p-4">
            <FileWarning className="mt-1 h-5 w-5 shrink-0 text-petrol-200" />
            <p className="text-sm leading-6 text-chrome-200">
              Edgy is welcome; real crime instructions are not. Unsafe setups get rewritten into fake snacks, broke flexes, friend drama, and public embarrassment.
            </p>
          </div>

          <label className="mb-5 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-chrome-300">Scenario</span>
            <textarea
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
              rows={5}
              placeholder="Example: I rented a Hellcat for one day and started acting like it was mine."
              className="w-full resize-none rounded-[1.5rem] border border-chrome-100/10 bg-black/45 p-4 text-lg leading-7 text-chrome-50 outline-none transition placeholder:text-chrome-500 focus:border-warning-300/60"
              required
            />
          </label>

          <div className="mb-5 flex flex-wrap gap-2">
            {samples.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setScenario(sample)}
                className="rounded-full border border-chrome-100/10 bg-black/25 px-3 py-2 text-xs text-chrome-300 hover:border-warning-300/50 hover:text-warning-100"
              >
                {sample}
              </button>
            ))}
          </div>

          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.28em] text-chrome-300">Mode</span>
              <span className="text-xs text-warning-100">{selectedMode.safetyNote}</span>
            </div>
            <ModeSelector value={mode} onChange={setMode} />
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <ChaosSlider value={chaosLevel} onChange={setChaosLevel} />
            <label className="block rounded-[1.35rem] border border-chrome-100/10 bg-black/25 p-4">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-chrome-300">Ending Style</span>
              <select
                value={endingStyle}
                onChange={(event) => setEndingStyle(event.target.value as EndingStyle)}
                className="w-full rounded-xl border border-chrome-100/10 bg-black/45 p-3 text-chrome-50 outline-none focus:border-warning-300/60"
              >
                {endings.map((ending) => (
                  <option key={ending} value={ending}>
                    {ending.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mb-5 block rounded-[1.35rem] border border-chrome-100/10 bg-black/25 p-4">
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-chrome-300">Format</span>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as FormatType)}
              className="w-full rounded-xl border border-chrome-100/10 bg-black/45 p-3 text-chrome-50 outline-none focus:border-warning-300/60"
            >
              {formats.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>

          {notice && <p className="mb-4 rounded-2xl border border-petrol-200/30 bg-petrol-400/10 p-3 text-sm text-petrol-100">{notice}</p>}
          {error && (
            <p className="mb-4 flex items-center gap-2 rounded-2xl border border-warning-300/40 bg-warning-500/15 p-3 text-sm text-warning-100">
              <AlertOctagon className="h-4 w-4" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-warning-500 px-5 py-4 font-black uppercase tracking-[0.18em] text-warning-100 transition hover:bg-warning-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            Generate Crazy Story
          </button>
        </form>

        <aside className="space-y-6">
          <DashboardPreview stats={previewStats} />
          <section className="case-panel rounded-[2rem] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl border border-warning-300/40 bg-warning-500/15 p-3 text-warning-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-chrome-400">Output Contract</p>
                <h3 className="font-display text-2xl font-black uppercase text-chrome-50">Structured, editable, exportable</h3>
              </div>
            </div>
            <div className="space-y-3 text-sm leading-6 text-chrome-300">
              <p>Every result includes a title, hook, dashboard stats, 3-8 scenes, caption cards, narrator notes, rewrite notice, and a humble ending.</p>
              <p>The punchline always bends toward consequences: gas prices, rental exposure, court panic, check-engine lights, repo energy, or the group chat cooking everybody.</p>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
