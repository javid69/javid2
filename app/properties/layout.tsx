import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent | ASYLEN VENTURES",
  description:
    "Browse our extensive collection of properties including apartments, houses, villas, and commercial spaces. Find your perfect property with ASYLEN VENTURES.",
  openGraph: {
    title: "Properties for Sale & Rent | ASYLEN VENTURES",
    description:
      "Browse our extensive collection of properties including apartments, houses, villas, and commercial spaces.",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
