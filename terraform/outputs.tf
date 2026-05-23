output "exports_bucket_name" {
  description = "S3 bucket for DemonDash exports/render preview artifacts in LocalStack."
  value       = aws_s3_bucket.exports.bucket
}

output "projects_table_name" {
  description = "DynamoDB table for DemonDash projects in LocalStack."
  value       = aws_dynamodb_table.projects.name
}

output "safety_events_table_name" {
  description = "DynamoDB table for DemonDash safety rewrite/block events in LocalStack."
  value       = aws_dynamodb_table.safety_events.name
}

output "localstack_endpoint" {
  description = "Endpoint used by Terraform, AWS CLI, and the Next.js API routes."
  value       = var.localstack_endpoint
}
