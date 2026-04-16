"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldAlert, UserCheck, Mail, Building2 } from "lucide-react";
import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";

type PendingAdmin = {
  id: number;
  username: string;
  email: string;
  institutionTitle: string;
  institutionType: string;
  isApproved: boolean;
};

export default function PartnerApprovalPage() {
  const [pending, setPending] = useState<PendingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPending = async () => {
    try {
      const response = await adminRequest<{ success: boolean; data: PendingAdmin[] }>(
        "/api/super-admin/pending-partners"
      );
      setPending(response.data);
    } catch (err) {
      setError("Unable to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApproval = async (id: number, approve: boolean) => {
    try {
      const endpoint = approve 
        ? `/api/super-admin/approve-partner/${id}` 
        : `/api/super-admin/reject-partner/${id}`;
      
      await adminRequest(endpoint, {
        method: approve ? "PUT" : "DELETE"
      });
      setPending(prev => prev.filter(admin => admin.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed. Please ensure you are logged in as Super Admin.");
    }
  };

  return (
    <AdminPanelShell
      title="Partner Approvals"
      description="Review and authorize new institution partners seeking access to the platform."
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-500">
          Checking for pending requests...
        </div>
      ) : pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-slate-950/50 p-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-600">
                <UserCheck className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">All caught up!</h3>
            <p className="mt-2 max-w-sm text-slate-500 text-sm">
                There are currently no pending registration requests from institution partners.
            </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pending.map((admin) => (
            <Card key={admin.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
               <CardContent className="flex flex-col items-center justify-between gap-6 px-8 py-8 sm:flex-row">
                  <div className="flex items-center gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">{admin.institutionTitle}</h4>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {admin.email}
                            </span>
                            <span className="flex items-center gap-1.5 decoration-emerald-500/50 underline">
                                <ShieldAlert className="h-3.5 w-3.5" />
                                {admin.institutionType} Request
                            </span>
                        </div>
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 gap-3 sm:w-auto">
                    <Button 
                        onClick={() => handleApproval(admin.id, true)}
                        className="flex-1 rounded-2xl bg-emerald-500 px-6 font-bold tracking-widest text-slate-950 uppercase hover:bg-emerald-400 sm:flex-none"
                    >
                        <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button 
                        onClick={() => handleApproval(admin.id, false)}
                        variant="outline"
                        className="flex-1 rounded-2xl border-white/10 bg-transparent font-bold tracking-widest text-slate-400 uppercase hover:bg-red-500/10 hover:text-red-400 sm:flex-none"
                    >
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminPanelShell>
  );
}
