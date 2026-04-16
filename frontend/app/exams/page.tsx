import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  Briefcase,
  FileCheck,
  GraduationCap,
  Landmark,
  School,
  Search,
} from "lucide-react";

import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const examCategories = [
  {
    title: "After 5th",
    items: [
      "JNVST (Navodaya Entrance Exam)",
      "Sainik School Entrance Exam",
      "RMS CET",
      "RIMC Entrance Exam",
    ],
    description:
      "These exams help students get admission in government and residential schools after Class 5.",
    icon: School,
  },
  {
    title: "After 8th",
    items: [
      "Navodaya Lateral Entry Test",
      "Sainik School Class 9 Entrance",
      "Kendriya Vidyalaya Admission Test",
    ],
    description:
      "Students can apply for better schools and scholarship-based education after Class 8.",
    icon: Landmark,
  },
  {
    title: "After 10th",
    items: [
      "Polytechnic Entrance Exam",
      "ITI Admission Test",
      "NDA Foundation",
      "State Board / Open School Entrance",
    ],
    description:
      "Choose the right exam based on whether you want diploma, school or career-focused education.",
    icon: GraduationCap,
  },
  {
    title: "After 12th",
    items: [
      "JEE Main",
      "JEE Advanced",
      "NEET",
      "CUET",
      "NDA",
      "CLAT",
      "NATA",
      "NIFT",
      "Hotel Management Entrance",
    ],
    description:
      "These are the most popular exams for engineering, medical, law, design and other undergraduate courses.",
    icon: FileCheck,
  },
  {
    title: "After Graduation",
    items: ["CAT", "MAT", "XAT", "CMAT", "NIMCET", "GATE", "SSC CGL", "UPSC"],
    description:
      "Graduation-level exams are important for MBA, MCA, government jobs and higher education.",
    icon: Briefcase,
  },
  {
    title: "Higher Education & Research",
    items: ["NET", "SET", "GATE", "UGC NET", "CSIR NET", "PhD Entrance Test"],
    description:
      "Students planning for teaching, research and higher studies can explore these exams.",
    icon: BookMarked,
  },
];

const popularExams = [
  {
    name: "JEE Main",
    applyFor: "12th PCM students",
    month: "January & April",
    conductedBy: "NTA",
    usedFor: "BTech admission in engineering colleges",
    website: "https://jeemain.nta.nic.in/",
  },
  {
    name: "NEET",
    applyFor: "12th PCB students",
    month: "Usually May",
    conductedBy: "NTA",
    usedFor: "Medical admission in MBBS and related courses",
    website: "https://neet.nta.nic.in/",
  },
  {
    name: "CUET",
    applyFor: "12th pass students",
    month: "Usually May",
    conductedBy: "NTA",
    usedFor: "UG admission in central and participating universities",
    website: "https://cuet.nta.nic.in/",
  },
  {
    name: "CAT",
    applyFor: "Graduation students",
    month: "Usually November",
    conductedBy: "IIMs",
    usedFor: "MBA admission in top management institutes",
    website: "https://iimcat.ac.in/",
  },
  {
    name: "NDA",
    applyFor: "12th students",
    month: "Usually April & September",
    conductedBy: "UPSC",
    usedFor: "Defence career entry after school",
    website: "https://upsc.gov.in/",
  },
  {
    name: "NIMCET",
    applyFor: "Graduation students for MCA",
    month: "Usually June",
    conductedBy: "NITs",
    usedFor: "MCA admission in NIT campuses",
    website: "https://www.nimcet.in/",
  },
];

const examDetailItems = [
  "Overview",
  "Eligibility",
  "Age Limit",
  "Subjects Required",
  "Syllabus",
  "Exam Pattern",
  "Important Dates",
  "Admit Card",
  "Result",
  "Counselling",
  "Official Website Link",
  "FAQs",
];

const searchGoals = [
  "Engineering",
  "Medical",
  "Government Jobs",
  "Law",
  "Design",
  "MBA",
  "MCA",
  "Scholarship Exams",
];

