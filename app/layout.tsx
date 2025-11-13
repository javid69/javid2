import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASYLEN VENTURES - Real Estate Platform",
  description:
    "Premium real estate platform with comprehensive property management and authentication system.",
  metadataBase: new URL("https://vercel-finalize-deployment.vercel.app"),
  openGraph: {
    title: "ASYLEN VENTURES - Real Estate Platform",
    description:
      "Premium real estate platform with comprehensive property management and authentication system.",
    url: "https://vercel-finalize-deployment.vercel.app",
    siteName: "ASYLEN VENTURES",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASYLEN VENTURES - Real Estate Platform",
    description:
      "Premium real estate platform with comprehensive property management and authentication system.",
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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
