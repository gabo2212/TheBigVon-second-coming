import { ResultsView } from "@/components/results-view";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ResultsView projectId={projectId} />;
}
