import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://acmesolar.energy";
const ogImageUrl =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Acme Solar",
  url: siteUrl,
  logo: `${siteUrl}/logo.svg`,
  sameAs: [
    "https://www.linkedin.com/company/acme-solar",
    "https://twitter.com/acmesolar",
    "https://www.youtube.com/@acmesolar",
  ],
};

const productStructuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Acme Solar Rooftop System",
  image: [ogImageUrl],
  description:
    "Configurable residential solar panel array with optional battery storage and smart monitoring.",
  brand: {
    "@type": "Brand",
    name: "Acme Solar",
  },
  sku: "ACME-SOLAR-ROOFTOP",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "1899.00",
    availability: "https://schema.org/InStock",
    url: siteUrl,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "214",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Acme Solar Configurator",
    template: "%s | Acme Solar",
  },
  description:
    "Design an efficient solar system with the Acme Solar configurator, crafted for accessibility and performance.",
  keywords: [
    "solar panels",
    "home energy",
    "accessible configurator",
    "renewable energy",
    "reduced motion",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Acme Solar Configurator",
    description:
      "Design an efficient solar system with the Acme Solar configurator, crafted for accessibility and performance.",
    type: "website",
    url: siteUrl,
    siteName: "Acme Solar",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Visitors exploring the Acme Solar configurator alongside a rooftop solar array.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@acmesolar",
    title: "Acme Solar Configurator",
    description:
      "Design an efficient solar system with accessible controls and reduced motion preferences honored.",
    images: [ogImageUrl],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F766E" },
    { media: "(prefers-color-scheme: dark)", color: "#1E293B" },
  ],
  robots: {
    index: true,
    follow: true,
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-slate-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <Script id="organization-structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(organizationStructuredData)}
        </Script>
        <Script id="product-structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(productStructuredData)}
        </Script>
      </body>
    </html>
  );
}
