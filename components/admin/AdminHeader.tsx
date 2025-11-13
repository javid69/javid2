"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface AdminHeaderProps {
  userName?: string;
  onToggleSidebar?: () => void;
}

export function AdminHeader({ userName = "Admin", onToggleSidebar }: AdminHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="border-b border-border bg-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <Link href="/admin/dashboard" className="text-2xl font-bold text-primary">
            ASYLEN VENTURES <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            View Site
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {userName}
              </span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2">
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile Settings
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setShowDropdown(false);
                    // Placeholder for sign out
                    console.log("Sign out");
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
