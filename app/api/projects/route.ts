import { NextResponse } from "next/server";
import { listProjectsFromLocalStack, saveProjectToLocalStack } from "@/lib/server/project-repository";
import type { SkitProject } from "@/lib/types";

export async function GET() {
  try {
    const projects = await listProjectsFromLocalStack();
    return NextResponse.json({ projects, storage: "localstack" });
  } catch (error) {
    return NextResponse.json(
      {
        projects: [],
        storage: "local",
        localstackAvailable: false,
        error: error instanceof Error ? error.message : "LocalStack project list failed.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { project?: SkitProject };

    if (!body.project?.id) {
      return NextResponse.json({ error: "A project with an id is required." }, { status: 400 });
    }

    const project = await saveProjectToLocalStack(body.project);
    return NextResponse.json({ project, storage: "localstack" });
  } catch (error) {
    return NextResponse.json(
      {
        storage: "local",
        localstackAvailable: false,
        error: error instanceof Error ? error.message : "LocalStack project save failed.",
      },
      { status: 503 },
    );
  }
}
