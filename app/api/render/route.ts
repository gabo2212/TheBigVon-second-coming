import { NextResponse } from "next/server";
import { writeExportToLocalStack } from "@/lib/server/project-repository";
import type { SkitProject } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { project?: SkitProject };

    if (!body.project?.id) {
      return NextResponse.json({ error: "A project with an id is required for export." }, { status: 400 });
    }

    const artifact = await writeExportToLocalStack(body.project);

    return NextResponse.json({
      status: "preview_export_saved",
      storage: "localstack",
      artifact,
      message: "Static preview/export artifact saved to LocalStack S3. MP4 render jobs remain Phase 3.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "preview_only",
        storage: "local",
        localstackAvailable: false,
        error: error instanceof Error ? error.message : "LocalStack export failed.",
        message: "MP4 render jobs are planned for Phase 3. The MVP exposes a static preview.",
      },
      { status: 503 },
    );
  }
}
