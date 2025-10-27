import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_DURATION_MS = 1200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_STORE = 1000;

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const rateLimitStore =
  globalThis.__rateLimitStore ??
  (globalThis.__rateLimitStore = new Map<string, RateLimitEntry>());

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) {
      return ip;
    }
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return req.headers.get("user-agent") ?? "anonymous";
}

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

function consumeRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((entry.expiresAt - now) / 1000),
      ),
    };
  }

  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((entry.expiresAt - now) / 1000),
    ),
  };
}

function pruneRateLimitEntries() {
  if (rateLimitStore.size < RATE_LIMIT_MAX_STORE) {
    return;
  }

  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.expiresAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export async function POST(req: Request) {
  pruneRateLimitEntries();

  const identifier = getClientIdentifier(req);
  const rateLimitResult = consumeRateLimit(identifier);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again soon." },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.retryAfterSeconds.toString(),
        },
      },
    );
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, honeypot, formDuration } = payload as Record<string, unknown>;

  const normalizedEmail =
    typeof email === "string" ? email.trim() : "";

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 422 },
    );
  }

  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ message: "ok" }, { status: 200 });
  }

  const normalizedFormDuration =
    typeof formDuration === "number"
      ? formDuration
      : typeof formDuration === "string"
        ? Number.parseFloat(formDuration)
        : undefined;

  if (
    typeof normalizedFormDuration === "number" &&
    Number.isFinite(normalizedFormDuration) &&
    normalizedFormDuration < MIN_FORM_DURATION_MS
  ) {
    return NextResponse.json(
      { error: "Submission detected as suspicious. Please try again." },
      { status: 400 },
    );
  }

  console.info("[CTA] Email capture", {
    email: normalizedEmail,
    identifier,
    formDuration: normalizedFormDuration,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json(
    { message: "Thanks! You're on the list." },
    { status: 200 },
  );
}
