#!/usr/bin/env bash
set -euo pipefail

# Preconditions
git rev-parse --is-inside-work-tree >/dev/null
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Please commit or stash changes in $(pwd) before running."; exit 1
fi

current_branch="$(git symbolic-ref --short HEAD)"
if [[ "$current_branch" != "main" ]]; then
  echo "Switching to 'main' (was '$current_branch')..."
  git switch main
fi

git fetch origin --prune

if ! git ls-remote --exit-code --heads origin backend-services >/dev/null; then
  echo "Remote branch 'backend-services' not found on origin."; exit 1
fi

WT="../backend-services"
if git worktree list | grep -q " $WT "; then
  echo "Worktree already exists at $WT"
else
  git worktree add -b backend-services "$WT" origin/backend-services
fi

# Safer local config (repo-scoped)
git -C .  config pull.ff only
git -C "$WT" config pull.ff only
git -C .  config merge.ff only
git -C "$WT" config merge.ff only

echo
git worktree list
echo
echo "✅ Setup complete."
echo "Run:  bash scripts/macos/dev.sh"
echo "Update both later:  bash scripts/macos/update.sh"
