"use client";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export default function AdminExamsPage() {
  return (
    <AdminPanelShell
      title="Manage Entrance Exams"
      description="Create, edit, and delete entrance exam records used across StudentPath pages."
    >
      <AdminResourceManager
        resource="exams"
        title="Entrance Exams"
        layout="flex-col"
        description="Track exam category, level, conducting body, month, and official website."
        fields={[
          {
            name: "name",
            label: "Exam Name",
            placeholder: "JEE Main",
          },
          {
            name: "slug",
            label: "URL Slug",
            placeholder: "jee-main",
            autoSlugFrom: "name",
          },
          {
            name: "description",
            label: "Description",
            placeholder: "Enter full exam description here...",
            type: "textarea",
          },
          {
            name: "category",
            label: "Category",
            placeholder: "Engineering, Medical, MBA",
          },
          {
            name: "level",
            label: "Level",
            placeholder: "After 12th, Graduation",
          },
          {
            name: "conductingBody",
            label: "Conducting Body",
            placeholder: "NTA",
          },
          {
            name: "examMonths",
            label: "Exam Months / Sessions",
            placeholder: "e.g. Session 1: January",
            type: "dynamic-pairs",
          },
          {
            name: "fees",
            label: "Registration Fees",
            placeholder: "e.g. General: 1000",
            type: "dynamic-pairs",
          },
          {
            name: "faqs",
            label: "Frequently Asked Questions",
            placeholder: "Add important questions and answers about this exam",
            type: "dynamic-pairs",
          },
        ]}
      />
    </AdminPanelShell>
  );
}
