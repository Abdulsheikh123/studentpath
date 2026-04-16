"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import PageContainer from "../PageContainer";
import { Button } from "../ui/button";
import { featuredCards } from "./home-featured-data";

type HomeSearchResultsProps = {
  query: string;
};

export default function HomeSearchResults({ query }: HomeSearchResultsProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = featuredCards.filter((card) => {
    const haystack = `${card.name} ${card.type} ${card.description}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const cardsToShow = results.length > 0 ? results : featuredCards;

  return (
    <section className="border-b border-border/60 py-12 sm:py-14">
      <PageContainer>
        <div className="rounded-[1.75rem] border border-cyan-200/70 bg-gradient-to-br from-cyan-50/80 via-background to-blue-50/70 p-1.5 shadow-[0_20px_50px_-24px_rgba(34,211,238,0.4)] dark:border-cyan-900/50 dark:from-cyan-950/20 dark:via-background dark:to-slate-900/40 sm:rounded-[2.25rem] sm:p-2">
          <div className="rounded-[1.4rem] border border-border/70 bg-background/90 p-4 shadow-xl backdrop-blur-md sm:rounded-[1.8rem] sm:p-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 ring-1 ring-cyan-200/70 dark:bg-cyan-900/30 dark:text-cyan-300 dark:ring-cyan-800">
                <Search className="h-3.5 w-3.5" />
                Search Results
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Results for &quot;{query}&quot;
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Matching school, college aur entrance exam options yahan dikh rahe hain.
              </p>
            </div>

            {results.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground sm:text-base">
                Exact match nahi mila, isliye top recommended options show kiye gaye hain.
              </p>
            ) : null}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {cardsToShow.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={`${query}-${card.name}`}
                    className="overflow-hidden rounded-[1.25rem] border border-border/70 bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative h-28 w-full overflow-hidden bg-muted/40">
                      <Image
                        src={card.image}
                        alt={card.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      />
                    </div>

                    <div className="p-3.5 text-center sm:text-left">
                      <div className="flex items-center justify-center gap-2 sm:items-start sm:justify-between">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.accent}`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/70">
                          <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                          {card.rating}
                        </div>
                      </div>

                      <div className="mt-2.5 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {card.type}
                      </div>

                      <h3 className="mt-2.5 text-base font-semibold text-foreground">
                        {card.name}
                      </h3>

                      <p className="mt-2 text-[11px] leading-4.5 text-muted-foreground sm:text-xs">
                        {card.description}
                      </p>

                      <Button
                        className="mt-3 h-8 w-full rounded-lg px-3 text-xs sm:w-auto"
                        nativeButton={false}
                        render={<Link href={card.href} />}
                      >
                        View
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
