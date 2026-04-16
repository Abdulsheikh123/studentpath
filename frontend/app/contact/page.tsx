"use client";

import PageSection from "@/components/PageSection";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export default function ContactPage() {
  return (
    <main className="min-w-0 pb-16 sm:pb-24">
      <PageSection
        eyebrow="Contact Us"
        title="We’re Here to Help"
        description="Whether you need help finding the right college, understanding the admission process, or choosing the best exam, our team is ready to guide you."
      >
        <div className="grid gap-8 min-w-0 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* 1. Inquiry Form Component */}
          <ContactForm />

          {/* 2. Contact Information Cards */}
          <ContactInfo />
        </div>
      </PageSection>
    </main>
  );
}
