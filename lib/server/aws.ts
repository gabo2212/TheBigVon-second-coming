import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const endpoint = process.env.LOCALSTACK_ENDPOINT ?? "http://localhost:4566";
const region = process.env.AWS_REGION ?? "us-east-1";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
};

export const localstackConfig = {
  endpoint,
  region,
  projectsTable: process.env.DEMONDASH_PROJECTS_TABLE ?? "demondash-dev-projects",
  safetyEventsTable: process.env.DEMONDASH_SAFETY_EVENTS_TABLE ?? "demondash-dev-safety-events",
  exportsBucket: process.env.DEMONDASH_EXPORTS_BUCKET ?? "demondash-dev-exports",
};

export const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint,
    region,
    credentials,
  }),
);

export const s3 = new S3Client({
  endpoint,
  region,
  credentials,
  forcePathStyle: true,
});
