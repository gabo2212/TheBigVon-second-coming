"use client";

import type { SkitProject } from "@/lib/types";

const STORAGE_KEY = "demondash.projects";

function sortProjects(projects: SkitProject[]): SkitProject[] {
  return [...projects].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function writeProjects(projects: SkitProject[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortProjects(projects)));
}

export function getProjects(): SkitProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SkitProject[]) : [];
  } catch {
    return [];
  }
}

export function getProject(id: string): SkitProject | undefined {
  return getProjects().find((project) => project.id === id);
}

export function mergeProjects(...collections: SkitProject[][]): SkitProject[] {
  const projectsById = new Map<string, SkitProject>();

  for (const collection of collections) {
    for (const project of collection) {
      const current = projectsById.get(project.id);

      if (!current || project.updatedAt.localeCompare(current.updatedAt) > 0) {
        projectsById.set(project.id, project);
      }
    }
  }

  return sortProjects(Array.from(projectsById.values()));
}

export function cacheProject(project: SkitProject): void {
  cacheProjects([project]);
}

export function cacheProjects(projects: SkitProject[]): void {
  writeProjects(mergeProjects(getProjects(), projects));
}

export function saveProject(project: SkitProject): void {
  const nextProject = { ...project, updatedAt: new Date().toISOString() };
  writeProjects(mergeProjects(getProjects(), [nextProject]));
}

export function deleteProject(id: string): void {
  const next = getProjects().filter((project) => project.id !== id);
  writeProjects(next);
}

export function formatProjectScript(project: SkitProject): string {
  const scenes = project.scenes
    .map((scene, index) => `${index + 1}. [${scene.caption}] ${scene.line}`)
    .join("\n");

  return [
    project.title,
    "",
    `Hook: ${project.hook}`,
    "",
    scenes,
    "",
    `Ending: ${project.ending}`,
    "",
    project.narrator_script ?? project.narrator
  ].join("\n");
}
