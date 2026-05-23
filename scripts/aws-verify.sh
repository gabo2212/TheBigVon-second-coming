#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/stack-common.sh"

require_command aws "AWS CLI is required for verification."
load_env_file

print_step "Listing LocalStack S3 buckets"
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-test}" \
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-test}" \
AWS_REGION="${AWS_REGION:-us-east-1}" \
aws --endpoint-url="${LOCALSTACK_ENDPOINT:-http://localhost:4566}" s3 ls

print_step "Listing LocalStack DynamoDB tables"
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-test}" \
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-test}" \
AWS_REGION="${AWS_REGION:-us-east-1}" \
aws --endpoint-url="${LOCALSTACK_ENDPOINT:-http://localhost:4566}" dynamodb list-tables
