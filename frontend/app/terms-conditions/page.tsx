import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";

export default function TermsConditionsPage() {
  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="These terms explain how StudentPath content, tools, and guidance pages may be used by students, parents, and visitors."
      />

      <PageSection
        title="Website Use"
        description="StudentPath provides educational guidance content about schools, colleges, admissions, exams, scholarships, and related topics."
      >
        <div className="grid gap-5">
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Acceptable use</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              By using this website, you agree to use StudentPath only for lawful purposes and
              educational research. You must not misuse the website, interfere with its services,
              or attempt unauthorized access.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Information and updates</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Admission dates, eligibility, fees, exam details, and institutional information may
              change over time. Users should verify critical details through official sources
              before taking action.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Intellectual property</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Website branding, layout, content structure, and original assets on StudentPath are
              protected and may not be copied or republished without permission.
            </p>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
