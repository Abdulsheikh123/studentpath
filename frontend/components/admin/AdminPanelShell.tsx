"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";
import { getFilteredNavGroups, adminQuickLinks } from "@/lib/admin-nav";
import { getPartnerDashboardPath } from "@/lib/admin-paths";

type AdminProfile = {
  id: number;
  name?: string;
  email: string;
  role: "superAdmin" | "institutionAdmin";
  isActive?: boolean;
  username?: string;
  institutionType?: string;
  institutionTitle?: string;
  createdAt?: string | null;
  lastLogin?: string | null;
};

function AdminPanelShellContent({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        let response;
        let role: 'superAdmin' | 'institutionAdmin' = 'superAdmin';

        try {
          response = await adminRequest<{
            success: boolean;
            data: AdminProfile;
          }>("/api/super-admin/me");
          role = 'superAdmin';
        } catch {
          // Fallback to institution admin if super admin fails
          response = await adminRequest<{
            success: boolean;
            data: AdminProfile;
          }>("/api/institution-admin/me");
          role = 'institutionAdmin';
        }

        if (!active) return;
        setProfile({
          ...response.data,
          role: role // Override role or use from response
        });

        // PATH SECURITY: Ensure user is on the correct path for their role
        const prefix = role === 'superAdmin' ? '/admin/super' : '/admin/partner';
        if (!pathname.startsWith(prefix)) {
            router.replace(`${prefix}/dashboard`);
        }

        setReady(true);
      } catch {
        if (!active) return;
        router.replace("/admin");
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!ready || !profile?.role) return;

    let active = true;

    const verify = async () => {
      try {
        if (profile.role === "superAdmin") {
          await adminRequest("/api/super-admin/me");
        } else {
          await adminRequest("/api/institution-admin/me");
        }
      } catch {
        if (!active) return;
        router.replace("/admin?session=revoked");
      }
    };

    const interval = setInterval(() => {
      void verify();
    }, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [profile?.role, ready, router]);

  const handleLogout = async () => {
    try {
      const endpoint = profile?.role === 'superAdmin'
        ? "/api/super-admin/logout"
        : "/api/institution-admin/logout";
      await adminRequest(endpoint, { method: "POST" });
    } finally {
      router.replace("/admin");
    }
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_28%),#08111f] px-4 py-10 text-slate-100">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur">
          Loading admin panel...
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_28%),#08111f] px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid h-full max-w-7xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="border-b border-white/10 pb-5">
            <BrandLogo
              href={
                profile?.role === "superAdmin"
                  ? "/admin/super/dashboard"
                  : getPartnerDashboardPath(profile?.institutionType)
              }
              inverted
            />
            <p className="mt-4 text-sm leading-6 text-slate-400">
              StudentPath administration for locations, institutions, exams,
              FAQs, users, and support data.
            </p>
          </div>

          <div className="admin-scroll mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <nav className="space-y-5">
              {getFilteredNavGroups(profile?.role || null, profile?.institutionType).map((group) => {
                const Icon = group.icon;

                return (
                  <div key={group.label} className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
                      <Icon className="h-3.5 w-3.5" />
                      {group.label}
                    </div>
                    <div className="space-y-1.5">
                      {group.items.map((item) => {
                        const [hrefPath, hrefQuery] = item.href.split("?");
                        const active =
                          pathname === hrefPath &&
                          (!hrefQuery ||
                            hrefQuery
                              .split("&")
                              .every((entry) => {
                                const [key, value] = entry.split("=");
                                return searchParams.get(key) === value;
                              }));

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center rounded-2xl border px-4 py-3 text-sm transition ${
                              active
                                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                                : "border-transparent bg-white/3 text-slate-300 hover:border-white/10 hover:bg-white/6"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
               {profile?.role === 'superAdmin' ? 'Super Admin' : 'Institution Admin'}
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {profile?.name || profile?.username || "Khalid"}
              </p>
              <p className="mt-1 text-sm text-slate-400">{profile?.email}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                  render={
                    <Link
                      href={
                        profile?.role === "superAdmin"
                          ? "/admin/super/admin/profile"
                          : "/admin/partner/admin/profile"
                      }
                    />
                  }
                >
                  Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <section className="admin-scroll min-w-0 h-full space-y-6 overflow-y-auto pr-1">
          <header className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-[0.24em] text-cyan-300 uppercase">
                  StudentPath Admin Panel
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                  {description}
                </p>
              </div>
              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}

export default function AdminPanelShell(props: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_28%),#08111f] px-4 py-10 text-slate-100">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur">
            Loading admin shell...
          </div>
        </main>
      }
    >
      <AdminPanelShellContent {...props} />
    </Suspense>
  );
}
