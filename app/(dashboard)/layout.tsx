import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              ASYLEN VENTURES
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/properties"
                className="text-foreground hover:text-primary transition-colors"
              >
                Properties
              </Link>
              <button className="text-foreground hover:text-primary transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-white border-r border-border">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/properties"
                  className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
                >
                  My Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/favorites"
                  className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/messages"
                  className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
