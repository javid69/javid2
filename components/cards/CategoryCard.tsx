import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  href: string;
}

export function CategoryCard({
  name,
  icon: Icon,
  count,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {count} {count === 1 ? "Property" : "Properties"}
      </p>
    </Link>
  );
}
