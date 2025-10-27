"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

import { useThemeStore } from "@/lib/stores/theme-store";

const navItems = [
  { href: "#strategy", label: "Strategy" },
  { href: "#experiments", label: "Experiments" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [theme, toggleTheme] = useThemeStore((state) => [state.theme, state.toggleTheme]);

  const brandMark = useMemo(
    () => (
      <span className="relative inline-flex items-center gap-2 text-lg font-semibold tracking-wide text-foreground">
        <span className="h-2 w-2 rounded-full bg-accent shadow-glow" aria-hidden />
        <span className="font-display">Yashvi Studio</span>
      </span>
    ),
    [],
  );

  return (
    <LazyMotion features={domAnimation}>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background-soft backdrop-blur-xl">
        <div className="yashvi-container flex items-center justify-between gap-sm py-sm md:py-md">
          <Link href="#top" className="group inline-flex items-center gap-2">
            <m.span
              animate={{ rotate: 360 }}
              transition={{ ease: "easeInOut", duration: 18, repeat: Infinity }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary-border bg-primary-subtle text-sm text-primary"
            >
              Y
            </m.span>
            {brandMark}
          </Link>

          <nav className="hidden items-center gap-sm text-sm font-medium text-muted-foreground md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-full px-4 py-2 transition hover:text-foreground"
              >
                <span
                  className="absolute inset-0 -z-10 rounded-full bg-surface-accent opacity-0 transition group-hover:opacity-100"
                  aria-hidden
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-xs">
            <button
              type="button"
              onClick={toggleTheme}
              className="relative inline-flex h-10 w-28 items-center overflow-hidden rounded-full border border-border bg-surface-soft px-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition hover:border-accent-soft hover:text-foreground"
            >
              <m.span
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-y-1 w-[calc(50%-0.35rem)] rounded-full bg-primary-highlight shadow-glow"
                style={{ left: theme === "dark" ? "0.25rem" : "calc(50% + 0.1rem)" }}
              />
              <span
                className={`relative flex-1 text-center ${theme === "dark" ? "text-background" : ""}`}
              >
                Dark
              </span>
              <span
                className={`relative flex-1 text-center ${theme === "light" ? "text-background" : ""}`}
              >
                Light
              </span>
            </button>
          </div>
        </div>
      </header>
    </LazyMotion>
  );
}
