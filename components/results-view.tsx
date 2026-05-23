"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Film, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DashboardPreview } from "@/components/dashboard-preview";
import { ExportActions } from "@/components/export-actions";
import { SubtitleCard } from "@/components/subtitle-card";
import { ThumbnailPreview } from "@/components/thumbnail-preview";
import { cacheProject, getProject } from "@/lib/storage";
import type { SkitProject } from "@/lib/types";

type ResultsViewProps = {
  projectId: string;
};

export function ResultsView({ projectId }: ResultsViewProps) {
  const [project, setProject] = useState<SkitProject | null>(null);
  const [remoteResolved, setRemoteResolved] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    let active = true;
    const localProject = getProject(projectId) ?? null;

    if (active) {
      setProject(localProject);
      setRemoteResolved(Boolean(localProject));
    }

    const notice = window.sessionStorage.getItem("demondash.localstackNotice");
    if (notice && active) {
      setWarning(notice);
      window.sessionStorage.removeItem("demondash.localstackNotice");
    }

    fetch(`/api/projects/${projectId}`)
      .then(async (response) => {
        if (!response.ok) {
          if (localProject && active) {
            setWarning((current) => current || "LocalStack is offline. Showing the browser-saved project instead.");
          }
          return;
        }

        const data = await response.json();
        if (data.project && active) {
          const remoteProject = data.project as SkitProject;
          cacheProject(remoteProject);
          setProject(remoteProject);
        }
      })
      .catch(() => {
        if (localProject && active) {
          setWarning((current) => current || "LocalStack is offline. Showing the browser-saved project instead.");
        }
      })
      .finally(() => {
        if (active) {
          setRemoteResolved(true);
        }
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  if (!remoteResolved && !project) {
    return <AppShell title="Loading case file..." />;
  }

  if (!project) {
    return (
      <AppShell title="Case file missing" description="This project is saved in your browser, so it may be on another device or cleared from storage.">
        <Link href="/create" className="inline-flex rounded-2xl bg-warning-500 px-5 py-3 font-black uppercase tracking-[0.16em] text-warning-100">
          Back to create
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Generated Case File" title={project.title} description={project.hook}>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/create" className="rounded-full border border-chrome-100/10 px-4 py-2 text-sm hover:border-warning-300/50">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          New skit
        </Link>
        <Link href={`/editor/${project.id}`} className="rounded-full border border-warning-300/40 bg-warning-500/15 px-4 py-2 text-sm text-warning-100 hover:bg-warning-500/25">
          <Edit3 className="mr-2 inline h-4 w-4" />
          Edit result
        </Link>
        <Link href={`/render/${project.id}`} className="rounded-full border border-petrol-200/40 bg-petrol-400/10 px-4 py-2 text-sm text-petrol-100 hover:bg-petrol-400/20">
          <Film className="mr-2 inline h-4 w-4" />
          Preview render
        </Link>
      </div>

      {project.safety_rewrites?.status === "rewritten" && (
        <div className="mb-6 rounded-[1.5rem] border border-petrol-200/30 bg-petrol-400/10 p-4 text-sm leading-6 text-petrol-50">
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          Safety rewrite applied: “{project.safety_rewrites.original}” became “{project.safety_rewrites.rewritten}”.
        </div>
      )}
      {warning && (
        <div className="mb-6 rounded-[1.5rem] border border-amber-300/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
          {warning}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <DashboardPreview stats={project.dashboard} title="Generated Dashboard" />
          <div className="grid gap-4">
            {project.scenes.map((scene) => (
              <SubtitleCard key={scene.id} scene={scene} />
            ))}
          </div>
          <section className="case-panel rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-warning-200">Humble Ending</p>
            <p className="mt-3 font-display text-3xl font-black uppercase leading-tight text-chrome-50">{project.ending}</p>
          </section>
          <ExportActions project={project} />
        </section>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ThumbnailPreview project={project} />
        </aside>
      </div>
    </AppShell>
  );
}
