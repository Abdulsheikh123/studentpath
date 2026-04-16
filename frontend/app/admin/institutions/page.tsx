"use client";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export default function AdminInstitutionsPage() {
  return (
    <AdminPanelShell
      title="Manage Schools & Colleges"
      description="Add, edit, and delete school or college records from one admin section."
    >
      <AdminResourceManager
        resource="institutions"
        title="Schools & Colleges"
        layout="flex-col"
        description="Manage institution type, location, course list, and official website."
        fields={[
          {
            name: "name",
            label: "Institution Name",
            placeholder: "Delhi University",
          },
          {
            name: "slug",
            label: "URL Slug",
            placeholder: "delhi-university",
            autoSlugFrom: "name",
          },
          {
            name: "type",
            label: "Type",
            placeholder: "Select type",
            type: "select",
            options: [
              { label: "School", value: "school" },
              { label: "College", value: "college" },
            ],
          },
          {
            name: "category",
            label: "College Category",
            placeholder: "Select category (Optional)",
            type: "select",
            fetchResource: "categories",
          },
          {
            name: "ownership",
            label: "Ownership",
            placeholder: "Select ownership",
            type: "select",
            options: [
              { label: "Private", value: "private" },
              { label: "Government", value: "govt" },
              { label: "Semi-Government", value: "semi govt" },
            ],
          },
          {
            name: "city",
            label: "City",
            placeholder: "Select city",
            type: "select",
            fetchResource: "cities",
          },
          {
            name: "state",
            label: "State",
            placeholder: "Auto-filled by selected city",
          },
          {
            name: "commonExams",
            label: "Common Exams (Accepted)",
            placeholder: "e.g. CUET PG, JNUEE, CAT",
          },
          {
            name: "courses",
            label: "Available Courses",
            placeholder: "Add course entries like MAC, BCA, MBA",
            type: "dynamic-pairs",
          },
          {
            name: "importantDates",
            label: "Important Dates",
            placeholder: "e.g. Admission Starts: 1st July",
            type: "dynamic-pairs",
          },
          {
            name: "fees",
            label: "Fee Structure",
            placeholder: "e.g. Admission Fee: 5000",
            type: "dynamic-pairs",
          },
          {
            name: "website",
            label: "Official Website",
            placeholder: "https://...",
          },
          {
            name: "placement",
            label: "Placement",
            placeholder: "e.g. Average package, top recruiters, placement stats",
            type: "textarea",
          },
          {
            name: "description",
            label: "Description",
            placeholder: "Short institution overview",
            type: "textarea",
          },
          {
            name: "content",
            label: "Content",
            placeholder: "Add important institution content here",
            type: "textarea",
          },
          {
            name: "faqs",
            label: "Frequently Asked Questions",
            placeholder:
              "Add important questions and answers about this institution",
            type: "dynamic-pairs",
          },
          {
            name: "logo",
            label: "Institution Logo",
            placeholder: "Drag and drop or click to upload institution logo",
            type: "image",
          },
          {
            name: "image",
            label: "Institution Image",
            placeholder: "Drag and drop or click to upload institution image",
            type: "image",
          },
        ]}
      />
    </AdminPanelShell>
  );
}