const faqs = [
  {
    question: "Which exam should I prepare for after 10th?",
    answer:
      "After 10th, the right exam depends on your goal. Polytechnic entrance exams are useful for diploma courses, ITI admission tests are useful for skill-based technical programs, and school-level entrance routes can help if you want to move into another school system.",
  },
  {
    question: "Which entrance exams are available after 12th?",
    answer:
      "After 12th, students commonly prepare for JEE Main and JEE Advanced for engineering, NEET for medical courses, CUET for university admissions, CLAT for law, NATA and NIFT for design-related fields, and NDA for defence entry.",
  },
  {
    question: "What is the difference between JEE and CUET?",
    answer:
      "JEE is mainly used for engineering admissions such as BTech and BE programs, while CUET is used for undergraduate admission in central and participating universities across many subjects like arts, commerce, science, and vocational courses.",
  },
  {
    question: "Which exam is required for MBA?",
    answer:
      "For MBA admission, students usually prepare for CAT, MAT, XAT, or CMAT depending on the institute and admission route. CAT is commonly preferred for IIMs and many top management colleges.",
  },
  {
    question: "Which exam is best for MCA admission?",
    answer:
      "NIMCET is one of the most important exams for MCA admission in NITs. Some universities and colleges may also accept their own entrance tests or merit-based admission depending on the institution.",
  },
];

export default function ExamsPage() {
  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Exams"
        title="Explore Entrance Exams After Every Class"
        description="StudentPath helps students understand which exams they should prepare for after 5th, 8th, 10th, 12th, graduation and postgraduation. Get exam details, eligibility, syllabus, important dates and official links in one place."
        actions={
          <>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/admissions" />}
            >
              View admissions
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/colleges" />}
            >
              Explore colleges
            </Button>
          </>
        }
        aside={
          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-2xl leading-snug sm:text-3xl">
                Find the right exam for school admissions, college admissions
                and career opportunities.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:pb-8 sm:text-base">
              Use StudentPath to match your class or goal with the exams that
              matter next, along with practical details and official links.
            </CardContent>
          </Card>
        }
      />

      <PageSection
        eyebrow="Exam Categories"
        title="Entrance Exams After Every Stage"
        description="Explore school, college, career and higher education exams based on where you are in your academic journey."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {examCategories.map((category) => {
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
        eyebrow="Popular Exams"
        title="Popular Exams Students Search For"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {popularExams.map((exam) => (
            <Card
              key={exam.name}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl">{exam.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">For:</span>{" "}
                  {exam.applyFor}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Conducted by:
                  </span>{" "}
                  {exam.conductedBy}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Usually held:
                  </span>{" "}
                  {exam.month}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Used for:
                  </span>{" "}
                  {exam.usedFor}
                </p>
                <a
                  href={exam.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Official Website
                </a>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/exams" />}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Exam Details"
        title="What Each Exam Page Should Include"
        description="Every exam detail view should help students understand the full admission and exam process clearly."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {examDetailItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-background px-4 py-4 text-sm font-medium text-foreground shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Search Exams"
        title="Search Exams by Goal"
      >
        <div className="flex flex-wrap gap-3">
          {searchGoals.map((goal) => (
            <Button
              key={goal}
              variant="outline"
              className="rounded-2xl"
            >
              <Search className="mr-2 h-4 w-4" />
              {goal}
            </Button>
          ))}
        </div>
      </PageSection>

      <PageSection eyebrow="FAQs" title="Common Exam Questions">
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="px-6 py-2 sm:px-8">
            <Accordion type="single" collapsible>
              {faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-base leading-7 text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection
        eyebrow="Start Here"
        title="Find the Right Exam for Your Future"
        description="Choose your class or career goal and discover the exams that match your dream."
      >
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="flex flex-col gap-4 px-6 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              StudentPath helps you move from exam confusion to clear action with
              stage-based exam discovery, official links, and practical guidance.
            </p>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Explore your exam path
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </PageSection>
    </main>
  );
}
