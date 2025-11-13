import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            ASYLEN VENTURES
          </Link>
        </div>
      </nav>
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
        {children}
      </main>
    </div>
  );
}
