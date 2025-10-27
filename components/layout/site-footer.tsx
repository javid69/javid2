import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background-soft py-lg backdrop-blur-xl">
      <div className="yashvi-container flex flex-col gap-sm text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {year} Yashvi Studio. Crafted for brands who believe in luminous storytelling.</p>
        <div className="flex items-center gap-sm">
          <Link href="#experiments" className="transition hover:text-foreground">
            Labs
          </Link>
          <Link href="#contact" className="transition hover:text-foreground">
            Start a project
          </Link>
          <Link href="mailto:hello@yashvi.studio" className="transition hover:text-foreground">
            hello@yashvi.studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
