import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact StudentPath - Expert Education & Career Guidance",
  description:
    "Get in touch with StudentPath for expert guidance on schools, colleges, admissions, and entrance exams. We're here to help you choose your next step.",
  keywords: [
    "Contact StudentPath",
    "Education Guidance",
    "College Admissions Help",
    "Career Counselling",
    "Entrance Exam Support",
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
