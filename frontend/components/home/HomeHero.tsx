"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroLottie from "../HeroLottie";
import PageContainer from "../PageContainer";
import { Button } from "../ui/button";

export default function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden py-2 sm:py-4 md:py-5 lg:py-4">
      <div className="pointer-events-none absolute inset-0 z-0">
        <PageContainer className="flex h-full items-end justify-center py-3 sm:items-center sm:py-5">
          <div className="relative w-full overflow-hidden rounded-[1.75rem] p-2.5 dark:bg-slate-950/40 sm:rounded-[2.5rem] sm:p-6">
            <div className="pointer-events-none absolute -top-8 left-1/4 h-20 w-20 rounded-full bg-cyan-400/20 blur-3xl sm:-top-10 sm:h-32 sm:w-32" />
            <div className="pointer-events-none absolute bottom-6 right-1/4 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl sm:bottom-10 sm:h-40 sm:w-40" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 rounded-t-[1.75rem] bg-linear-to-b from-background/30 to-transparent backdrop-blur-md mask-[linear-gradient(to_bottom,black,transparent)] dark:from-background/50 sm:h-40 sm:rounded-t-[2.5rem]" />
            <HeroLottie className="relative z-10 block h-[180px] w-full overflow-hidden rounded-[1.25rem] opacity-70 sm:h-[380px] sm:rounded-3xl sm:opacity-100 lg:h-[640px]" />
          </div>
        </PageContainer>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent sm:h-32" />
      </div>

      <PageContainer className="relative z-10 py-3 text-center sm:py-5 md:py-6 lg:py-6">
        <div className="mx-auto flex min-h-[400px] w-full max-w-5xl flex-col items-center justify-center gap-3 sm:min-h-[470px] md:min-h-[520px] lg:min-h-[58vh]">
          <div className="mb-4 inline-flex max-w-full rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur-sm dark:bg-slate-900/80 dark:text-cyan-400 sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
            India&apos;s Student Guidance Platform
          </div>

          <h1 className="mb-4 max-w-4xl text-2xl font-bold leading-tight tracking-tight text-foreground drop-shadow-[0_2px_15px_rgba(0,0,0,0.2)] sm:mb-5 sm:text-5xl lg:text-6xl lg:leading-[1.1] dark:drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]">
            Find the Right School, College and Exam
          </h1>

          <p className="mb-6 max-w-2xl text-sm font-medium leading-6 text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] sm:mb-8 sm:text-xl sm:leading-relaxed dark:drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
            Explore the right schools after 5th, 8th, 10th and 12th. Find
            entrance exams, top colleges, scholarships and career options, all
            in one place.
          </p>

          <div className="mt-1 flex w-full max-w-md flex-col gap-3 sm:max-w-xl sm:flex-row sm:justify-center sm:gap-5">
            <Button
              size="lg"
              className="h-11 w-full gap-2 rounded-2xl shadow-lg sm:w-auto"
              nativeButton={false}
              render={<Link href="/colleges" />}
            >
              Explore Colleges
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full rounded-2xl bg-background/80 shadow-sm backdrop-blur-md hover:bg-background sm:w-auto"
              nativeButton={false}
              render={<Link href="/admissions" />}
            >
              Explore Admissions
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
