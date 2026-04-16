"use client";

import { useEffect, useState } from "react";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminRequest } from "@/lib/admin-api";

type SuperAdminProfile = {
  id: number;
  email: string;
  createdAt?: string | null;
};

type InstitutionAdminProfile = {
  id: number;
  username: string;
  email: string;
  mobile?: string | null;
  institutionTitle?: string;
  institutionType?: string;
  isActive?: boolean;
  createdAt?: string | null;
};

type AdminRole = "superAdmin" | "institutionAdmin";

export default function AdminProfileManager() {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [profile, setProfile] = useState<
    SuperAdminProfile | InstitutionAdminProfile | null
  >(null);
  const [institutionForm, setInstitutionForm] = useState({
    username: "",
    mobile: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        try {
          const response = await adminRequest<{
            success: boolean;
            data: SuperAdminProfile;
          }>("/api/super-admin/me");

          if (!active) return;
          setRole("superAdmin");
          setProfile(response.data);
          return;
        } catch {
          const response = await adminRequest<{
            success: boolean;
            data: InstitutionAdminProfile;
          }>("/api/institution-admin/me");

          if (!active) return;
          setRole("institutionAdmin");
          setProfile(response.data);
          setInstitutionForm({
            username: response.data.username || "",
            mobile: response.data.mobile || "",
          });
        }
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load profile",
        );
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role !== "institutionAdmin") return;
    setSavingProfile(true);
    setError("");
    setMessage("");

    try {
      const response = await adminRequest<{
        success: boolean;
        data: InstitutionAdminProfile;
        message: string;
      }>("/api/institution-admin/profile", {
        method: "PUT",
        body: JSON.stringify({
          username: institutionForm.username,
          mobile: institutionForm.mobile || null,
        }),
      });

      setProfile(response.data);
      setMessage(response.message || "Profile updated");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingPassword(true);
    setError("");
    setMessage("");

    try {
      if (!role) throw new Error("Unable to detect admin role");
      const endpoint =
        role === "superAdmin"
          ? "/api/super-admin/change-password"
          : "/api/institution-admin/change-password";

      const response = await adminRequest<{
        success: boolean;
        message: string;
      }>(endpoint, {
        method: "PUT",
        body: JSON.stringify(passwordForm),
      });

      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage(response.message || "Password changed");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminPanelShell
      title="Admin Profile"
      description="Update the admin identity and password used to access the StudentPath control panel."
    >
      {(error || message) && (
        <Card
          className={`rounded-[2rem] border py-0 ${
            error
              ? "border-red-500/20 bg-red-500/10"
              : "border-emerald-500/20 bg-emerald-500/10"
          }`}
        >
          <CardContent
            className={`px-6 py-5 text-sm ${
              error ? "text-red-100" : "text-emerald-100"
            }`}
          >
            {error || message}
          </CardContent>
        </Card>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-white">Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            {role === "institutionAdmin" ? (
              <form onSubmit={handleProfileSave} className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Username
                  </label>
                  <Input
                    value={institutionForm.username}
                    onChange={(event) =>
                      setInstitutionForm((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Mobile
                  </label>
                  <Input
                    value={institutionForm.mobile}
                    onChange={(event) =>
                      setInstitutionForm((current) => ({
                        ...current,
                        mobile: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 rounded-2xl"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Update Profile"}
                </Button>
              </form>
            ) : (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <Input
                    value={profile?.email || ""}
                    readOnly
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 opacity-80"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Super admin profile fields are managed from the database.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-white">Password</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <form onSubmit={handlePasswordSave} className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        newPassword: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-2xl" disabled={savingPassword}>
                  {savingPassword ? "Saving..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <CardTitle className="text-white">Account Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 text-sm text-slate-300 sm:px-8 sm:pb-8">
              <div>Role: {role || "-"}</div>
              {"isActive" in (profile || {}) ? (
                <div>
                  Status:{" "}
                  {(profile as InstitutionAdminProfile | null)?.isActive === false
                    ? "Inactive"
                    : "Active"}
                </div>
              ) : null}
              {"institutionTitle" in (profile || {}) ? (
                <div>
                  Institution:{" "}
                  {(profile as InstitutionAdminProfile | null)?.institutionTitle ||
                    "-"}
                </div>
              ) : null}
              {"institutionType" in (profile || {}) ? (
                <div>
                  Institution Type:{" "}
                  {(profile as InstitutionAdminProfile | null)?.institutionType ||
                    "-"}
                </div>
              ) : null}
              <div>
                Created:{" "}
                {(profile as any)?.createdAt
                  ? new Date((profile as any).createdAt).toLocaleDateString()
                  : "-"}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AdminPanelShell>
  );
}
