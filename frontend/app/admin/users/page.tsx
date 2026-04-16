"use client";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export default function AdminUsersPage() {
  return (
    <AdminPanelShell
      title="Manage Users"
      description="View all users who signed in with Google and update or delete user records."
    >
      <AdminResourceManager
        resource="users"
        layout="flex-col"
        title="Google Users"
        description="User creation is handled by Google sign-in. Admin can update user data or remove user records here."
        allowCreate={false}
        fields={[
          {
            name: "name",
            label: "Full Name",
            placeholder: "Enter full name",
          },
          {
            name: "email",
            label: "Email Address",
            placeholder: "Enter email address",
          },
          {
            name: "googleId",
            label: "Google ID",
            placeholder: "Enter Google ID",
            hideInCard: true,
          },
          {
            name: "profileImage",
            label: "Profile Image",
            placeholder: "Enter image URL",
            type: "image",
            hideInCard: true,
          },
        ]}
      />
    </AdminPanelShell>
  );
}
