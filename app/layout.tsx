import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immersive 3D Performance Pass",
  description:
    "Profiled Next.js experience with lazy 3D hydration, Draco + KTX2 assets, and adaptive fallbacks that keep initial JS under 200KB.",
  openGraph: {
    title: "Immersive 3D Performance Pass",
    description:
      "Lazy 3D hydration, compressed assets, and mobile-friendly heuristics that keep Lighthouse happy.",
    url: "https://example.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Immersive 3D Performance Pass",
    description:
      "Bundle budgets intact with Draco/KTX2 assets, dynamic imports, and low-power fallbacks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
