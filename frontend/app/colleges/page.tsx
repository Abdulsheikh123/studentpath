import Link from "next/link";
import { fetchColleges, fetchPopularCities, fetchUniversities } from "@/lib/api-public";
import CollegesFilter from "@/components/colleges/CollegesFilter";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Landmark,
  MapPinned,
  Scale,
  Search,
  WalletCards,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterGroups = [
  {
    label: "Course",
    placeholder: "Select course",
    options: ["BTech", "BCA", "BBA", "BA", "BCom", "BSc", "MBBS", "MBA", "MCA"],
  },
  {
    label: "City",
    placeholder: "Select city",
    options: ["Delhi", "Aligarh", "Lucknow", "Jaipur", "Mumbai", "Bengaluru"],
  },
  {
    label: "State",
    placeholder: "Select state",
    options: ["Delhi", "Uttar Pradesh", "Rajasthan", "Maharashtra", "Karnataka"],
  },
  {
    label: "Fees",
    placeholder: "Select fees",
    options: ["Below 50K", "50K - 1L", "1L - 3L", "3L+"],
  },
  {
    label: "Type",
    placeholder: "Government / Private",
    options: ["Government", "Private"],
  },
  {
    label: "Entrance Exam",
    placeholder: "Select exam",
    options: ["JEE", "NEET", "CUET", "CAT", "NIMCET"],
  },
  {
    label: "Rating",
    placeholder: "Select rating",
    options: ["5 Star", "4 Star & above", "3 Star & above"],
  },
];

const collegeCategories = [
  {
    title: "Engineering Colleges",
    items: ["IITs", "NITs", "IIITs", "State Engineering Colleges", "Private Engineering Colleges"],
    description: "Find the best colleges for BTech, Diploma and engineering courses.",
    icon: Building2,
  },
  {
    title: "Medical Colleges",
    items: ["AIIMS", "Government Medical Colleges", "Private Medical Colleges", "Dental Colleges"],
    description: "Explore MBBS, BDS and other medical colleges.",
    icon: Landmark,
  },
  {
    title: "Commerce & Management Colleges",
    items: ["BBA Colleges", "MBA Colleges", "Commerce Colleges", "CA / CS Institutes"],
    description: "Best options for students interested in business and management.",
    icon: WalletCards,
  },
  {
    title: "Computer & IT Colleges",
    items: ["BCA Colleges", "MCA Colleges", "Computer Science Colleges", "Data Science & AI Colleges"],
    description: "Explore colleges for software, coding and technology-related careers.",
    icon: GraduationCap,
  },
  {
    title: "Arts & Humanities Colleges",
    items: ["BA Colleges", "Journalism Colleges", "Law Colleges", "Design Colleges"],
    description: "Find colleges for arts, literature, law, design and creative fields.",
    icon: MapPinned,
  },
];

const topUniversities = [
  {
    name: "AMU",
    location: "Aligarh",
    courses: "BA, BSc, BTech, Law",
    exam: "CUET / University Route",
    fees: "Low to Moderate",
  },
  {
    name: "Delhi University",
    location: "Delhi",
    courses: "BA, BCom, BSc, BBA",
    exam: "CUET",
    fees: "Affordable to Moderate",
  },
  {
    name: "Jamia Millia Islamia",
    location: "Delhi",
    courses: "BA, BTech, Journalism, Law",
    exam: "CUET / Internal Tests",
    fees: "Affordable to Moderate",
  },
  {
    name: "JNU",
    location: "Delhi",
    courses: "BA, MA, MSc, Research",
    exam: "CUET PG / University Route",
    fees: "Affordable",
  },
  {
    name: "BHU",
    location: "Varanasi",
    courses: "BA, BSc, BCom, Medical",
    exam: "CUET / NEET",
    fees: "Affordable to Moderate",
  },
  {
    name: "IIT Delhi",
    location: "Delhi",
    courses: "BTech, MTech, Research",
    exam: "JEE Advanced / GATE",
    fees: "Moderate to High",
  },
  {
    name: "AIIMS Delhi",
    location: "Delhi",
    courses: "MBBS, Nursing, Medical Research",
    exam: "NEET",
    fees: "Affordable",
  },
  {
    name: "Lucknow University",
    location: "Lucknow",
    courses: "BA, BCom, BSc, Law",
    exam: "CUET / University Route",
    fees: "Affordable to Moderate",
  },
];

const cityColleges = [
  {
    city: "Delhi",
    count: "250+ colleges",
    courses: "BTech, BCom, BA, MBBS",
    universities: "DU, JNU, Jamia, AIIMS",
  },
  {
    city: "Aligarh",
    count: "60+ colleges",
    courses: "BA, BSc, BTech, Law",
    universities: "AMU and local institutes",
  },
  {
    city: "Lucknow",
    count: "140+ colleges",
    courses: "BBA, BCom, BA, Law",
    universities: "Lucknow University and more",
  },
  {
    city: "Jaipur",
    count: "180+ colleges",
    courses: "Engineering, Design, Commerce",
    universities: "State and private universities",
  },
  {
    city: "Hyderabad",
    count: "220+ colleges",
    courses: "Engineering, Medical, IT",
    universities: "JNTU and major private campuses",
  },
  {
    city: "Bengaluru",
    count: "300+ colleges",
    courses: "BCA, MCA, BTech, MBA",
    universities: "Top IT and management colleges",
  },
  {
    city: "Mumbai",
    count: "260+ colleges",
    courses: "Commerce, Media, Law, Management",
    universities: "Mumbai University and top institutes",
  },
  {
    city: "Pune",
    count: "210+ colleges",
    courses: "Engineering, MCA, MBA, Science",
    universities: "Savitribai Phule Pune University and more",
  },
];

