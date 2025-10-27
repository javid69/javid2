'use client';

import { memo } from "react";

export type ScrollSectionProps = {
  index: number;
  register: (node: HTMLElement | null, index: number) => void;
  eyebrow: string;
  headline: string;
  copy: string;
  label: string;
  active: boolean;
};

const ScrollSectionComponent = ({
  index,
  register,
  eyebrow,
  headline,
  copy,
  label,
  active,
}: ScrollSectionProps) => {
  const baseClasses =
    "scroll-section flex min-h-screen flex-col justify-center px-6 py-24 sm:px-12 md:px-20";
  const stateClasses = active
    ? "opacity-100 translate-y-0"
    : "opacity-30 translate-y-8 sm:translate-y-10";

  return (
    <section
      ref={(node) => register(node, index)}
      data-scroll-index={index}
      className={`${baseClasses} transition duration-500 ease-out ${stateClasses}`}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-slate-400">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/60 text-xs font-semibold text-slate-300/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{eyebrow}</span>
        </div>
        <div className="space-y-6">
          <div className="flex flex-wrap items-baseline gap-4 text-slate-400/80">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
              {label}
            </span>
            <span className="h-px flex-1 bg-slate-800/60" aria-hidden />
          </div>
          <h2 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            {headline}
          </h2>
          <p className="text-lg leading-relaxed text-slate-300/90 sm:text-xl">
            {copy}
          </p>
        </div>
      </div>
    </section>
  );
};

export const ScrollSection = memo(ScrollSectionComponent);
