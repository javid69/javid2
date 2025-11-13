import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ASYLEN VENTURES - Premium Real Estate Platform",
  description:
    "Discover your dream property with ASYLEN VENTURES. Premium real estate listings, expert agents, and seamless property management.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "ASYLEN VENTURES - Premium Real Estate Platform",
    description:
      "Discover your dream property with ASYLEN VENTURES. Premium real estate listings, expert agents, and seamless property management.",
    siteName: "ASYLEN VENTURES",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASYLEN VENTURES - Premium Real Estate Platform",
    description:
      "Discover your dream property with ASYLEN VENTURES. Premium real estate listings, expert agents, and seamless property management.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
