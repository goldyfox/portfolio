#!/usr/bin/env bash
# Block deploy if the bundle contains secrets or other forbidden files.
# Permission issues are handled by normalize-deploy-permissions.sh (fix, not block).
set -euo pipefail

OUT_DIR="${1:?Usage: verify-deploy-bundle.sh <out-directory>}"

if [[ ! -d "$OUT_DIR" ]]; then
  echo "ERROR: deploy bundle directory not found: $OUT_DIR" >&2
  exit 1
fi

failures=0

report() {
  echo "ERROR: $1" >&2
  failures=$((failures + 1))
}

check_paths() {
  local label=$1
  shift
  local matches
  matches=$(find "$OUT_DIR" "$@" 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      report "$label: ${path#"$OUT_DIR"/}"
    done <<< "$matches"
  fi
}

# --- Sensitive / secret files (never deploy) ---
check_paths "sensitive file must not be deployed" -name '.env'
check_paths "sensitive file must not be deployed" -name '.env.*'
check_paths "sensitive file must not be deployed" -name '.deploy-staging'
check_paths "sensitive file must not be deployed" -name '*.pem'
check_paths "sensitive file must not be deployed" -name '*.key'
check_paths "sensitive file must not be deployed" -name '*.p12'
check_paths "sensitive file must not be deployed" -name '*.pfx'
check_paths "sensitive file must not be deployed" -name 'credentials.json'
check_paths "sensitive file must not be deployed" -name 'secrets.json'
check_paths "sensitive file must not be deployed" -name '.htpasswd'
check_paths "sensitive file must not be deployed" -name 'id_rsa'
check_paths "sensitive file must not be deployed" -name 'id_ed25519'

check_paths "forbidden path segment in bundle" -path '*/.git/*'
check_paths "forbidden path segment in bundle" -path '*/.git'
check_paths "forbidden path segment in bundle" -path '*/node_modules/*'
check_paths "forbidden path segment in bundle" -path '*/node_modules'

if [[ "$failures" -gt 0 ]]; then
  echo "" >&2
  echo "Deploy blocked: $failures secret/forbidden file(s) found in bundle." >&2
  exit 1
fi

echo "✓ Deploy bundle verified (no secrets)"
