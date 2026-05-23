import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { dynamoDb, localstackConfig, s3 } from "@/lib/server/aws";
import { formatProjectScriptText } from "@/lib/server/script-format";
import type { SafetyResult, SkitProject } from "@/lib/types";

type ProjectRecord = {
  project_id: string;
  created_at: string;
  updated_at: string;
  project_json: string;
};

function eventId(project: SkitProject, safety: SafetyResult): string {
  return `${project.id}-${safety.status}-${Date.now()}`;
}

async function saveSafetyEvent(project: SkitProject) {
  if (project.safety_rewrites.status === "pass_through") {
    return;
  }

  await dynamoDb.send(
    new PutCommand({
      TableName: localstackConfig.safetyEventsTable,
      Item: {
        event_id: eventId(project, project.safety_rewrites),
        project_id: project.id,
        status: project.safety_rewrites.status,
        reason: project.safety_rewrites.reason,
        flags: project.safety_rewrites.flags,
        original: project.safety_rewrites.original,
        rewritten: project.safety_rewrites.rewritten,
        created_at: new Date().toISOString(),
      },
    }),
  );
}

async function deleteSafetyEvents(projectId: string) {
  const response = await dynamoDb.send(
    new ScanCommand({
      TableName: localstackConfig.safetyEventsTable,
      FilterExpression: "#project_id = :projectId",
      ExpressionAttributeNames: {
        "#project_id": "project_id",
      },
      ExpressionAttributeValues: {
        ":projectId": projectId,
      },
    }),
  );

  for (const item of response.Items ?? []) {
    const eventId = (item as { event_id?: string }).event_id;

    if (!eventId) {
      continue;
    }

    await dynamoDb.send(
      new DeleteCommand({
        TableName: localstackConfig.safetyEventsTable,
        Key: { event_id: eventId },
      }),
    );
  }
}

export async function saveProjectToLocalStack(project: SkitProject) {
  const now = new Date().toISOString();
  const nextProject = {
    ...project,
    updatedAt: now,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: localstackConfig.projectsTable,
      Item: {
        project_id: nextProject.id,
        created_at: nextProject.createdAt,
        updated_at: nextProject.updatedAt,
        project_json: JSON.stringify(nextProject),
      } satisfies ProjectRecord,
    }),
  );

  await saveSafetyEvent(nextProject);

  return nextProject;
}

export async function getProjectFromLocalStack(projectId: string): Promise<SkitProject | null> {
  const response = await dynamoDb.send(
    new GetCommand({
      TableName: localstackConfig.projectsTable,
      Key: { project_id: projectId },
    }),
  );

  const record = response.Item as ProjectRecord | undefined;
  return record?.project_json ? (JSON.parse(record.project_json) as SkitProject) : null;
}

export async function listProjectsFromLocalStack(): Promise<SkitProject[]> {
  const response = await dynamoDb.send(
    new ScanCommand({
      TableName: localstackConfig.projectsTable,
    }),
  );

  return ((response.Items ?? []) as ProjectRecord[])
    .map((item) => JSON.parse(item.project_json) as SkitProject)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteProjectFromLocalStack(projectId: string) {
  await dynamoDb.send(
    new DeleteCommand({
      TableName: localstackConfig.projectsTable,
      Key: { project_id: projectId },
    }),
  );

  await deleteSafetyEvents(projectId);

  return { projectId };
}

export async function writeExportToLocalStack(project: SkitProject) {
  const key = `exports/${project.id}/${Date.now()}.json`;
  const body = JSON.stringify(
    {
      project,
      script: formatProjectScriptText(project),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  await s3.send(
    new PutObjectCommand({
      Bucket: localstackConfig.exportsBucket,
      Key: key,
      Body: body,
      ContentType: "application/json",
    }),
  );

  return {
    bucket: localstackConfig.exportsBucket,
    key,
    endpoint: localstackConfig.endpoint,
  };
}
