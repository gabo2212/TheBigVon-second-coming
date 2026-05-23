"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardPreview } from "@/components/dashboard-preview";
import { cacheProjects, getProjects, mergeProjects } from "@/lib/storage";
import type { SkitProject } from "@/lib/types";

export function DashboardHome() {
  const [projects, setProjects] = useState<SkitProject[]>([]);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const localProjects = getProjects();
    setProjects(localProjects);

    fetch("/api/projects")
      .then(async (response) => {
        if (!response.ok) {
          setWarning("LocalStack is offline, so these stats reflect browser-saved projects only.");
          return;
        }

        const data = await response.json();
        if (Array.isArray(data.projects)) {
          const remoteProjects = data.projects as SkitProject[];
          cacheProjects(remoteProjects);
          setProjects(mergeProjects(localProjects, remoteProjects));
          setWarning("");
        }
      })
      .catch(() => {
        setWarning("LocalStack is offline, so these stats reflect browser-saved projects only.");
      });
  }, []);

  const stats = useMemo(() => {
    const rewritten = projects.filter((project) => project.safety_rewrites?.status === "rewritten").length;
    return [
      { label: "Saved Skits", value: String(projects.length), tone: "neutral" as const },
      { label: "Safety Rewrites", value: String(rewritten), tone: rewritten > 0 ? ("caution" as const) : ("good" as const) },
      { label: "Blocked Crime", value: "ON", tone: "good" as const },
      { label: "MP4 Export", value: "PHASE 2", tone: "neutral" as const },
      { label: "Accounts", value: "PHASE 3", tone: "neutral" as const },
      { label: "Simulator", value: "PHASE 4", tone: "caution" as const },
    ];
  }, [projects]);

  return (
    <AppShell eyebrow="System Dashboard" title="MVP status board" description="A quick health check for the local DemonDash build, project library, safety flow, and roadmap.">
      {warning && (
        <div className="mb-6 rounded-[1.5rem] border border-amber-300/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
          {warning}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <DashboardPreview stats={stats} title="Build Warnings" />
        <section className="case-panel rounded-[2rem] p-5">
          <p className="text-xs uppercase tracking-[0.32em] text-petrol-200">Roadmap</p>
          <div className="mt-4 space-y-4 text-sm leading-6 text-chrome-300">
            <p><strong className="text-chrome-50">Phase 1:</strong> Generator, rewrite safety, editor, local saves, copy/export.</p>
            <p><strong className="text-chrome-50">Phase 2:</strong> Vertical preview, narrator block, render surface, static thumbnails.</p>
            <p><strong className="text-chrome-50">Phase 3:</strong> Accounts, database persistence, render jobs, saved user library.</p>
            <p><strong className="text-chrome-50">Phase 4:</strong> Demon Time Manager simulator with stats and daily chaos missions.</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
