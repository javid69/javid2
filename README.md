This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Developing on Replit

1. Open the repo in Replit using the **Import from GitHub** flow. Replit will use the `replit.nix` environment to install Node.js 20, npm/pnpm tooling, and the native `libvips` dependency that Next.js image optimization relies on.
2. Press **Run**. The `.replit` configuration launches `scripts/replit-dev.sh`, which enables Corepack so pnpm is available, installs dependencies (with caching in `node_modules`) the first time it runs, and then starts the dev server with `npm run dev -- --hostname 0.0.0.0 --port $PORT` so it binds to the port Replit expects.
3. The Webview panel proxies the running dev server, so edits you make in the editor hot-reload automatically.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
