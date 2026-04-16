import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This page explains how StudentPath may collect, use, and protect visitor information across the platform."
      />

      <PageSection
        title="Privacy Overview"
        description="StudentPath is committed to handling basic user information responsibly."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Information collected</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              StudentPath may collect limited information such as page usage, contact details
              submitted through forms, and basic analytics needed to improve the platform.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">How information is used</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Data may be used to respond to enquiries, improve content, maintain site
              performance, and provide better school, college, and exam guidance.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Data protection</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Reasonable measures are used to protect stored information, but no internet-based
              system can guarantee complete security.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Third-party services</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              StudentPath may rely on third-party tools for analytics, hosting, or contact
              handling. Their own privacy practices may also apply.
            </p>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
