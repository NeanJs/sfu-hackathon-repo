#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
BACK="../backend-services"

need_clean() {
  if ! git -C "$1" diff --quiet || ! git -C "$1" diff --cached --quiet; then
    echo "Uncommitted changes in $1. Commit or stash first."; exit 1
  fi
}

update_dir() {
  local dir="$1"
  echo "*** Updating $dir ***"
  git -C "$dir" fetch --all --prune
  git -C "$dir" status -sb || true
  set +e
  git -C "$dir" log --oneline --decorate --graph -n 10 "@{u}.." || true
  set -e
  git -C "$dir" pull --ff-only || { echo "Non-FF in $dir. Coordinate with your team."; exit 1; }
  echo
}

[[ -d "$BACK" ]] || { echo "Missing $BACK. Run setup first."; exit 1; }
need_clean "$ROOT"; need_clean "$BACK"

update_dir "$ROOT"
update_dir "$BACK"

echo "✅ Both directories are up to date."
