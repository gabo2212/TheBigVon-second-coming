import { NextResponse } from "next/server";
import { generateSkit } from "@/lib/generation/generator";
import type { GenerateRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const project = generateSkit({
      ...body,
      chaosLevel: Math.min(10, Math.max(1, Number(body.chaosLevel) || 6))
    });

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to generate skit."
      },
      { status: 400 }
    );
  }
}
