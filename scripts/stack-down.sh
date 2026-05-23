#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/stack-common.sh"

DESTROY_INFRA=0

if [[ "${1:-}" == "--destroy" ]]; then
  DESTROY_INFRA=1
fi

if ! load_env_file; then
  export LOCALSTACK_AUTH_TOKEN="${LOCALSTACK_AUTH_TOKEN:-stack-down-placeholder}"
fi

if next_server_running; then
  print_step "Stopping Next.js dev server"
  kill "$(cat "$NEXT_PID_FILE")" >/dev/null 2>&1 || true
  rm -f "$NEXT_PID_FILE"
else
  print_step "Next.js dev server is not running"
fi

if [[ $DESTROY_INFRA -eq 1 ]]; then
  require_command terraform "Terraform is required to destroy the LocalStack resources."
  print_step "Destroying Terraform-managed resources"
  (cd "$ROOT_DIR" && terraform -chdir=terraform destroy -auto-approve -input=false)
fi

print_step "Stopping LocalStack"
(cd "$ROOT_DIR" && LOCALSTACK_AUTH_TOKEN="${LOCALSTACK_AUTH_TOKEN:-stack-down-placeholder}" docker compose down)

printf 'Stack stopped.\n'
