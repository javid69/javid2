import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Urbanist, JetBrains_Mono } from "next/font/google";

import { Providers } from "./providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-yashvi-sans",
  display: "swap",
});

const display = Urbanist({
  subsets: ["latin"],
  variable: "--font-yashvi-display",
  display: "swap",
  weight: ["400", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-yashvi-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yashvi.studio"),
  title: {
    default: "Yashvi Studio",
    template: "%s · Yashvi Studio",
  },
  description:
    "Yashvi Studio crafts immersive, motion-driven web experiences grounded in thoughtful storytelling.",
  keywords: ["Yashvi", "digital studio", "creative agency", "motion design", "web experiences"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yashvi.studio",
    title: "Yashvi Studio",
    description:
      "Immersive product and brand experiences powered by strategy, storytelling, and motion design.",
    siteName: "Yashvi Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yashvi Studio",
    description:
      "Immersive product and brand experiences powered by strategy, storytelling, and motion design.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04050f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7ff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="bg-background" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background text-foreground">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] bg-grid-yashvi opacity-40" />
            <SiteHeader />
            <main className="flex-1 pb-[var(--space-3xl)]">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
