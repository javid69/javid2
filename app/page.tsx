import Image from "next/image";

const environment = process.env.VERCEL_ENV ?? "local";
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY);
const analyticsDataset = process.env.NEXT_PUBLIC_ANALYTICS_DATASET ?? "not configured";
const apiBaseUrl = process.env.API_BASE_URL ?? "not configured";

type StatusBadgeProps = {
  label: string;
  value: string;
};

function StatusBadge({ label, value }: StatusBadgeProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-white/5">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
      <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col gap-16 bg-white px-8 py-16 text-zinc-900 shadow-sm dark:bg-black dark:text-zinc-100 sm:px-16">
        <header className="flex flex-col gap-8 border-b border-zinc-200 pb-10 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={38}
                height={38}
                priority
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                Deployment cockpit
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Vercel finalize deployment checklist
              </h1>
              <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                This dashboard surfaces the environment state, release workflow, and health
                instrumentation required to ship confidently to Vercel production.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Ready for {environment === "production" ? "production" : environment} deploy
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatusBadge label="Environment" value={environment} />
          <StatusBadge label="Commit" value={commitSha} />
          <StatusBadge
            label="Analytics"
            value={
              analyticsConfigured ? `Active (${analyticsDataset})` : "Disabled"
            }
          />
          <StatusBadge label="API base URL" value={apiBaseUrl} />
          <StatusBadge
            label="Image domains"
            value="images.cto.new, assets.cto.new"
          />
          <StatusBadge label="Health endpoint" value="/api/health" />
        </section>

        <section className="grid gap-8 rounded-3xl border border-zinc-200 bg-zinc-50/60 p-8 dark:border-zinc-800 dark:bg-white/5 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Release workflow
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Each deployment validates the Next.js production build before hitting Vercel,
              ensuring parity between preview and production.
            </p>
            <ol className="list-decimal space-y-3 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Commit to the tracked branch and push to GitHub.</li>
              <li>Run <code className="rounded bg-zinc-200/70 px-1.5 py-0.5 dark:bg-zinc-800">npm run deploy:preview</code> for validation builds.</li>
              <li>
                Promote the release with <code className="rounded bg-zinc-200/70 px-1.5 py-0.5 dark:bg-zinc-800">npm run deploy:production</code> once QA passes.
              </li>
            </ol>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
              <p className="font-medium text-zinc-800 dark:text-zinc-100">Vercel project URLs</p>
              <ul className="mt-2 space-y-1 text-xs font-medium">
                <li>Production · <span className="text-emerald-600 dark:text-emerald-400">https://vercel-finalize-deployment.vercel.app</span></li>
                <li>Preview · <span className="text-sky-600 dark:text-sky-400">https://vercel-finalize-deployment-git-main.vercel.app</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Observability &amp; safeguards
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              A lightweight health endpoint and analytics guardrails help us monitor uptime while
              gracefully degrading optional integrations.
            </p>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-black">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">Health check</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100">
{`GET https://vercel-finalize-deployment.vercel.app/api/health
Authorization: Bearer $HEALTHCHECK_TOKEN (optional)`}
              </pre>
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Returns <code className="rounded bg-zinc-200/70 px-1 py-0.5 dark:bg-zinc-800">200 OK</code> when dependencies are healthy and
                <code className="rounded bg-zinc-200/70 px-1 py-0.5 dark:bg-zinc-800">503</code> when any check fails.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-black">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">Fallback strategy</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-600 dark:text-zinc-400">
                <li>Missing analytics keys simply disable client beacons.</li>
                <li>API outages surface degraded health status for observability tooling.</li>
                <li>Unknown environments default to read-only mode until configured.</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-start gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            <span>Preview &amp; production builds powered by Vercel.</span>
          </div>
          <span className="text-xs">
            Commit {commitSha} · Environment {environment}
          </span>
        </footer>
      </main>
    </div>
  );
}
