export {};

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      payload?: {
        props?: Record<string, unknown>;
      },
    ) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
