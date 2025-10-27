"use client";

import { ReactNode, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useThemeStore } from "@/lib/stores/theme-store";

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.setProperty("color-scheme", theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
