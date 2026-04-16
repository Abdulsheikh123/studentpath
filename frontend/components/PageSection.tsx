import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function PageSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("w-full min-w-0 py-10 sm:py-12 md:py-14 lg:py-16", className)}>
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[oklch(12.9%_0.042_264.695)] sm:text-sm dark:text-cyan-300">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-8 min-w-0 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}
