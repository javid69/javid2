#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT=${1:-preview}

if [[ "$ENVIRONMENT" != "preview" && "$ENVIRONMENT" != "production" ]]; then
  cat <<'USAGE' >&2
Usage: ./scripts/vercel-deploy.sh [preview|production]

Deploys the current commit using the Vercel CLI. Defaults to the preview environment.
USAGE
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required to run the Vercel CLI. Install Node.js 20 or newer." >&2
  exit 1
fi

CLI="npx --yes vercel@latest"

printf '\n➡️  Pulling %s environment configuration from Vercel...\n' "$ENVIRONMENT"
$CLI pull --yes --environment="$ENVIRONMENT"

printf '\n➡️  Validating Next.js build locally (npm run build)...\n'
npm run build

printf '\n➡️  Creating prebuilt output via vercel build...\n'
if [[ "$ENVIRONMENT" == "production" ]]; then
  $CLI build --prod
else
  $CLI build
fi

printf '\n➡️  Deploying %s build to Vercel...\n' "$ENVIRONMENT"
if [[ "$ENVIRONMENT" == "production" ]]; then
  $CLI deploy --prebuilt --prod
else
  $CLI deploy --prebuilt
fi

printf '\n✅ Deployment finished successfully.\n'
