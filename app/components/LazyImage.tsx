"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type LazyImageProps = ImageProps & {
  rootMargin?: string;
};

export function LazyImage({ rootMargin = "200px", ...props }: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!placeholderRef.current || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(placeholderRef.current);

    return () => observer.disconnect();
  }, [rootMargin, isVisible]);

  const shouldFill = Boolean((props as { fill?: boolean }).fill);
  const placeholderClassName = [
    shouldFill ? "absolute inset-0 h-full w-full" : "h-full w-full",
    "animate-pulse",
    "rounded-2xl",
    "bg-slate-800/40",
  ].join(" ");

  if (!isVisible) {
    return <div ref={placeholderRef} className={placeholderClassName} aria-hidden />;
  }

  return <Image {...props} />;
}
