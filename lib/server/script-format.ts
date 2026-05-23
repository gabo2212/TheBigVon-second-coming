import type { SkitProject } from "@/lib/types";

export function formatProjectScriptText(project: SkitProject): string {
  const scenes = project.scenes
    .map((scene) => `${scene.order}. [${scene.caption}] ${scene.line}`)
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
    project.narrator_script ?? project.narrator,
  ].join("\n");
}
