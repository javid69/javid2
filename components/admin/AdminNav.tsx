"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users Management" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/leads", label: "Inquiries & Leads" },
  { href: "/admin/featured", label: "Featured Properties" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

interface AdminNavProps {
  onNavigate?: () => void;
}

export function AdminNav({ onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="px-3 py-4 space-y-1">
      {links.map((link) => {
        const isActive = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white shadow"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={() => {
          // Placeholder for sign out logic
          console.log("Sign out");
          onNavigate?.();
        }}
        className="w-full mt-6 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
      >
        Sign Out
      </button>
    </nav>
  );
}
