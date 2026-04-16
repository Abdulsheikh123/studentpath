import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section className="w-full min-w-0 border-b border-border/60">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        <div
          className={cn(
            "grid gap-8 py-10 sm:gap-10 sm:py-14 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:py-20",
            className,
          )}
        >
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(12.9%_0.042_264.695)] sm:text-xs dark:border-white/10 dark:bg-white/5 dark:text-cyan-300">
              {eyebrow}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7 md:text-lg">
                {description}
              </p>
            </div>

            {actions ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
            ) : null}
          </div>

          {aside ? <div className="min-w-0 w-full">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
