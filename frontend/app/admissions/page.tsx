import Link from "next/link";
import {
  ArrowRight,
  CheckCheck,
  FileCheck,
  Files,
  GraduationCap,
  Landmark,
  School,
} from "lucide-react";

import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const admissionCategories = [
  {
    title: "After 5th Admissions",
    items: [
      "Jawahar Navodaya Vidyalaya (JNV)",
      "Sainik School",
      "Military School",
      "RMS / RIMC",
    ],
    description:
      "Explore schools that offer admission after Class 5 through entrance exams.",
    icon: School,
  },
  {
    title: "After 8th Admissions",
    items: [
      "Navodaya Lateral Entry",
      "Sainik School Class 9",
      "Kendriya Vidyalaya Class 9",
      "State Government Schools",
    ],
    description:
      "Find admission opportunities after Class 8 with eligibility and application details.",
    icon: Landmark,
  },
  {
    title: "After 10th Admissions",
    items: [
      "Polytechnic / Diploma",
      "ITI",
      "Science, Commerce, Arts Streams",
      "School Change / Open School",
    ],
    description: "Know the best options after Class 10 and how to apply.",
    icon: GraduationCap,
  },
  {
    title: "After 12th Admissions",
    items: [
      "Engineering Colleges",
      "Medical Colleges",
      "BCA, BBA, BA, BCom, BSc",
      "Government and Private Colleges",
    ],
    description:
      "Find courses, colleges and entrance exams after Class 12.",
    icon: FileCheck,
  },
  {
    title: "UG Admissions",
    items: [
      "BTech",
      "BCA",
      "BBA",
      "BA / BCom / BSc",
      "Law / Design / Hotel Management",
    ],
    description:
      "Complete guidance for undergraduate admissions and entrance exams.",
    icon: CheckCheck,
  },
  {
    title: "PG Admissions",
    items: ["MCA", "MBA", "MA / MSc / MCom", "MTech", "PhD"],
    description:
      "Explore postgraduate courses, colleges and admission process.",
    icon: Files,
  },
];

const popularAdmissions = [
  "Navodaya Vidyalaya Admission",
  "Kendriya Vidyalaya Admission",
  "Sainik School Admission",
  "Jamia School Admission",
  "AMU School Admission",
  "Delhi University Admission",
  "JNU Admission",
  "BHU Admission",
];

const admissionSteps = [
  "Select your class or course",
  "Check eligibility and exam details",
  "View important dates and documents required",
  "Apply using the official link",
];

const requiredDocuments = [
  "Aadhaar Card",
  "Passport Size Photo",
  "Previous Marksheet",
  "Transfer Certificate",
  "Category Certificate (if applicable)",
  "Income Certificate",
  "Entrance Exam Admit Card",
];

const faqs = [
  "Which school can I join after Class 5?",
  "What is the best option after Class 10?",
  "Which entrance exams are needed after Class 12?",
  "How can I apply for college admission?",
  "Can I search colleges by city?",
];

export default function AdmissionsPage() {
  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Admissions"
        title="School & College Admissions Made Simple"
        description="StudentPath helps students and parents understand the admission process after every class, from school admissions after 5th and 8th to college admissions after 12th and graduation."
        actions={
          <>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/colleges" />}
            >
              Explore colleges
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/cities" />}
            >
              Search by city
            </Button>
          </>
        }
        aside={
          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-2xl leading-snug sm:text-3xl">
                Find complete admission details, eligibility, entrance exams,
                important dates and official apply links for schools and
                colleges across India.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:pb-8 sm:text-base">
              StudentPath brings admissions after every class into one clear
              view so students and parents can move from search to action with
              less confusion.
            </CardContent>
          </Card>
        }
      />

      <PageSection
        eyebrow="Main Categories"
        title="Admission Paths After Every Stage"
        description="Choose the right admission path based on your class, course level, and next academic goal."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {admissionCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.title}
                className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
              >
                <CardHeader className="px-6 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-cyan-600 dark:bg-blue-500/10 dark:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-4 text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <div className="grid gap-2">
                    {category.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Popular Routes"
        title="Popular Admissions Students Search For"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {popularAdmissions.map((item) => (
            <Card
              key={item}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl leading-7">{item}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3">
                    Eligibility
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3">
                    Last Date
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3">
                    Entrance Exam
                  </div>
                </div>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/contact" />}
                >
                  Apply
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Admission Process"
        title="How Admission Works"
        description="Follow a simple step-by-step process before you apply."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {admissionSteps.map((step, index) => (
            <Card
              key={step}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardContent className="px-6 py-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase dark:text-cyan-300">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-foreground">
                  {step}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Documents"
        title="Documents Required for Admission"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {requiredDocuments.map((document) => (
            <div
              key={document}
              className="rounded-2xl border border-border/70 bg-background px-4 py-4 text-sm font-medium text-foreground shadow-sm"
            >
              {document}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection eyebrow="FAQs" title="Common Admission Questions">
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((question) => (
            <Card
              key={question}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardContent className="px-6 py-6 text-base font-medium leading-7 text-foreground">
                {question}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Start Today"
        title="Start Your Admission Journey Today"
        description="Choose your class, course or city and find the right admission path for you."
      >
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="flex flex-col gap-4 px-6 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              StudentPath helps you move from confusion to clarity with
              admissions guidance for schools, colleges, courses and official
              application routes.
            </p>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Start now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </PageSection>
    </main>
  );
}
