"use client";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export default function AdminCitiesPage() {
  return (
    <AdminPanelShell
      title="Manage Cities"
      description="Add, update, and delete city records that power StudentPath city-wise discovery."
    >
      <AdminResourceManager
        resource="cities"
        title="Cities"
        layout="flex-col"
        description="Maintain city metadata including slug, state, popular exams, and top institutions from the institution page."
        fields={[
          {
            name: "name",
            label: "City Name",
            placeholder: "Enter city name",
          },
          {
            name: "slug",
            label: "URL Slug",
            placeholder: "city-slug",
            autoSlugFrom: "name",
          },
          {
            name: "state",
            label: "State",
            placeholder: "Enter state name",
          },
          {
            name: "popularExams",
            label: "Popular Exams",
            placeholder: "JEE, CUET, NEET",
          },
          {
            name: "topInstitutions",
            label: "Top Institutions",
            placeholder: "College or school names from institution page",
          },
        ]}
      />
    </AdminPanelShell>
  );
}
