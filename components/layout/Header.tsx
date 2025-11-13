import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            ASYLEN VENTURES
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/properties"
              className="text-foreground hover:text-primary transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/signin"
              className="text-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
