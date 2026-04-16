import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";

export default function DisclaimerPage() {
  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="This disclaimer explains the limits of StudentPath guidance content and user responsibility for independent verification."
      />

      <PageSection
        title="Important Disclaimer"
        description="StudentPath provides informational guidance and should not be treated as final legal, institutional, or official admission authority."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Educational information only</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Content on StudentPath is intended to help students and parents explore options. It
              is not a substitute for official notices, counselling bodies, or institutional
              confirmation.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Verify before acting</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Users should confirm admissions, entrance exams, fees, eligibility, scholarships,
              and deadlines directly from official websites before making decisions.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">External links</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              StudentPath may link to third-party or official websites. It does not control or
              guarantee the content, policies, or availability of those external resources.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">No guarantee of outcomes</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Using StudentPath does not guarantee admission, exam results, scholarship approval,
              or any educational outcome.
            </p>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
