export type AnalyticsProviderType = "plausible" | "ga4" | "none";

export interface PlausibleConfig {
  domain: string;
  scriptSrc: string;
}

export interface Ga4Config {
  measurementId: string;
}

export interface AnalyticsConfig {
  provider: AnalyticsProviderType;
  isProduction: boolean;
  isConfigured: boolean;
  plausible: PlausibleConfig;
  ga4: Ga4Config;
}

const DEFAULT_PLAUSIBLE_SCRIPT_SRC = "https://plausible.io/js/script.js";

function resolveProvider(): AnalyticsProviderType {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.toLowerCase();

  if (provider === "ga4" || provider === "plausible" || provider === "none") {
    return provider;
  }

  return "plausible";
}

export function getAnalyticsConfig(): AnalyticsConfig {
  const provider = resolveProvider();
  const plausible: PlausibleConfig = {
    domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? "",
    scriptSrc:
      process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC?.trim() ??
      DEFAULT_PLAUSIBLE_SCRIPT_SRC,
  };

  const ga4: Ga4Config = {
    measurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() ?? "",
  };

  const isProduction = process.env.NODE_ENV === "production";

  const isConfigured =
    provider === "plausible"
      ? Boolean(plausible.domain)
      : provider === "ga4"
        ? Boolean(ga4.measurementId)
        : false;

  return {
    provider,
    isProduction,
    isConfigured,
    plausible,
    ga4,
  };
}
