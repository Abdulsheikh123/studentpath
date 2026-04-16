"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { BookOpen, Building2, CircleHelp, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminRequest, getListData } from "@/lib/admin-api";
import { adminOverviewCards, adminOverviewLists } from "@/lib/admin-nav";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [lists, setLists] = useState<Record<string, Record<string, any>[]>>({});
  const [role, setRole] = useState<'superAdmin' | 'institutionAdmin' | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        let currentRole: 'superAdmin' | 'institutionAdmin' = 'superAdmin';

        // Detect role first
        try {
          await adminRequest("/api/super-admin/me");
          currentRole = 'superAdmin';
        } catch {
          await adminRequest("/api/institution-admin/me");
          currentRole = 'institutionAdmin';
        }

        if (!active) return;
        setRole(currentRole);

        if (currentRole === 'superAdmin') {
          const [cardResponses, listResponses] = await Promise.all([
            Promise.all(
              adminOverviewCards.map((card) =>
                adminRequest<{
                  success: boolean;
                  data?: Record<string, any>[];
                  items?: Record<string, any>[];
                  pagination?: { total: number };
                }>(card.endpoint),
              ),
            ),
            Promise.all(
              adminOverviewLists.map((list) =>
                adminRequest<{
                  success: boolean;
                  data?: Record<string, any>[];
                  items?: Record<string, any>[];
                }>(list.endpoint),
              ),
            ),
          ]);

          if (!active) return;

          setCounts(
            Object.fromEntries(
              adminOverviewCards.map((card, index) => {
                const response = cardResponses[index];
                const total =
                  response.pagination?.total ?? getListData(response).length;
                return [card.label, total];
              }),
            ),
          );

          setLists(
            Object.fromEntries(
              adminOverviewLists.map((list, index) => [
                list.title,
                getListData(listResponses[index]).slice(0, 5),
              ]),
            ),
          );
        } else {
          // Institution Admin Stats
          const statsResponse = await adminRequest<{
            success: boolean;
            data: { courses: number; admissions: number; faqs: number; placements: number };
          }>("/api/institution-admin/stats");

          if (!active) return;
          
          setCounts({
            "Courses": statsResponse.data.courses,
            "Admissions": statsResponse.data.admissions,
            "FAQs": statsResponse.data.faqs,
            "Placements": statsResponse.data.placements
          });
        }
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const institutionCards = [
    { label: "Courses", icon: BookOpen },
    { label: "Admissions", icon: GraduationCap },
    { label: "FAQs", icon: CircleHelp },
    { label: "Placements", icon: Building2 },
  ];

  if (loading) {
    return (
      <AdminPanelShell title="Dashboard" description="Loading your overview...">
        <div className="flex h-64 items-center justify-center text-slate-400">
          Loading metrics...
        </div>
      </AdminPanelShell>
    );
  }

  return (
    <AdminPanelShell
      title={role === 'superAdmin' ? "System Intelligence" : "Institution Dashboard"}
      description={role === 'superAdmin' 
        ? "Real-time analytics across all schools, colleges, and national exam systems."
        : "Overview of your institution's performance and data."
      }
    >
      {error ? (
        <Card className="mb-6 rounded-[2rem] border border-red-500/20 bg-red-500/10 py-0">
          <CardContent className="px-6 py-5 text-sm text-red-100">
            {error}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stats Column */}
        <div className="space-y-6 lg:col-span-2">
          <section className="grid gap-4 sm:grid-cols-2">
            {(role === 'superAdmin' ? adminOverviewCards : institutionCards).map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 py-0 transition-all hover:border-cyan-400/30">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-cyan-400/20 to-transparent transition-all group-hover:via-cyan-400/50" />
                  <CardContent className="px-6 py-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                          {card.label}
                        </p>
                        <p className="mt-4 text-4xl font-semibold tracking-tight text-white">
                          {counts[card.label] ?? 0}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                           <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400/10">↑</span>
                           12% from last month
                        </div>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-cyan-300 shadow-inner group-hover:bg-cyan-400/10 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {role === 'superAdmin' && (
            <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
               <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-xl font-semibold text-white">Distribution Breakdown</CardTitle>
               </CardHeader>
               <CardContent className="px-8 pb-8">
                  <div className="space-y-6">
                     {adminOverviewCards.slice(0, 4).map((card, i) => (
                        <div key={card.label} className="space-y-2">
                           <div className="flex justify-between text-xs font-medium text-slate-300">
                              <span>{card.label}</span>
                              <span className="text-slate-500">{((counts[card.label] || 0) / 10).toFixed(1)}% Weight</span>
                           </div>
                           <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                              <div 
                                 className="h-full bg-linear-to-r from-cyan-600 to-sky-400 transition-all duration-1000" 
                                 style={{ width: `${Math.min(100, (counts[card.label] || 0) / 2)}%`, transitionDelay: `${i * 100}ms` }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Activity Column */}
        <div className="space-y-6">
           {role === 'superAdmin' && adminOverviewLists.map((list) => {
              const Icon = list.icon;
              const entries = lists[list.title] || [];
              return (
                <Card key={list.title} className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
                  <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-white">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-cyan-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      {list.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <div className="space-y-2.5">
                      {entries.length === 0 ? (
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 text-xs text-slate-500">
                          Empty queue.
                        </div>
                      ) : (
                        entries.map((item) => (
                          <div
                            key={`${list.title}-${item.id}`}
                            className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs transition-all hover:border-white/10 hover:bg-white/[0.04]"
                          >
                            <span className="font-medium text-slate-200">{list.render(item)}</span>
                            <span className="mt-1 text-[10px] text-slate-500">Active Record</span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
           })}

           {role === 'institutionAdmin' && (
             <div className="flex flex-col items-center rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-8 text-center sm:p-12">
                <Building2 className="h-12 w-12 text-cyan-300 opacity-50" />
                <h3 className="mt-4 font-semibold text-white">Managed View</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Your view is currently scoped to your institution. Global search and system-wide modifications are restricted.
                </p>
             </div>
           )}
        </div>
      </div>
    </AdminPanelShell>
  );
}
