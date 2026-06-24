#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Local deploy config (gitignored). Copy env.deploy.example → .env.deploy and fill in.
if [[ -f .env.deploy ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.deploy
  set +a
fi

: "${DEPLOY_HOST:?Set DEPLOY_HOST in .env.deploy (DreamHost SSH hostname)}"
: "${DEPLOY_USER:?Set DEPLOY_USER in .env.deploy (DreamHost shell username)}"
: "${DEPLOY_PATH:?Set DEPLOY_PATH in .env.deploy (web root, e.g. ~/lisaaufox.com)}"

SSH_KEY="${SSH_KEY:-}"

if [[ -n "$SSH_KEY" ]]; then
  RSYNC_RSH="ssh -i ${SSH_KEY}"
else
  RSYNC_RSH="ssh"
fi

if [[ -z "${NEXT_PUBLIC_CONTACT_FORM_URL:-}" ]]; then
  echo "Warning: NEXT_PUBLIC_CONTACT_FORM_URL is not set — contact form will not work after deploy." >&2
  echo "Add your Formspree URL to .env.deploy (see env.deploy.example)." >&2
fi

echo "→ Building static site (out/)…"
npm run build

OUT_DIR="$ROOT_DIR/out"
if [[ ! -f "$OUT_DIR/index.html" ]]; then
  echo "Build did not produce out/index.html" >&2
  exit 1
fi

echo "→ Uploading to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}…"
echo "  (rsync --delete removes files on the server that are not in out/)"
rsync -avz --delete \
  -e "$RSYNC_RSH" \
  "$OUT_DIR/" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "✓ Deploy complete — https://www.lisaaufox.com"
