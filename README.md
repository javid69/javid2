# Interactive Configurator Demo

This project showcases a kitchen configurator built with Next.js and a flexible analytics integration that supports either Plausible (default) or Google Analytics 4 (with consent controls).

## Getting Started

Install dependencies and run the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the configurator. The page hot-reloads as you edit files.

## Analytics configuration

Analytics scripts only load when **both** of the following conditions are met:

1. The build is running in production mode (`NODE_ENV=production`).
2. The chosen analytics provider is fully configured via environment variables.

By default, the app assumes Plausible. Use `NEXT_PUBLIC_ANALYTICS_PROVIDER` to switch providers.

### Environment variables

| Variable | Required for | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | both | Set to `plausible`, `ga4`, or `none`. Defaults to `plausible`. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible | Domain registered in Plausible (e.g. `my-site.com`). |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` | Plausible (optional) | Override the Plausible script URL. Defaults to `https://plausible.io/js/script.js`. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | GA4 | GA4 measurement ID (e.g. `G-XXXXXXX`). |

Create a `.env.local` file at the project root with whichever provider you plan to use:

```bash
# Plausible (default)
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com

# Optional: serve the script from a custom domain
# NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC=https://plausible.example.com/js/script.js
```

```bash
# Google Analytics 4 with consent banner
NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXX
```

### Consent behaviour (GA4)

- A consent banner appears when GA4 is selected.
- The GA4 script is only injected **after** the visitor consents.
- Consent decisions persist in `localStorage` (`ga4-consent`) and can be cleared by the visitor.
- If the visitor declines, no GA4 scripts or events are loaded.

## Event schema

Three custom events are captured to monitor configurator engagement:

| Event name | Trigger | Properties |
| --- | --- | --- |
| `configurator_variant_selected` | Selecting one of the finish buttons | `variantId` – identifier of the selected finish. |
| `configurator_hotspot_opened` | Opening a hotspot from the "Explore hotspots" list | `hotspotId` – identifier of the hotspot that was opened. |
| `cta_submitted` | Submitting the "Request the design pack" CTA form | `ctaId` – identifier for the CTA (`request-design-pack`). |

- In Plausible, events appear as [custom events](https://plausible.io/docs/custom-event-goals) with optional properties.
- In GA4, events are sent via `gtag("event", <eventName>, properties)`.

## Verifying events

1. Build and run the app in production mode: `npm run build && npm run start`.
2. Open the site in your browser, then inspect the **Network** tab.
3. Interact with the configurator (switch variants, open hotspots, submit the CTA). You should see:
   - `plausible.io` (or your custom domain) requests for Plausible.
   - `collect` requests to `https://www.google-analytics.com` when GA4 is enabled **and** consented.
4. Declining the GA4 consent banner should prevent any analytics network requests.

## Developing on Replit

1. Import the repository into Replit. The `replit.nix` environment installs Node.js 20, pnpm tooling, and `libvips` for image optimisation.
2. Press **Run** to execute `scripts/replit-dev.sh`. It enables Corepack, installs dependencies, and starts `npm run dev -- --hostname 0.0.0.0 --port $PORT` for hot reloading.
3. Use the Webview panel to interact with the configurator in real time.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs) – framework resources.
- [Plausible Custom Events](https://plausible.io/docs/custom-event-goals) – configuring reports for custom events.
- [GA4 Event Tracking](https://developers.google.com/gtagjs/reference/event) – reference for GA4 event parameters.
