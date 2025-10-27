'use client';

import { FormEvent, useCallback, useEffect, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_DURATION_MS = 1200;

type FormStatus = "idle" | "loading" | "success" | "error";

const statusTone: Record<FormStatus, string> = {
  idle: "text-slate-300",
  loading: "text-slate-300",
  success: "text-emerald-200",
  error: "text-rose-200",
};

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [formStart, setFormStart] = useState(() => Date.now());

  useEffect(() => {
    setFormStart(Date.now());
  }, []);

  const validateEmail = useCallback((value: string) => {
    if (!value) {
      return "Email is required.";
    }
    if (!EMAIL_REGEX.test(value)) {
      return "Please provide a valid email address.";
    }
    return "";
  }, []);

  useEffect(() => {
    if (!touched) {
      return;
    }
    setError(validateEmail(email));
  }, [email, touched, validateEmail]);

  const handleBlur = () => {
    if (!touched) {
      setTouched(true);
    }
    setError(validateEmail(email));
  };

  const resetFeedback = () => {
    if (status === "idle" || status === "loading") {
      return;
    }

    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (honeypot.trim().length > 0) {
      setStatus("success");
      setMessage("Thanks! You're on the list.");
      setEmail("");
      setTouched(false);
      setError("");
      setFormStart(Date.now());
      return;
    }

    const trimmedEmail = email.trim();
    const validationError = validateEmail(trimmedEmail);

    setTouched(true);
    setError(validationError);

    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    const elapsed = Date.now() - formStart;
    if (elapsed < MIN_FORM_DURATION_MS) {
      setStatus("error");
      setMessage("That was a little too quick — please try again.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/cta-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          honeypot,
          formDuration: elapsed,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          (data && typeof data.error === "string" && data.error) ||
          "We couldn't save your email just yet. Please try again.";
        setStatus("error");
        setMessage(errorMessage);
        return;
      }

      setStatus("success");
      setMessage(
        (data && typeof data.message === "string" && data.message) ||
          "Thanks! You're on the list.",
      );
      setEmail("");
      setTouched(false);
      setError("");
      setFormStart(Date.now());
    } catch (err) {
      setStatus("error");
      setMessage("A network error occurred. Please try again shortly.");
    }
  };

  const showError = touched && Boolean(error);
  const messageTone = statusTone[status];

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-14 text-slate-100 shadow-[0_40px_120px_rgba(8,47,73,0.55)] backdrop-blur-2xl sm:px-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/30 via-transparent to-cyan-400/20 opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 blur-3xl opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-[-12%] h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400 via-sky-500 to-transparent blur-3xl opacity-40"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-10">
        <header className="max-w-xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-200/70">
            Stay ahead
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Unlock curated growth insights in your inbox.
          </h1>
          <p className="text-lg text-slate-200/80">
            Join thousands of founders receiving weekly strategies, product
            frameworks, and operator playbooks before they trend.
          </p>
        </header>

        <form
          className="relative space-y-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <input
            aria-hidden="true"
            autoComplete="off"
            name="company"
            onChange={(event) => setHoneypot(event.target.value)}
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
            tabIndex={-1}
            value={honeypot}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="w-full sm:flex-1">
              <label className="sr-only" htmlFor="cta-email">
                Email address
              </label>
              <div className="group relative">
                <input
                  id="cta-email"
                  aria-describedby="cta-email-error"
                  aria-invalid={showError}
                  autoComplete="email"
                  className="peer w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-base font-medium text-white shadow-[0_15px_50px_rgba(15,23,42,0.35)] transition-all duration-300 placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-slate-900"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    resetFeedback();
                  }}
                  onFocus={resetFeedback}
                  type="email"
                  value={email}
                />
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60 transition-opacity duration-300 peer-focus:opacity-0">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 6.75a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25z" />
                    <path d="m3 7 8.4 5.6a1 1 0 0 0 1.2 0L21 7" />
                  </svg>
                </div>
              </div>
              <p
                className={`min-h-[1.25rem] pt-1 text-sm font-medium transition-opacity duration-300 ${
                  showError ? "opacity-100 text-rose-200" : "opacity-0"
                }`}
                id="cta-email-error"
                role={showError ? "alert" : undefined}
              >
                {showError ? error : ""}
              </p>
            </div>
            <button
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-[0_20px_60px_rgba(99,102,241,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(99,102,241,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              disabled={status === "loading"}
              type="submit"
            >
              <span className="absolute inset-0 translate-x-[-100%] bg-white/25 transition-transform duration-500 ease-out group-hover:translate-x-[100%]" />
              {status === "loading" ? (
                <span className="relative flex items-center gap-3 text-white">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                  Sending...
                </span>
              ) : (
                <span className="relative flex items-center gap-3">
                  Notify me
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </span>
              )}
            </button>
          </div>

          <div
            aria-live={status === "error" ? "assertive" : "polite"}
            className={`min-h-[1.5rem] text-sm font-medium transition-all duration-300 ${
              message ? "opacity-100" : "opacity-0"
            } ${messageTone}`}
            role={status === "error" ? "alert" : "status"}
          >
            {message || ""}
          </div>
        </form>
      </div>
    </section>
  );
}
