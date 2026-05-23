"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { cacheProjects, deleteProject, getProjects, mergeProjects } from "@/lib/storage";
import type { SkitProject } from "@/lib/types";

export function ProjectsLibrary() {
  const [projects, setProjects] = useState<SkitProject[]>([]);
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function refresh() {
    setProjects(getProjects());
  }

  useEffect(() => {
    const localProjects = getProjects();
    setProjects(localProjects);

    fetch("/api/projects")
      .then(async (response) => {
        if (!response.ok) {
          setWarning("LocalStack is offline, so this library is showing browser-saved projects only.");
          return;
        }

        const data = await response.json();
        if (Array.isArray(data.projects)) {
          const remoteProjects = data.projects as SkitProject[];
          const mergedProjects = mergeProjects(localProjects, remoteProjects);
          cacheProjects(remoteProjects);
          setProjects(mergedProjects);
          setWarning("");
        }
      })
      .catch(() => {
        setWarning("LocalStack is offline, so this library is showing browser-saved projects only.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function handleDelete(projectId: string) {
    deleteProject(projectId);
    refresh();

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 404) {
        setWarning("Project removed locally. LocalStack delete is unavailable right now.");
        return;
      }

      setWarning("");
    } catch {
      setWarning("Project removed locally. LocalStack delete is unavailable right now.");
    }
  }

  return (
    <AppShell eyebrow="Saved Library" title="Saved case files" description="Projects open from browser cache first and sync with LocalStack when the stack is running.">
      {warning && (
        <section className="mb-6 rounded-[1.5rem] border border-amber-300/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
          {warning}
        </section>
      )}
      {projects.length === 0 ? (
        <section className="case-panel rounded-[2rem] p-8 text-center">
          <p className="mb-5 text-chrome-300">
            {isLoading
              ? "Checking browser storage and LocalStack for saved projects..."
              : "No saved skits yet. The repo truck cannot repossess what does not exist."}
          </p>
          {isLoading && <Loader2 className="mx-auto mb-5 h-6 w-6 animate-spin text-warning-200" />}
          <Link href="/create" className="inline-flex rounded-2xl bg-warning-500 px-5 py-3 font-black uppercase tracking-[0.16em] text-warning-100">
            Create first skit
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="case-panel rounded-[1.75rem] p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-warning-200">{(project.mode ?? project.theme).replaceAll("_", " ")}</p>
              <h3 className="font-display text-2xl font-black uppercase text-chrome-50">{project.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-chrome-300">{project.hook}</p>
              <div className="mt-5 flex gap-2">
                <Link href={`/results/${project.id}`} className="flex-1 rounded-xl border border-warning-300/40 bg-warning-500/15 px-3 py-2 text-center text-sm font-black uppercase text-warning-100">
                  Open
                </Link>
                <button
                  type="button"
                  onClick={() => void handleDelete(project.id)}
                  className="rounded-xl border border-chrome-100/10 px-3 py-2 text-chrome-300 hover:border-warning-300/50 hover:text-warning-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
