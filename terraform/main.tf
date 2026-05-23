locals {
  name_prefix         = "${var.project_name}-${var.environment}"
  exports_bucket      = "${local.name_prefix}-exports"
  projects_table      = "${local.name_prefix}-projects"
  safety_events_table = "${local.name_prefix}-safety-events"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Runtime     = "LocalStack"
  }
}

resource "aws_s3_bucket" "exports" {
  bucket = local.exports_bucket

  tags = local.common_tags
}

resource "aws_dynamodb_table" "projects" {
  name         = local.projects_table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "project_id"

  attribute {
    name = "project_id"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_dynamodb_table" "safety_events" {
  name         = local.safety_events_table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "event_id"

  attribute {
    name = "event_id"
    type = "S"
  }

  tags = local.common_tags
}
