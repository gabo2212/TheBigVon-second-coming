#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/stack-common.sh"

print_step "Running preflight checks"
require_command docker "Install Docker Desktop or Docker Engine."
require_command curl "curl is required for LocalStack health checks."
require_command npm "Node.js and npm are required to run the app."
require_command terraform "Terraform is required for the LocalStack resources."
require_command aws "AWS CLI is required for verification."

load_env_file
ensure_localstack_token
ensure_node_modules

print_step "Starting LocalStack"
(cd "$ROOT_DIR" && docker compose up -d)
wait_for_localstack

print_step "Applying Terraform resources"
(cd "$ROOT_DIR" && terraform -chdir=terraform init -input=false)
(cd "$ROOT_DIR" && terraform -chdir=terraform validate)
(cd "$ROOT_DIR" && terraform -chdir=terraform apply -auto-approve -input=false)

print_step "Verifying LocalStack resources with AWS CLI"
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-test}" \
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-test}" \
AWS_REGION="${AWS_REGION:-us-east-1}" \
aws --endpoint-url="${LOCALSTACK_ENDPOINT:-http://localhost:4566}" s3 ls

AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-test}" \
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-test}" \
AWS_REGION="${AWS_REGION:-us-east-1}" \
aws --endpoint-url="${LOCALSTACK_ENDPOINT:-http://localhost:4566}" dynamodb list-tables >/dev/null

if next_server_running; then
  print_step "Next.js dev server is already running"
  printf 'App URL: http://%s:%s\n' "$DEFAULT_HOST" "$DEFAULT_PORT"
  exit 0
fi

ensure_port_free "$DEFAULT_PORT"

print_step "Starting Next.js dev server"
(cd "$ROOT_DIR" && setsid sh -c "exec '$ROOT_DIR/node_modules/.bin/next' dev --hostname '$DEFAULT_HOST' --port '$DEFAULT_PORT' </dev/null >>'$NEXT_LOG_FILE' 2>&1" >/dev/null 2>&1 & echo $! >"$NEXT_PID_FILE")

if wait_for_next_server; then
  printf 'Full stack is up.\n'
  printf 'App URL: http://%s:%s\n' "$DEFAULT_HOST" "$DEFAULT_PORT"
  printf 'Next.js log: %s\n' "$NEXT_LOG_FILE"
else
  print_error "Next.js dev server failed to start. Check $NEXT_LOG_FILE"
  exit 1
fi
