"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DashboardPreview } from "@/components/dashboard-preview";
import { cacheProject, getProject, saveProject } from "@/lib/storage";
import type { SkitProject } from "@/lib/types";

type SceneEditorProps = {
  projectId: string;
};

export function SceneEditor({ projectId }: SceneEditorProps) {
  const [project, setProject] = useState<SkitProject | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    let active = true;
    const localProject = getProject(projectId) ?? null;

    if (active) {
      setProject(localProject);
      setIsLoading(!localProject);
    }

    fetch(`/api/projects/${projectId}`)
      .then(async (response) => {
        if (!response.ok) {
          if (localProject && active) {
            setWarning("LocalStack is offline. Editing the browser-saved project instead.");
          }
          return;
        }

        const data = await response.json();

        if (data.project && active) {
          const remoteProject = data.project as SkitProject;
          cacheProject(remoteProject);
          setProject(remoteProject);
          setWarning("");
        }
      })
      .catch(() => {
        if (localProject && active) {
          setWarning("LocalStack is offline. Editing the browser-saved project instead.");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  function updateProject(next: SkitProject) {
    setProject(next);
    saveProject(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);

    void fetch(`/api/projects/${next.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: next }),
    })
      .then((response) => {
        if (!response.ok) {
          setWarning("Saved locally. LocalStack sync is offline right now.");
          return;
        }

        setWarning("");
      })
      .catch(() => {
        setWarning("Saved locally. LocalStack sync is offline right now.");
      });
  }

  if (isLoading && !project) {
    return <AppShell title="Loading editor case file..." />;
  }

  if (!project) {
    return (
      <AppShell title="Editor case file missing" description="Open a saved project or create a new skit first.">
        <Link href="/create" className="inline-flex rounded-2xl bg-warning-500 px-5 py-3 font-black uppercase tracking-[0.16em] text-warning-100">
          Create skit
        </Link>
      </AppShell>
    );
  }

  const setStat = (index: number, field: "label" | "value", value: string) => {
    const dashboard = project.dashboard.map((stat, statIndex) =>
      statIndex === index ? { ...stat, [field]: value } : stat,
    );
    updateProject({ ...project, dashboard });
  };

  return (
    <AppShell eyebrow="Scene Editor" title="Tune the captions, lines, stats, and punchline.">
      {warning && (
        <div className="mb-6 rounded-[1.5rem] border border-amber-300/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
          {warning}
        </div>
      )}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href={`/results/${project.id}`} className="rounded-full border border-chrome-100/10 px-4 py-2 text-sm hover:border-warning-300/50">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Back to result
        </Link>
        <span className="rounded-full border border-petrol-200/40 bg-petrol-400/10 px-4 py-2 text-sm text-petrol-100">
          <Save className="mr-2 inline h-4 w-4" />
          {saved ? "Saved locally" : "Auto-saves edits"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="case-panel rounded-[2rem] p-5">
          <label className="mb-4 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-chrome-400">Title</span>
            <input
              value={project.title}
              onChange={(event) => updateProject({ ...project, title: event.target.value })}
              className="w-full rounded-2xl border border-chrome-100/10 bg-black/40 p-4 font-display text-2xl font-black uppercase text-chrome-50 outline-none focus:border-warning-300/60"
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-chrome-400">Hook</span>
            <textarea
              value={project.hook}
              rows={3}
              onChange={(event) => updateProject({ ...project, hook: event.target.value })}
              className="w-full resize-none rounded-2xl border border-chrome-100/10 bg-black/40 p-4 text-chrome-50 outline-none focus:border-warning-300/60"
            />
          </label>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl font-black uppercase">Scenes</h3>
            <button
              type="button"
              onClick={() =>
                updateProject({
                  ...project,
                  scenes: [
                    ...project.scenes,
                    {
                      id: `scene-${Date.now()}`,
                      order: project.scenes.length + 1,
                      caption: "New warning caption",
                      line: "Add the next ridiculous consequence here.",
                      overlay: "Stare Reaction: Pending",
                    },
                  ],
                })
              }
              className="rounded-full border border-petrol-200/40 bg-petrol-400/10 px-4 py-2 text-sm text-petrol-100"
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Scene
            </button>
          </div>

          <div className="space-y-4">
            {project.scenes.map((scene, index) => (
              <div key={scene.id} className="rounded-[1.5rem] border border-chrome-100/10 bg-black/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.26em] text-warning-200">Scene {scene.order}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateProject({
                        ...project,
                        scenes: project.scenes
                          .filter((item) => item.id !== scene.id)
                          .map((item, orderIndex) => ({ ...item, order: orderIndex + 1 })),
                      })
                    }
                    className="text-chrome-400 hover:text-warning-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={scene.caption}
                  onChange={(event) =>
                    updateProject({
                      ...project,
                      scenes: project.scenes.map((item, sceneIndex) =>
                        sceneIndex === index ? { ...item, caption: event.target.value } : item,
                      ),
                    })
                  }
                  className="mb-3 w-full rounded-xl border border-chrome-100/10 bg-black/40 p-3 font-black uppercase text-chrome-50 outline-none focus:border-warning-300/60"
                />
                <textarea
                  value={scene.line}
                  rows={3}
                  onChange={(event) =>
                    updateProject({
                      ...project,
                      scenes: project.scenes.map((item, sceneIndex) =>
                        sceneIndex === index ? { ...item, line: event.target.value } : item,
                      ),
                    })
                  }
                  className="mb-3 w-full resize-none rounded-xl border border-chrome-100/10 bg-black/40 p-3 text-chrome-50 outline-none focus:border-warning-300/60"
                />
                <input
                  value={scene.overlay ?? ""}
                  onChange={(event) =>
                    updateProject({
                      ...project,
                      scenes: project.scenes.map((item, sceneIndex) =>
                        sceneIndex === index ? { ...item, overlay: event.target.value } : item,
                      ),
                    })
                  }
                  className="w-full rounded-xl border border-chrome-100/10 bg-black/40 p-3 text-sm text-petrol-100 outline-none focus:border-warning-300/60"
                />
              </div>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-chrome-400">Ending</span>
            <textarea
              value={project.ending}
              rows={2}
              onChange={(event) => updateProject({ ...project, ending: event.target.value })}
              className="w-full resize-none rounded-2xl border border-chrome-100/10 bg-black/40 p-4 font-black uppercase text-chrome-50 outline-none focus:border-warning-300/60"
            />
          </label>
        </section>

        <aside className="space-y-6">
          <DashboardPreview stats={project.dashboard} title="Editable Dashboard" />
          <section className="case-panel rounded-[2rem] p-5">
            <h3 className="mb-4 font-display text-2xl font-black uppercase">Dashboard Stats</h3>
            <div className="space-y-3">
              {project.dashboard.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="grid grid-cols-2 gap-2">
                  <input
                    value={stat.label}
                    onChange={(event) => setStat(index, "label", event.target.value)}
                    className="rounded-xl border border-chrome-100/10 bg-black/40 p-3 text-sm text-chrome-50 outline-none focus:border-warning-300/60"
                  />
                  <input
                    value={stat.value}
                    onChange={(event) => setStat(index, "value", event.target.value)}
                    className="rounded-xl border border-chrome-100/10 bg-black/40 p-3 text-sm text-warning-100 outline-none focus:border-warning-300/60"
                  />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
