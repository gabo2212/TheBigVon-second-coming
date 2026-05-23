#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/.runtime"
NEXT_PID_FILE="$RUNTIME_DIR/next-dev.pid"
NEXT_LOG_FILE="$RUNTIME_DIR/next-dev.log"
DEFAULT_PORT="${DEMONDASH_PORT:-3000}"
DEFAULT_HOST="${DEMONDASH_HOST:-127.0.0.1}"

mkdir -p "$RUNTIME_DIR"

print_step() {
  printf '\n==> %s\n' "$1"
}

print_error() {
  printf 'ERROR: %s\n' "$1" >&2
}

require_command() {
  local command_name="$1"
  local install_hint="${2:-Install it and retry.}"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    print_error "$command_name is not installed. $install_hint"
    return 1
  fi
}

load_env_file() {
  local env_file="$ROOT_DIR/.env"
  local env_example="$ROOT_DIR/.env.example"

  if [[ ! -f "$env_file" ]]; then
    if [[ -f "$env_example" ]]; then
      cp "$env_example" "$env_file"
      print_step "Created .env from .env.example"
    else
      print_error ".env is missing and .env.example was not found."
      return 1
    fi
  fi

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
}

ensure_localstack_token() {
  local image="${LOCALSTACK_IMAGE:-localstack/localstack:community-archive}"
  local activate_pro="${ACTIVATE_PRO:-0}"

  if [[ "$activate_pro" != "0" ]] && [[ -z "${LOCALSTACK_AUTH_TOKEN:-}" ]]; then
    print_error "LOCALSTACK_AUTH_TOKEN is required when ACTIVATE_PRO is enabled."
    return 1
  fi

  if [[ "$activate_pro" == "0" ]]; then
    printf 'Using LocalStack image without Pro activation: %s\n' "$image"
    return 0
  fi

  if [[ -n "${LOCALSTACK_AUTH_TOKEN:-}" ]]; then
    printf 'Using LocalStack with Pro activation enabled: %s\n' "$image"
  fi
}

ensure_node_modules() {
  if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
    print_step "Installing npm dependencies"
    (cd "$ROOT_DIR" && npm install)
  fi
}

listening_pid_for_port() {
  local port="$1"
  local pid=""

  if command -v lsof >/dev/null 2>&1; then
    pid="$(lsof -tiTCP:"$port" -sTCP:LISTEN | head -n 1)"
  fi

  if [[ -z "$pid" ]] && command -v fuser >/dev/null 2>&1; then
    pid="$(fuser "${port}/tcp" 2>/dev/null | tr -s ' ' '\n' | sed '/^$/d' | head -n 1)"
  fi

  if [[ -z "$pid" ]]; then
    return 1
  fi

  printf '%s\n' "$pid"
}

wait_for_localstack() {
  local endpoint="${LOCALSTACK_ENDPOINT:-http://localhost:4566}"
  local attempts=40
  local index=1

  print_step "Waiting for LocalStack at $endpoint"

  while [[ $index -le $attempts ]]; do
    if curl -fsS "$endpoint/_localstack/info" >/dev/null 2>&1; then
      printf 'LocalStack is ready.\n'
      return 0
    fi

    sleep 2
    index=$((index + 1))
  done

  print_error "LocalStack did not become ready in time."
  return 1
}

next_server_running() {
  if [[ ! -f "$NEXT_PID_FILE" ]]; then
    local discovered_pid
    discovered_pid="$(listening_pid_for_port "$DEFAULT_PORT" || true)"

    if [[ -n "$discovered_pid" ]]; then
      printf '%s\n' "$discovered_pid" >"$NEXT_PID_FILE"
      return 0
    fi

    return 1
  fi

  local pid
  pid="$(cat "$NEXT_PID_FILE")"

  if [[ -z "$pid" ]]; then
    return 1
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    return 0
  fi

  local discovered_pid
  discovered_pid="$(listening_pid_for_port "$DEFAULT_PORT" || true)"

  if [[ -n "$discovered_pid" ]]; then
    printf '%s\n' "$discovered_pid" >"$NEXT_PID_FILE"
    return 0
  fi

  rm -f "$NEXT_PID_FILE"
  return 1
}

next_server_ready() {
  local url="http://${DEFAULT_HOST}:${DEFAULT_PORT}"

  if ! next_server_running; then
    return 1
  fi

  curl -fsS "$url" >/dev/null 2>&1
}

wait_for_next_server() {
  local attempts=20
  local index=1

  while [[ $index -le $attempts ]]; do
    if next_server_ready; then
      return 0
    fi

    sleep 1
    index=$((index + 1))
  done

  return 1
}

ensure_port_free() {
  local port="$1"

  if command -v lsof >/dev/null 2>&1 && lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    print_error "Port $port is already in use."
    return 1
  fi
}