const compareItems = [
  {
    title: "DU vs JNU",
    details: ["Fees", "Ranking", "Courses Offered", "Scholarship"],
  },
  {
    title: "AMU vs Jamia",
    details: ["Placement", "Hostel", "Eligibility", "Entrance Exam"],
  },
  {
    title: "IIT Delhi vs NIT Delhi",
    details: ["Fees", "Placement", "Ranking", "Hostel"],
  },
];

const collegeDetailItems = [
  "About College",
  "Courses Offered",
  "Fees",
  "Admission Process",
  "Entrance Exams",
  "Eligibility",
  "Hostel",
  "Placements",
  "Scholarship",
  "Campus Photos",
  "Official Website Link",
  "FAQs",
];

const faqs = [
  {
    question: "Which college is best after 12th?",
    answer:
      "The best college after 12th depends on your course, budget, city preference, and entrance exam score. Students should compare course quality, fees, placements, location, and admission route before deciding.",
  },
  {
    question: "How can I search colleges by city?",
    answer:
      "You can search colleges by city by using location-based filters and city-wise college sections. This helps students compare institutions available in places like Delhi, Aligarh, Lucknow, Jaipur, Mumbai, and Bengaluru.",
  },
  {
    question: "Which entrance exam is needed for BTech?",
    answer:
      "For BTech, the most common entrance exams are JEE Main and JEE Advanced. Some states and private colleges may also use their own entrance exams or counselling-based admission routes.",
  },
  {
    question: "Which college is best for BCA?",
    answer:
      "The best BCA college depends on faculty, computer labs, placement support, fees, and city. Students should compare IT-focused colleges and universities offering strong computer application programs.",
  },
  {
    question: "Government college or private college — which is better?",
    answer:
      "Government colleges are usually more affordable and often have strong academic value, while private colleges may offer modern infrastructure and wider seat availability. The better option depends on course quality, fees, campus facilities, and placement outcomes.",
  },
];

export default async function CollegesPage() {
  const universitiesRes = await fetchUniversities({ limit: "8" });
  const collegesRes = await fetchColleges({ limit: "8" });
  const citiesRes = await fetchPopularCities();

  const dynamicUniversities = universitiesRes.data || [];
  const dynamicColleges = collegesRes.data || [];
  const dynamicCities = citiesRes.data || [];

  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Colleges"
        title="Find the Right College for Your Future"
        description="StudentPath helps students find the best college after 12th, graduation and postgraduation. Search by course, city, stream or entrance exam and compare colleges easily."
        actions={
          <>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/cities" />}
            >
              Explore cities
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Ask for guidance
            </Button>
          </>
        }
        aside={
          <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-2xl leading-snug sm:text-3xl">
                Explore top colleges, universities, courses, entrance exams and
                admission details across India.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:pb-8 sm:text-base">
              Search by course, city, stream or entrance exam and compare
              colleges with a clearer and more student-friendly view.
            </CardContent>
          </Card>
        }
      />

      <PageSection
        eyebrow="Search & Filter"
        title="Search Colleges with the Right Filters"
      >
        <CollegesFilter />
      </PageSection>

      <PageSection
        eyebrow="Popular Categories"
        title="Popular College Categories"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collegeCategories.map((category) => {
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
        eyebrow="Top Universities"
        title="Popular Universities Students Search For"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {(dynamicUniversities.length > 0 ? dynamicUniversities : topUniversities).map((university: any) => (
            <Card
              key={university.name}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl line-clamp-1">{university.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Location:</span>{" "}
                  {university.location || university.district?.name || university.state?.name || "India"}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Type:
                  </span>{" "}
                  {university.universityType || "General"}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Established:
                  </span>{" "}
                  {university.yearOfEstablishment || "N/A"}
                </p>
                <p className="line-clamp-2">
                  <span className="font-semibold text-foreground">Website:</span>{" "}
                  {university.website || "N/A"}
                </p>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href={`/universities/${university.slug}`} />}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="City Wise Colleges"
        title="Find Colleges by City"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {(dynamicCities.length > 0 ? dynamicCities : cityColleges).map((city: any) => (
            <Card
              key={city.name || city.city}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl">{city.name || city.city}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Colleges:</span>{" "}
                  {city.collegeCount || city.count}
                </p>
                {city.stateName && (
                  <p>
                    <span className="font-semibold text-foreground">State:</span>{" "}
                    {city.stateName}
                  </p>
                )}
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href={`/colleges?cityId=${city.id}`} />}
                >
                  View Colleges
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Compare Colleges"
        title="Compare Colleges"
        description="Students can compare 2 or 3 colleges based on fees, placement, ranking, courses, hostel, scholarship and entrance exams."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {compareItems.map((item) => (
            <Card
              key={item.title}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-cyan-600 dark:bg-blue-500/10 dark:text-cyan-300">
                  <Scale className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4 text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 px-6 pb-6">
                {item.details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {detail}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="College Detail View"
        title="What Each College Page Should Include"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {collegeDetailItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-background px-4 py-4 text-sm font-medium text-foreground shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection eyebrow="FAQs" title="Common College Questions">
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="px-6 py-2 sm:px-8">
            <Accordion type="single" collapsible>
              {faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`college-faq-${index}`}>
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
        title="Find Your Dream College Today"
        description="Search by course, city or exam and discover the best college for your future."
      >
        <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
          <CardContent className="flex flex-col gap-4 px-6 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              StudentPath helps students compare colleges, search by city, and
              discover the right admission route for their academic goals.
            </p>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Start college search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </PageSection>
    </main>
  );
}
