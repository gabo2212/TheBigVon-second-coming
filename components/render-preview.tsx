"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mic2, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SubtitleCard } from "@/components/subtitle-card";
import { ThumbnailPreview } from "@/components/thumbnail-preview";
import { cacheProject, getProject } from "@/lib/storage";
import type { SkitProject } from "@/lib/types";

type RenderPreviewProps = {
  projectId: string;
};

export function RenderPreview({ projectId }: RenderPreviewProps) {
  const [project, setProject] = useState<SkitProject | null>(null);
  const [exportStatus, setExportStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
            setExportStatus("LocalStack is offline. The preview is using the browser-saved project.");
          }
          return;
        }

        const data = await response.json();

        if (data.project && active) {
          const remoteProject = data.project as SkitProject;
          cacheProject(remoteProject);
          setProject(remoteProject);
          setExportStatus("");
        }
      })
      .catch(() => {
        if (localProject && active) {
          setExportStatus("LocalStack is offline. The preview is using the browser-saved project.");
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

  if (isLoading && !project) {
    return <AppShell title="Loading preview..." />;
  }

  if (!project) {
    return (
      <AppShell title="Preview missing" description="Render preview needs a locally saved project.">
        <Link href="/create" className="inline-flex rounded-2xl bg-warning-500 px-5 py-3 font-black uppercase tracking-[0.16em] text-warning-100">
          Create skit
        </Link>
      </AppShell>
    );
  }

  async function exportPreview() {
    if (!project) {
      return;
    }

    setIsExporting(true);
    setExportStatus("");

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });
      const data = await response.json();

      if (!response.ok) {
        setExportStatus("LocalStack S3 is offline, so the static preview remains local only.");
        return;
      }

      cacheProject(project);
      setExportStatus(`Saved export artifact to s3://${data.artifact.bucket}/${data.artifact.key}`);
    } catch {
      setExportStatus("LocalStack S3 is offline, so the static preview remains local only.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AppShell eyebrow="Phase 2 Preview Surface" title="Vertical short-form mock render" description="This is a static preview target now; MP4 rendering can plug into this surface later without changing the project shape.">
      <div className="mb-6">
        <Link href={`/results/${project.id}`} className="rounded-full border border-chrome-100/10 px-4 py-2 text-sm hover:border-warning-300/50">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Back to result
        </Link>
        <button
          type="button"
          onClick={exportPreview}
          disabled={isExporting}
          className="ml-3 rounded-full border border-petrol-200/40 bg-petrol-400/10 px-4 py-2 text-sm text-petrol-100 hover:bg-petrol-400/20 disabled:opacity-60"
        >
          {isExporting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 inline h-4 w-4" />}
          Save export to S3
        </button>
      </div>
      {exportStatus && (
        <div className="mb-6 rounded-[1.5rem] border border-petrol-200/30 bg-petrol-400/10 p-4 text-sm leading-6 text-petrol-50">
          {exportStatus}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <ThumbnailPreview project={project} />
        <section className="space-y-5">
          <div className="case-panel rounded-[2rem] p-5">
            <div className="mb-3 flex items-center gap-3">
              <Mic2 className="h-5 w-5 text-warning-200" />
              <p className="text-xs uppercase tracking-[0.3em] text-warning-200">Narrator Placeholder</p>
            </div>
            <p className="text-chrome-200">{project.narrator_script}</p>
          </div>
          {project.scenes.map((scene) => (
            <SubtitleCard key={scene.id} scene={scene} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
