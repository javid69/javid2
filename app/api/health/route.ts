import { NextResponse } from "next/server";
import { performance } from "node:perf_hooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckStatus = "pass" | "warn" | "fail";

type HealthCheck = {
  id: string;
  status: CheckStatus;
  details?: string;
  latencyMs?: number;
};

type HealthPayload = {
  status: "ok" | "degraded";
  environment: string;
  timestamp: string;
  version: string;
  checks: HealthCheck[];
};

export async function GET(request: Request) {
  const checks: HealthCheck[] = [];

  const expectedToken = process.env.HEALTHCHECK_TOKEN;
  if (expectedToken) {
    const headerValue = request.headers.get("authorization") ?? "";
    const bearerPrefix = "Bearer ";
    const bearerToken = headerValue.startsWith(bearerPrefix)
      ? headerValue.slice(bearerPrefix.length)
      : headerValue;
    const candidateTokens = [
      bearerToken,
      request.headers.get("x-healthcheck-token") ?? "",
    ].map((value) => value.trim());
    const isAuthorized = candidateTokens.some(
      (candidate) => candidate.length > 0 && candidate === expectedToken,
    );

    if (!isAuthorized) {
      return NextResponse.json(
        {
          status: "degraded",
          environment: process.env.VERCEL_ENV ?? "local",
          timestamp: new Date().toISOString(),
          version: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
          checks: [
            {
              id: "auth",
              status: "fail",
              details: "Health check token missing or invalid.",
            },
          ],
        } satisfies HealthPayload,
        { status: 401 },
      );
    }
  }

  checks.push({
    id: "runtime",
    status: "pass",
    details: `uptime ${process.uptime().toFixed(0)}s`,
  });

  const analyticsConfigured = Boolean(
    process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY,
  );
  checks.push({
    id: "analytics",
    status: analyticsConfigured ? "pass" : "warn",
    details: analyticsConfigured
      ? "Client analytics write key configured."
      : "Analytics write key missing; analytics events will be skipped.",
  });

  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    checks.push({
      id: "api",
      status: "warn",
      details: "API_BASE_URL not set; API availability was not verified.",
    });
  } else {
    let apiUrl: URL | undefined;
    try {
      apiUrl = new URL("/health", apiBaseUrl);
    } catch {
      checks.push({
        id: "api",
        status: "fail",
        details: "API_BASE_URL is not a valid URL.",
      });
    }

    if (apiUrl) {
      const abort = new AbortController();
      const timeout = setTimeout(() => abort.abort(), 3000);

      try {
        const start = performance.now();
        const response = await fetch(apiUrl.toString(), {
          method: "GET",
          signal: abort.signal,
          headers: {
            "user-agent": "nextjs-health-check",
          },
        });

        checks.push({
          id: "api",
          status: response.ok ? "pass" : "fail",
          details: response.ok
            ? `Upstream health endpoint responded with ${response.status}.`
            : `Upstream health endpoint responded with ${response.status} ${response.statusText}.`,
          latencyMs: Math.round(performance.now() - start),
        });
      } catch (error) {
        checks.push({
          id: "api",
          status: "fail",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  const hasFailure = checks.some((check) => check.status === "fail");
  const payload: HealthPayload = {
    status: hasFailure ? "degraded" : "ok",
    environment: process.env.VERCEL_ENV ?? "local",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    checks,
  };

  return NextResponse.json(payload, {
    status: hasFailure ? 503 : 200,
  });
}
