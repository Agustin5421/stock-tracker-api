#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="$DIR/../api/.env"

[[ -f "$ENV" ]] || { echo "Missing $ENV"; exit 1; }

_env_get() { grep -m1 "^$1=" "$ENV" | cut -d'=' -f2- | tr -d $'"\'\r'; }

PYTHON="$DIR/.venv/bin/python3"
[[ -x "$PYTHON" ]] || { echo "No venv found — run: python3 -m venv batch/.venv && batch/.venv/bin/pip install -r batch/requirements.txt"; exit 1; }

exec env DB_HOST=localhost \
         DB_PORT="$(_env_get MYSQL_HOST_PORT)" \
         DB_NAME="$(_env_get MYSQL_DATABASE)" \
         DB_USER="$(_env_get MYSQL_USER)" \
         DB_PASSWORD="$(_env_get MYSQL_PASSWORD)" \
         "$PYTHON" "$DIR/seed_top_companies.py" "$@"
