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
  title: "Vercel deployment cockpit",
  description:
    "Operational dashboard summarizing environment state, release workflow, and health for the Vercel deployment.",
  metadataBase: new URL("https://vercel-finalize-deployment.vercel.app"),
  openGraph: {
    title: "Vercel deployment cockpit",
    description:
      "Operational dashboard summarizing environment state, release workflow, and health for the Vercel deployment.",
    url: "https://vercel-finalize-deployment.vercel.app",
    siteName: "Vercel deployment cockpit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel deployment cockpit",
    description:
      "Operational dashboard summarizing environment state, release workflow, and health for the Vercel deployment.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
