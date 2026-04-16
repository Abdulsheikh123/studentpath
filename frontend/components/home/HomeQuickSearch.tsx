"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";

type HomeQuickSearchProps = {
  embedded?: boolean;
  value?: string;
  onQueryChange?: (query: string) => void;
};

export default function HomeQuickSearch({
  embedded = false,
  value = "",
  onQueryChange,
}: HomeQuickSearchProps) {
  if (embedded) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-[1.5rem] border border-cyan-200/70 bg-gradient-to-br from-cyan-50/80 via-background to-blue-50/70 p-2 shadow-[0_20px_50px_-24px_rgba(34,211,238,0.45)] dark:border-cyan-900/50 dark:from-cyan-950/20 dark:via-background dark:to-slate-900/40 sm:rounded-[2.25rem] sm:p-3 lg:p-4">
          <div className="rounded-[1.2rem] border border-border/70 bg-background/90 p-4 shadow-xl backdrop-blur-md sm:rounded-[1.8rem] sm:p-6 lg:p-8">
            <p className="mb-4 text-center text-base font-medium leading-6 sm:mb-6 sm:text-lg lg:text-2xl">
              Search Anything: Schools, Colleges, Exams, Admissions
            </p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-500 sm:left-6 sm:h-7 sm:w-7 lg:left-8 lg:h-8 lg:w-8" />
              <Input
                type="search"
                value={value}
                onChange={(event) => onQueryChange?.(event.target.value)}
                placeholder="Search colleges, schools, entrance exams, scholarships or cities"
                className="h-14 w-full rounded-xl border-border/70 bg-muted/20 pl-12 pr-4 text-base shadow-sm transition-colors focus-visible:border-cyan-300 focus-visible:ring-cyan-300/30 sm:h-20 sm:rounded-full sm:pl-16 sm:pr-8 sm:text-lg lg:h-24 lg:pl-20 lg:text-xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
