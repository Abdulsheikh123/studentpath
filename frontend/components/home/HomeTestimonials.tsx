"use client";

import PageContainer from "../PageContainer";
import { testimonialCards } from "./home-content";

const loopedTestimonials = [...testimonialCards, ...testimonialCards];

export default function HomeTestimonials() {
  return (
    <section className="overflow-hidden py-10 sm:py-12">
      <PageContainer>
        <div className="mx-auto max-w-3xl px-1 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            Student Testimonials
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
            Real students, real guidance, clearer decisions.
          </h2>
        </div>

        <div className="mt-7 overflow-hidden lg:hidden">
          <div className="testimonial-slider flex w-max gap-4">
            {loopedTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="w-[calc(100vw-2.5rem)] max-w-sm shrink-0 rounded-3xl border border-border/70 bg-background p-5 text-center shadow-sm md:w-[calc(50vw-2.75rem)] md:max-w-none"
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${testimonial.avatarClassName}`}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {testimonial.stage}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {testimonial.message}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 hidden overflow-hidden lg:block">
          <div className="testimonial-marquee flex w-max gap-4 md:gap-5">
            {loopedTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="w-[17rem] shrink-0 rounded-3xl border border-border/70 bg-background p-5 shadow-sm md:w-[19rem] lg:w-[20rem]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${testimonial.avatarClassName}`}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {testimonial.stage}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                  {testimonial.message}
                </p>
              </article>
            ))}
          </div>
        </div>
      </PageContainer>

      <style jsx>{`
        .testimonial-slider {
          animation: testimonial-slider 24s linear infinite;
        }

        .testimonial-slider:hover {
          animation-play-state: paused;
        }

        .testimonial-marquee {
          animation: testimonial-marquee 30s linear infinite;
        }

        .testimonial-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes testimonial-slider {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        @keyframes testimonial-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 0.625rem));
          }
        }
      `}</style>
    </section>
  );
}
