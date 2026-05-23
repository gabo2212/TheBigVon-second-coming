import { RenderPreview } from "@/components/render-preview";

export default async function RenderPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <RenderPreview projectId={projectId} />;
}
