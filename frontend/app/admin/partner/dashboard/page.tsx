"use client";

import AdminDashboard from "@/components/admin/AdminDashboard";
import { adminRequest } from "@/lib/admin-api";
import { getPartnerDashboardPath } from "@/lib/admin-paths";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PartnerAdminDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const redirectIfNeeded = async () => {
      try {
        const response = await adminRequest<{
          success: boolean;
          data: { institutionType?: string | null };
        }>("/api/institution-admin/me");

        const next = getPartnerDashboardPath(response.data.institutionType);

        if (!active) return;

        if (next !== "/admin/partner/dashboard") {
          router.replace(next);
          return;
        }

        setReady(true);
      } catch {
        if (active) router.replace("/admin");
      }
    };

    void redirectIfNeeded();

    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08111f] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Opening dashboard…</p>
        </div>
      </main>
    );
  }

  return <AdminDashboard />;
}
