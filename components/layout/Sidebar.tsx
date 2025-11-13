import Link from "next/link";

interface SidebarProps {
  links: {
    href: string;
    label: string;
  }[];
}

export function Sidebar({ links }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-border">
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
