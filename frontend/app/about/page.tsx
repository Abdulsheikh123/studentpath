import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileCheck,
  GraduationCap,
  Landmark,
  Lightbulb,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const helpItems = [
  {
    title: "School admissions after 5th and 8th",
    description: "Explore school opportunities early with clear admission guidance and planning support.",
    icon: BookOpen,
  },
  {
    title: "Navodaya, KV, Sainik School and Jamia admissions",
    description: "Find official pathways and trusted information for leading school admission routes.",
    icon: Landmark,
  },
  {
    title: "Best stream selection after 10th",
    description: "Understand stream choices and select the right direction with less confusion.",
    icon: Lightbulb,
  },
  {
    title: "Courses and colleges after 12th",
    description: "Compare academic options, colleges, and next-step decisions after school.",
    icon: GraduationCap,
  },
  {
    title: "JEE, NEET, CUET, CAT, NDA, NIMCET and more",
    description: "Get exam-focused direction for major entrance tests and higher education pathways.",
    icon: FileCheck,
  },
  {
    title: "UG, PG and higher education guidance",
    description: "Move from undergraduate to postgraduate planning with structured support.",
    icon: ShieldCheck,
  },
  {
    title: "Scholarships and financial aid",
    description: "Discover scholarship opportunities and funding support that can reduce the burden on families.",
    icon: Sparkles,
  },
  {
    title: "City-wise school and college search",
    description: "Browse education options across India by city to find what is relevant locally.",
    icon: MapPinned,
  },
  {
    title: "Career guidance and study resources",
    description: "Connect education choices with long-term career goals and useful preparation resources.",
    icon: ArrowRight,
  },
];

const chooseItems = [
  "Simple language in Hindi and English",
  "Official admission and application links",
  "Clear step-by-step guidance",
  "One platform for school, college and career planning",
];

const whyStartedItems = [
  "What to do after every class",
  "Which exam they should prepare for",
  "Which school or college is best",
  "How to apply through official links",
  "Which scholarships are available",
];

export default function AboutPage() {
  return (
    <main className="min-w-0">
      <section className="relative overflow-hidden border-b border-border/60 bg-background py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">

        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex max-w-full rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur-sm dark:bg-slate-900/80 dark:text-cyan-400 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
              About StudentPath
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Helping students find the right school, college, exam and career path.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              StudentPath is an education guidance platform created to make
              school admissions, college admissions, entrance exams and career
              choices easier for students and parents across India.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 rounded-2xl"
                nativeButton={false}
                render={<Link href="/admissions" />}
              >
                Explore admissions
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl bg-background/80 backdrop-blur-md"
                nativeButton={false}
                render={<Link href="/colleges" />}
              >
                Explore colleges
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -top-4 left-6 h-20 w-20 rounded-full bg-cyan-400/20 blur-3xl sm:h-24 sm:w-24" />
            <div className="pointer-events-none absolute -bottom-2 right-6 h-24 w-24 rounded-full bg-blue-500/15 blur-3xl sm:h-28 sm:w-28" />

            <Card className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/90 py-0 shadow-xl backdrop-blur-md">
              <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
                <div className="inline-flex w-fit rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
                  Student Journey
                </div>
                <CardTitle className="pt-4 text-xl sm:text-2xl">
                  Guidance that feels clear at every stage
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-gradient-to-br from-blue-50/70 via-background to-cyan-50/70 p-3 dark:from-slate-950 dark:via-background dark:to-slate-900 sm:p-4">
                  <img
                    src="/student-journey-visual.svg"
                    alt="Student journey guidance visual"
                    className="h-[180px] w-full object-cover sm:h-[230px] lg:h-[280px]"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "Admissions support",
                    "Exam planning",
                    "College guidance",
                    "Career direction",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <PageSection
        eyebrow="Our Mission"
        title="Our Mission"
        description="Our mission is to simplify the student journey. Many students do not know which school, stream, course, college or exam is right for them."
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardContent className="space-y-4 px-6 py-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:py-8 sm:text-base">
              <p>
                StudentPath helps by providing simple, clear and trusted information
                in both Hindi and English.
              </p>
              <p>
                We want every student, whether from a village, town or city, to get
                equal access to the right educational opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-xl">StudentPath Promise</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:pb-8 sm:text-base">
              Simple guidance, trusted information, and equal access to better
              educational choices for students across India.
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        eyebrow="Support Areas"
        title="What StudentPath Helps You With"
        description="StudentPath covers the key decisions students and parents face from school admissions to college, exams, scholarships and career planning."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {helpItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
              >
                <CardHeader className="px-6 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-cyan-600 dark:bg-blue-500/10 dark:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-4 text-xl leading-7">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm leading-6 text-muted-foreground sm:text-base">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Why We Started"
        title="Why We Started"
        description="Many education websites are difficult to understand. Important information is scattered across many different websites, and students often get confused."
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardContent className="space-y-4 px-6 py-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:py-8 sm:text-base">
              <p>
                We started StudentPath to create one simple platform where students
                can easily find the right direction at every stage of education.
              </p>
              <p>
                Instead of searching across many confusing websites, students and
                parents can understand the next step from one clear platform.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-xl">Students can easily find</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="grid gap-3">
                {whyStartedItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        eyebrow="Why Choose Us"
        title="Why Students Choose StudentPath"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {chooseItems.map((item) => (
            <Card
              key={item}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardContent className="px-6 py-6 text-base font-semibold leading-7 text-foreground">
                {item}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Our Vision"
        title="Our Vision"
        description="We want StudentPath to become India’s most trusted student guidance platform, helping students from school to college and from college to career."
      >
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="px-6 py-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:py-8 sm:text-base">
            StudentPath is being built to support students through every major
            educational decision with clarity, access, and confidence.
          </CardContent>
        </Card>
      </PageSection>

      <PageSection
        eyebrow="Start Here"
        title="Your Journey Starts Here"
        description="No matter where you are in your education journey, StudentPath is here to guide you."
      >
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="space-y-4 px-6 py-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:py-8 sm:text-base">
            <p>
              From your first school admission to your dream college and career,
              we help you move forward with confidence.
            </p>
            <p className="font-medium text-foreground">
              StudentPath is here to support every step of the student journey.
            </p>
          </CardContent>
        </Card>
      </PageSection>
    </main>
  );
}
