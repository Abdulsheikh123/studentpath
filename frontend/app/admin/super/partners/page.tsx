"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldAlert, UserCheck, Mail, Building2, Search, Filter, Ban, CheckCircle2 } from "lucide-react";
import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";

type Partner = {
  id: number;
  username: string;
  email: string;
  institutionTitle: string;
  institutionType: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function PartnerManagementPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadPartners = async () => {
    try {
      const response = await adminRequest<{ success: boolean; data: Partner[] }>(
        "/api/super-admin/partners"
      );
      setPartners(response.data);
    } catch (err) {
      setError("Unable to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const toggleStatus = async (id: number, field: 'isApproved' | 'isActive', value: boolean) => {
    try {
      await adminRequest(`/api/super-admin/partners/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ [field]: value })
      });
      setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredPartners = partners.filter(p => 
    p.institutionTitle.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminPanelShell
      title="Partner Ecosystem"
      description="Manage all connected institutions and control their platform access."
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
          <input
            type="text"
            placeholder="Search institutions or emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-3 pl-11 pr-4 text-sm text-white focus:border-cyan-500/50 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
          />
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl border-white/5 bg-slate-950/50 text-slate-400">
                <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading ecosystem...</div>
      ) : filteredPartners.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No partners found matching your search.</div>
      ) : (
        <div className="grid gap-4">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-950/40 py-0 transition-all hover:border-white/10 hover:bg-slate-950/60">
                <CardContent className="flex flex-col items-center justify-between gap-6 px-8 py-6 sm:flex-row">
                    <div className="flex items-center gap-5">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${partner.isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {partner.isApproved ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{partner.institutionTitle}</h3>
                            <div className="mt-1 flex gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {partner.email}</span>
                                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] uppercase font-bold tracking-widest">{partner.institutionType}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Status</p>
                            <p className={`mt-1 text-xs font-bold ${partner.isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {partner.isApproved ? 'Approved' : 'Pending Approval'}
                            </p>
                        </div>
                        
                        <div className="h-8 w-px bg-white/5 hidden sm:block" />

                        <div className="flex gap-2">
                            {partner.isApproved ? (
                                <Button 
                                    onClick={() => toggleStatus(partner.id, 'isApproved', false)}
                                    variant="outline"
                                    className="h-10 rounded-xl border-white/5 bg-white/5 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400"
                                >
                                    <Ban className="mr-2 h-4 w-4" /> Revoke
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => toggleStatus(partner.id, 'isApproved', true)}
                                    className="h-10 rounded-xl bg-emerald-500 px-6 font-bold text-slate-950 hover:bg-emerald-400"
                                >
                                    Approve
                                </Button>
                            )}

                            <Button 
                                variant="outline"
                                onClick={() => toggleStatus(partner.id, 'isActive', !partner.isActive)}
                                className={`h-10 rounded-xl border-white/5 bg-white/5 font-bold ${partner.isActive ? 'text-slate-400 hover:text-red-400' : 'text-emerald-400'}`}
                            >
                                {partner.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminPanelShell>
  );
}
