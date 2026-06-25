#!/usr/bin/env bash
# Fix web-unsafe permissions (600 files, 700 dirs) before deploy.
# Usage: normalize-deploy-permissions.sh <dir> [dir...]
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: normalize-deploy-permissions.sh <directory> [directory...]" >&2
  exit 1
fi

fix_tree() {
  local root=$1

  if [[ ! -d "$root" ]]; then
    echo "ERROR: directory not found: $root" >&2
    exit 1
  fi

  local label="${root##*/}/"
  local fixed_files=0
  local fixed_dirs=0

  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    echo "  fixed file (was not web-readable): ${path#"$root/"}" >&2
    chmod 644 "$path"
    fixed_files=$((fixed_files + 1))
  done < <(
    find "$root" -type f \( -perm 600 -o ! -perm -004 \) 2>/dev/null || true
  )

  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    echo "  fixed directory (was not web-traversable): ${path#"$root/"}" >&2
    chmod 755 "$path"
    fixed_dirs=$((fixed_dirs + 1))
  done < <(
    find "$root" -type d \( -perm 700 -o ! -perm -001 \) 2>/dev/null || true
  )

  # Ensure entire tree is web-safe (covers anything the targeted pass missed).
  find "$root" -type d -exec chmod 755 {} +
  find "$root" -type f -exec chmod 644 {} +

  if [[ "$fixed_files" -eq 0 && "$fixed_dirs" -eq 0 ]]; then
    echo "✓ ${label} permissions OK (dirs 755, files 644)"
  else
    echo "✓ ${label} permissions fixed ($fixed_files file(s), $fixed_dirs dir(s)) → dirs 755, files 644"
  fi
}

for dir in "$@"; do
  fix_tree "$dir"
done
