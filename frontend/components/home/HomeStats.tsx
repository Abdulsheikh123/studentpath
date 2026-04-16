"use client";

import PageContainer from "../PageContainer";

const defaultStats = [
  { label: "Students Guided", value: "25K+" },
  { label: "Schools & Colleges", value: "500+" },
  { label: "Entrance Exams", value: "100+" },
  { label: "Cities Covered", value: "120+" },
];

export default function HomeStats() {
  return (
    <section className="w-full min-w-0 py-6 sm:py-8 md:py-10">
      <PageContainer className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {defaultStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-border/70 bg-background p-4 shadow-sm transition-all duration-500"
          >
            <p className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-left sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-center text-sm font-medium text-muted-foreground sm:text-left">
              {stat.label}
            </p>
          </div>
        ))}
      </PageContainer>
    </section>
  );
}
