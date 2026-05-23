"use client";

import { useState } from "react";
import { Check, Clipboard, FileJson, FileText } from "lucide-react";
import { formatProjectScript } from "@/lib/storage";
import type { SkitProject } from "@/lib/types";

type ExportActionsProps = {
  project: SkitProject;
};

export function ExportActions({ project }: ExportActionsProps) {
  const [copied, setCopied] = useState("");

  async function copy(label: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  const captions = project.scenes.map((scene) => `${scene.caption}\n${scene.line}`).join("\n\n");

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <button
        type="button"
        onClick={() => copy("script", formatProjectScript(project))}
        className="rounded-2xl border border-chrome-100/10 bg-black/35 p-4 text-left hover:border-warning-300/50"
      >
        {copied === "script" ? <Check className="mb-3 h-5 w-5 text-petrol-200" /> : <FileText className="mb-3 h-5 w-5 text-warning-200" />}
        <span className="font-black uppercase tracking-[0.16em]">Copy Script</span>
      </button>
      <button
        type="button"
        onClick={() => copy("captions", captions)}
        className="rounded-2xl border border-chrome-100/10 bg-black/35 p-4 text-left hover:border-warning-300/50"
      >
        {copied === "captions" ? <Check className="mb-3 h-5 w-5 text-petrol-200" /> : <Clipboard className="mb-3 h-5 w-5 text-warning-200" />}
        <span className="font-black uppercase tracking-[0.16em]">Copy Captions</span>
      </button>
      <button
        type="button"
        onClick={() => copy("json", JSON.stringify(project, null, 2))}
        className="rounded-2xl border border-chrome-100/10 bg-black/35 p-4 text-left hover:border-warning-300/50"
      >
        {copied === "json" ? <Check className="mb-3 h-5 w-5 text-petrol-200" /> : <FileJson className="mb-3 h-5 w-5 text-warning-200" />}
        <span className="font-black uppercase tracking-[0.16em]">Copy JSON</span>
      </button>
    </div>
  );
}
