"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { X } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" />
        <AdminHeader
          userName="Admin"
          onToggleSidebar={() => setShowSidebar(true)}
        />
        <div className="flex relative">
          <aside className="hidden lg:block w-64 min-h-[calc(100vh-73px)] bg-white border-r border-border">
            <AdminNav />
          </aside>

          {showSidebar && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-bold text-primary">Admin Menu</h2>
                  <button onClick={() => setShowSidebar(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <AdminNav onNavigate={() => setShowSidebar(false)} />
              </div>
            </div>
          )}

          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
