"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import PageContainer from "../PageContainer";
import { Button } from "../ui/button";
import { featuredCards } from "./home-featured-data";

export default function HomeExploreCards() {
  return (
    <section className="py-12 sm:py-14">
      <PageContainer>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            Featured Guidance
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Explore Top Schools, Colleges, Admissions and Entrance Exams Across
            India
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.name}
                className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-36 w-full overflow-hidden bg-muted/40">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>

                <div className="p-4 text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:items-start sm:justify-between">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.accent}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/70">
                      <Star
                        className="h-3 w-3 fill-current"
                        aria-hidden="true"
                      />
                      {card.rating}
                    </div>
                  </div>

                  <div className="mt-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {card.type}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {card.name}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                    {card.description}
                  </p>

                  <Button
                    className="mt-4 h-9 w-full rounded-xl px-4 text-sm sm:w-auto"
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
      </PageContainer>
    </section>
  );
}
