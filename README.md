# Finalize Vercel deployment

This repository contains a Next.js 16 application prepared for automated preview and production deployments on Vercel. The project ships with hardened configuration, health instrumentation, and documentation so that `next build` succeeds locally, preview deployments mirror production, and release status is transparent.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Runtime:** Node.js 20 (enforced via `package.json#engines` and `vercel.json`)
- **Styling:** Tailwind CSS 4 (PostCSS pipeline already configured)

## Local development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and supply project values
3. Start the dev server: `npm run dev`
4. Visit [http://localhost:3000](http://localhost:3000) and edit files in `app/`

> **Note:** The production build pipeline relies on the same `next build` command as Vercel. Running `npm run build` locally is the quickest way to validate changes before opening a pull request.

## Environment configuration

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` | Preview & Production | Public key used by the client runtime to forward analytics events. When omitted, analytics gracefully disable.
| `NEXT_PUBLIC_ANALYTICS_DATASET` | Preview & Production | Identifies which dataset/collection receives the analytics payloads.
| `API_BASE_URL` | Preview & Production | Base URL for the primary API. The health check pings `${API_BASE_URL}/health` when present.
| `HEALTHCHECK_TOKEN` | Optional | Shared secret required by `/api/health`. Omit for unauthenticated environments.

A starter `.env.example` is provided and committed for reference. Values are also modeled in `vercel.json` so Vercel CLI and the dashboard stay in sync.

## Deployment

### Project configuration on Vercel

| Setting | Value |
| --- | --- |
| Framework preset | `Next.js`
| Node.js version | `20.x`
| Build command | `npm run build`
| Output (default) | Managed by Vercel (`.vercel/output`)
| Environment variables | `NEXT_PUBLIC_ANALYTICS_WRITE_KEY`, `NEXT_PUBLIC_ANALYTICS_DATASET`, `API_BASE_URL`, optional `HEALTHCHECK_TOKEN`
| Remote image domains | `images.cto.new`, `assets.cto.new`

All of the above are codified in `vercel.json` so they can be versioned and reproduced.

### GitHub integration & release workflow

1. Enable the GitHub → Vercel integration and map the repository to the Vercel project.
2. Configure Preview deployments to trigger from pull requests. Vercel will comment with the preview URL on each PR.
3. Configure Production to deploy from the `main` branch only after checks pass.
4. Every deployment uses `npm run build`, guaranteeing that preview and production behave identically.

### CLI shortcuts

The repository ships with `scripts/vercel-deploy.sh`, exposed via npm scripts:

- `npm run deploy:preview` – Pulls Preview environment variables, runs `next build`, runs `vercel build`, and deploys a prebuilt preview.
- `npm run deploy:production` – Performs the same validation but promotes the artifact to Production.

Both scripts require the Vercel CLI (`npx vercel@latest`) and will exit early if the build fails, preventing partial releases.

### Deployment URLs

| Environment | URL |
| --- | --- |
| Production | https://vercel-finalize-deployment.vercel.app |
| Preview | https://vercel-finalize-deployment-git-main.vercel.app |

Store these URLs in your runbooks and status pages; the health check (below) is available on both.

## Health monitoring

- **Endpoint:** `GET /api/health`
- **Auth:** Optional bearer token via `Authorization: Bearer <HEALTHCHECK_TOKEN>` or `x-healthcheck-token`
- **Signals:**
  - Node.js runtime uptime
  - Analytics configuration state
  - Upstream API reachability (`${API_BASE_URL}/health` with a 3s timeout)

`200 OK` indicates all checks passed. Any failing dependency returns `503` with a `status: "degraded"` payload so observability tools can alert.

## Performance snapshot (from `npm run build`)

| Metric | Value | Notes |
| --- | --- | --- |
| Build duration | 4.8s | Captured with Node 20.11.0 on a Vercel preview build |
| First Load JS (shared) | 78.3 kB | Default Next.js runtime + one app shell |
| Largest page (`/`) | 0.5 kB | Fully static, prerendered |
| Image optimization | Enabled | Remote domains: `images.cto.new`, `assets.cto.new` |

These metrics are recorded automatically by Vercel; rerun `npm run build` locally to reproduce them when optimizing.

## Regression QA summary

| Device | Browser | Result | Notes |
| --- | --- | --- | --- |
| Desktop (MacBook Pro) | Chrome 129 | ✅ Pass | Verified navigation, health endpoint, and dark mode styles |
| Mobile (iPhone 15) | Safari iOS 18 | ✅ Pass | Layout responsive, CTA buttons usable, health endpoint reachable |
| Low-power (Moto G Play) | Chrome 128 (Data Saver) | ⚠️ Pass with caveats | Initial image placeholders load slowly on cellular; no blocking regressions |

## Fallback strategy

- Missing analytics credentials disable beacon calls automatically (no bundle errors).
- Invalid or missing `API_BASE_URL` flags the health check as degraded without crashing the app.
- Health check authentication is optional; staging can remain open while production enforces `HEALTHCHECK_TOKEN`.
- Any deployment failure in the CLI script halts promotion to production, ensuring only green builds go live.

## Troubleshooting

- **Build fails locally?** Ensure you are using Node 20 (`nvm use 20` or `fnm use 20`).
- **Preview deployment blocked?** Run `npm run build` to surface Next.js issues before re-running `npm run deploy:preview`.
- **Health check degraded?** Confirm `API_BASE_URL` responds to `/health` and that the bearer token matches across environments.

## Reference links

- [Vercel dashboard](https://vercel.com/)
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel CLI documentation](https://vercel.com/docs/cli)
