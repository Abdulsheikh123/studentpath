"use client";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export default function AdminCategoriesPage() {
  return (
    <AdminPanelShell
      title="Manage College Categories"
      description="Create, edit, and delete the different categories or types of colleges (e.g. Engineering, Medical, etc.)."
    >
      <AdminResourceManager
        resource="categories"
        title="College Categories"
        layout="flex-col"
        description="Add and manage the full list of college disciplines and fields of study."
        fields={[
          {
            name: "name",
            label: "Category Name",
            placeholder: "e.g. Engineering",
          },
          {
            name: "slug",
            label: "URL Slug",
            placeholder: "engineering",
            autoSlugFrom: "name",
          },
        ]}
      />
    </AdminPanelShell>
  );
}
