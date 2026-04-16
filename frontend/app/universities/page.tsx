import Link from "next/link";
import { fetchDistricts, fetchStates, fetchUniversities } from "@/lib/api-public";
import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, GraduationCap } from "lucide-react";

export default async function UniversitiesPage() {
  const universitiesRes = await fetchUniversities();
  const universities = universitiesRes.data || [];

  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Universities"
        title="Explore Top Universities in India"
        description="Find detailed information about central, state, and private universities. Compare academic programs, facilities, and more."
        actions={
          <Button
            size="lg"
            className="gap-2"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            Get guidance
            <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />

      <PageSection
        eyebrow="All Universities"
        title="Universities Directory"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {universities.map((university: any) => (
            <Card
              key={university.id}
              className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="px-6 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4 text-xl line-clamp-1">{university.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Location:</span>{" "}
                  {university.district?.name ? `${university.district.name}, ` : ""}{university.state?.name || "India"}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Type:</span>{" "}
                  {university.universityType}
                </p>
                <p className="line-clamp-3 italic">
                   {university.description ? university.description.substring(0, 100) + "..." : "No description available."}
                </p>
                <Button
                  className="w-full mt-2"
                  nativeButton={false}
                  render={<Link href={`/universities/${university.slug}`} />}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
          {universities.length === 0 && (
            <p className="col-span-full py-20 text-center text-muted-foreground">
              No universities found in the database.
            </p>
          )}
        </div>
      </PageSection>
    </main>
  );
}
