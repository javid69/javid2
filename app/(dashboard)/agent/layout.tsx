"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/agent", label: "Dashboard", icon: "📊" },
  { href: "/agent/properties", label: "My Properties", icon: "🏠" },
  { href: "/agent/properties/new", label: "Add New Property", icon: "➕" },
  { href: "/agent/leads", label: "Inquiries & Leads", icon: "📋" },
  { href: "/agent/analytics", label: "Analytics", icon: "📈" },
  { href: "/agent/profile", label: "Profile", icon: "👤" },
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/agent" className="text-2xl font-bold text-primary">
            ASYLEN VENTURES
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside
          className={cn(
            "fixed md:static w-64 min-h-[calc(100vh-73px)] bg-white border-r border-border transition-all duration-300 z-30 md:z-auto",
            sidebarOpen ? "left-0" : "-left-64 md:left-0"
          )}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                      pathname === item.href || pathname.startsWith(item.href)
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-border">
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-red-50 hover:text-red-600 transition-colors text-left">
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
