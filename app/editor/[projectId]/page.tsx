import { SceneEditor } from "@/components/scene-editor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <SceneEditor projectId={projectId} />;
}
