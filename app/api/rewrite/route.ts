import { NextResponse } from "next/server";
import { evaluateSafety } from "@/lib/safety/rewrite";

export async function POST(request: Request) {
  const body = (await request.json()) as { scenario?: string };
  const safety = evaluateSafety(body.scenario ?? "");

  return NextResponse.json(safety, {
    status: safety.status === "blocked" ? 400 : 200
  });
}
