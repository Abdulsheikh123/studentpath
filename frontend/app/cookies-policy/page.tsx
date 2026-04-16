import PageHero from "@/components/PageHero";
import PageSection from "@/components/PageSection";

export default function CookiesPolicyPage() {
  return (
    <main className="min-w-0">
      <PageHero
        eyebrow="Legal"
        title="Cookies Policy"
        description="This page explains how cookies and similar technologies may be used on StudentPath."
      />

      <PageSection
        title="Cookie Usage"
        description="Cookies may be used to improve site functionality, remember preferences, and measure traffic patterns."
      >
        <div className="grid gap-5">
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Essential cookies</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Some cookies may be necessary for basic website functions such as theme handling,
              session continuity, or interface stability.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Analytics cookies</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              StudentPath may use analytics cookies to understand page visits, user flow, and
              content performance so the platform can be improved over time.
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Managing cookies</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Users can control or delete cookies through browser settings. Disabling some cookies
              may affect how certain website features perform.
            </p>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
