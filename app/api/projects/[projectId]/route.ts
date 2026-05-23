import { NextResponse } from "next/server";
import {
  deleteProjectFromLocalStack,
  getProjectFromLocalStack,
  saveProjectToLocalStack,
} from "@/lib/server/project-repository";
import type { SkitProject } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const project = await getProjectFromLocalStack(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project, storage: "localstack" });
  } catch (error) {
    return NextResponse.json(
      {
        storage: "local",
        localstackAvailable: false,
        error: error instanceof Error ? error.message : "LocalStack project read failed.",
      },
      { status: 503 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const body = (await request.json()) as { project?: SkitProject };

    if (!body.project?.id || body.project.id !== projectId) {
      return NextResponse.json({ error: "Project id mismatch." }, { status: 400 });
    }

    const project = await saveProjectToLocalStack(body.project);
    return NextResponse.json({ project, storage: "localstack" });
  } catch (error) {
    return NextResponse.json(
      {
        storage: "local",
        localstackAvailable: false,
        error: error instanceof Error ? error.message : "LocalStack project update failed.",
      },
      { status: 503 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    await deleteProjectFromLocalStack(projectId);
    return NextResponse.json({ projectId, deleted: true, storage: "localstack" });
  } catch (error) {
    return NextResponse.json(
      {
        storage: "local",
        localstackAvailable: false,
        error: error instanceof Error ? error.message : "LocalStack project delete failed.",
      },
      { status: 503 },
    );
  }
}
