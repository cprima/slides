#!/usr/bin/env bash
# Idempotent GitHub repo configuration for cprima/slides.
# Run once after creating the repo, safe to re-run.
# Requires: gh CLI authenticated with repo scope.

set -euo pipefail

REPO="cprima/slides"

# ── 1. Visibility ────────────────────────────────────────────────────────────
# GitHub Pages is free only on public repos.
VISIBILITY=$(gh api "repos/$REPO" --jq '.visibility')
if [ "$VISIBILITY" != "public" ]; then
  echo "Setting repo to public..."
  gh repo edit "$REPO" --visibility public
else
  echo "Repo already public."
fi

# ── 2. GitHub Actions permissions ────────────────────────────────────────────
# Actions must be allowed to write (needed for pages deployment).
gh api -X PUT "repos/$REPO/actions/permissions" \
  --field enabled=true \
  --field allowed_actions=all \
  --silent
echo "Actions: enabled, all actions allowed."

# Allow Actions to create and approve pull requests (needed for pages token).
gh api -X PUT "repos/$REPO/actions/permissions/workflow" \
  --field default_workflow_permissions=write \
  --field can_approve_pull_request_reviews=false \
  --silent
echo "Actions workflow permissions: write."

# ── 3. GitHub Pages ──────────────────────────────────────────────────────────
# Source: GitHub Actions (not a branch) — required for our pages.yml workflow.
PAGES_STATUS=$(gh api "repos/$REPO/pages" --jq '.build_type' 2>/dev/null || echo "not_found")

if [ "$PAGES_STATUS" = "workflow" ]; then
  echo "Pages already configured (source: Actions)."
elif [ "$PAGES_STATUS" = "not_found" ]; then
  echo "Enabling Pages (source: Actions)..."
  if gh api -X POST "repos/$REPO/pages" --field build_type=workflow --silent 2>/dev/null; then
    echo "Pages enabled."
  else
    echo "WARNING: Pages could not be enabled yet."
    echo "  GitHub requires at least one Actions workflow run on the default branch."
    echo "  Re-run this script after merging exploration -> main and pushing."
  fi
else
  echo "Pages exists but source is '$PAGES_STATUS' — updating to Actions..."
  gh api -X PUT "repos/$REPO/pages" \
    --field build_type=workflow \
    --silent
  echo "Pages updated."
fi

echo ""
echo "Done. Pages will deploy to:"
echo "  https://cprima.github.io/slides/"
echo ""
echo "Next steps:"
echo "  1. Merge exploration -> main"
echo "  2. Push main  →  pages.yml triggers  →  site goes live"
