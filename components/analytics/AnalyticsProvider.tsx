"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Script from "next/script";

import type { AnalyticsConfig, AnalyticsProviderType } from "@/lib/analytics/config";

type ConsentState = "unknown" | "granted" | "denied";

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

type AnalyticsContextValue = {
  provider: AnalyticsProviderType;
  isEnabled: boolean;
  consentState: ConsentState;
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue>({
  provider: "none",
  isEnabled: false,
  consentState: "unknown",
  trackEvent: () => undefined,
});

export const GA4_CONSENT_STORAGE_KEY = "ga4-consent";

export function useAnalytics(): AnalyticsContextValue {
  return useContext(AnalyticsContext);
}

interface AnalyticsProviderProps {
  config: AnalyticsConfig;
  children: ReactNode;
}

export function AnalyticsProvider({ config, children }: AnalyticsProviderProps) {
  const { provider, isProduction, isConfigured, plausible, ga4 } = config;

  const isAnalyticsEnabled = isProduction && isConfigured && provider !== "none";

  const [consentState, setConsentState] = useState<ConsentState>(() =>
    provider === "ga4" ? "unknown" : "granted",
  );
  const [isScriptReady, setIsScriptReady] = useState(false);
  const eventQueueRef = useRef<AnalyticsEvent[]>([]);

  const shouldLoadPlausible =
    provider === "plausible" && isAnalyticsEnabled && Boolean(plausible.domain);
  const shouldLoadGa4 =
    provider === "ga4" && isAnalyticsEnabled && consentState === "granted";

  useEffect(() => {
    if (provider !== "ga4") {
      setConsentState("granted");
      return;
    }

    if (!isAnalyticsEnabled) {
      setConsentState("unknown");
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(GA4_CONSENT_STORAGE_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsentState(stored);
    }
  }, [provider, isAnalyticsEnabled]);

  useEffect(() => {
    if (!isAnalyticsEnabled) {
      setIsScriptReady(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (provider === "plausible") {
      const interval = window.setInterval(() => {
        if (typeof window.plausible === "function") {
          setIsScriptReady(true);
          window.clearInterval(interval);
        }
      }, 200);

      return () => window.clearInterval(interval);
    }

    if (provider === "ga4") {
      if (consentState !== "granted") {
        setIsScriptReady(false);
        return;
      }

      const interval = window.setInterval(() => {
        if (typeof window.gtag === "function") {
          setIsScriptReady(true);
          window.clearInterval(interval);
        }
      }, 200);

      return () => window.clearInterval(interval);
    }

    return () => undefined;
  }, [consentState, isAnalyticsEnabled, provider]);

  useEffect(() => {
    if (provider !== "ga4") {
      return;
    }

    if (!isAnalyticsEnabled) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(GA4_CONSENT_STORAGE_KEY);
      }
      return;
    }

    if (consentState === "granted" || consentState === "denied") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(GA4_CONSENT_STORAGE_KEY, consentState);
      }
    }
  }, [consentState, isAnalyticsEnabled, provider]);

  const sendEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (typeof window === "undefined") {
        return;
      }

      if (provider === "plausible" && typeof window.plausible === "function") {
        if (event.properties && Object.keys(event.properties).length > 0) {
          window.plausible(event.name, { props: event.properties });
        } else {
          window.plausible(event.name);
        }
      }

      if (provider === "ga4" && typeof window.gtag === "function") {
        window.gtag("event", event.name, event.properties ?? {});
      }
    },
    [provider],
  );

  const isReadyToSend = useMemo(
    () =>
      isAnalyticsEnabled &&
      isScriptReady &&
      (provider !== "ga4" || consentState === "granted"),
    [consentState, isAnalyticsEnabled, isScriptReady, provider],
  );

  useEffect(() => {
    if (!isReadyToSend) {
      return;
    }

    if (eventQueueRef.current.length === 0) {
      return;
    }

    const queued = [...eventQueueRef.current];
    eventQueueRef.current = [];
    queued.forEach(sendEvent);
  }, [sendEvent, isReadyToSend]);

  const trackEvent = useCallback(
    (name: string, properties?: Record<string, unknown>) => {
      if (!isAnalyticsEnabled) {
        return;
      }

      if (provider === "ga4" && consentState !== "granted") {
        return;
      }

      const event: AnalyticsEvent = { name, properties };

      if (!isReadyToSend) {
        eventQueueRef.current.push(event);
        return;
      }

      sendEvent(event);
    },
    [consentState, isAnalyticsEnabled, isReadyToSend, provider, sendEvent],
  );

  const contextValue = useMemo(
    () => ({
      provider,
      isEnabled: isAnalyticsEnabled,
      consentState,
      trackEvent,
    }),
    [consentState, isAnalyticsEnabled, provider, trackEvent],
  );

  const showConsentBanner =
    provider === "ga4" && isAnalyticsEnabled && consentState === "unknown";

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {shouldLoadPlausible ? (
        <Script
          id="plausible-script"
          src={plausible.scriptSrc}
          data-domain={plausible.domain}
          strategy="afterInteractive"
        />
      ) : null}

      {shouldLoadGa4 ? (
        <>
          <Script
            id="ga4-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4.measurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 
gtag('js', new Date());
gtag('config', '${ga4.measurementId}', { send_page_view: false });`,
            }}
          />
        </>
      ) : null}

      {showConsentBanner ? (
        <ConsentBanner
          onAccept={() => setConsentState("granted")}
          onDecline={() => setConsentState("denied")}
        />
      ) : null}

      {children}
    </AnalyticsContext.Provider>
  );
}

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Analytics preferences
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        We use Google Analytics 4 to understand how the configurator is used. We
        will only enable tracking after you provide consent.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDecline}
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Accept & continue
        </button>
      </div>
    </div>
  );
}
