variable "project_name" {
  description = "Project prefix used for LocalStack resource names."
  type        = string
  default     = "demondash"
}

variable "environment" {
  description = "Local environment name."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "Fake AWS region used by LocalStack."
  type        = string
  default     = "us-east-1"
}

variable "localstack_endpoint" {
  description = "LocalStack edge endpoint."
  type        = string
  default     = "http://localhost:4566"
}
