"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, Building2, User } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";
import { getPartnerDashboardPath } from "@/lib/admin-paths";

export default function AdminLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"super" | "partner">("super");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        // Try super admin first
        try {
          await adminRequest("/api/super-admin/me");
          if (active) router.replace("/admin/super/dashboard");
        } catch {
          // If super admin fails, try institution admin
          const response = await adminRequest<{
            success: boolean;
            data: { institutionType?: string | null };
          }>("/api/institution-admin/me");
          if (active) {
            router.replace(getPartnerDashboardPath(response.data.institutionType));
          }
        }
      } catch {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    void verifySession();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = role === "super" 
        ? "/api/super-admin/login" 
        : "/api/institution-admin/login";
      
      const response = await adminRequest<
        | { success: boolean; data?: { institutionType?: string | null } }
        | { success: boolean }
      >(endpoint, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (role === "super") {
        router.push("/admin/super/dashboard");
      } else {
        router.push(
          getPartnerDashboardPath(
            "data" in response ? response.data?.institutionType : null,
          ),
        );
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08111f] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Restoring session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_28%),#08111f] px-4 text-slate-100">
      <div className="w-full max-w-sm space-y-10">
        <div className="flex flex-col items-center text-center">
          <BrandLogo inverted />
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-white">
            Admin Intelligence Access
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage the StudentPath ecosystem.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/50 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          {/* Role Switcher */}
          <div className="mb-8 flex rounded-2xl bg-white/5 p-1">
            <button
              onClick={() => setRole("super")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold tracking-widest uppercase transition-all ${
                role === "super"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Owner
            </button>
            <button
              onClick={() => setRole("partner")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold tracking-widest uppercase transition-all ${
                role === "partner"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Partner
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Email Address
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                  placeholder="admin@studentpath.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Access Token
              </label>
              <div className="relative group">
                <LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-[1.25rem] bg-cyan-500 py-7 text-sm font-bold tracking-[0.2em] text-slate-950 uppercase hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
              disabled={loading}
            >
              {loading ? "Authorizing..." : "Initialize Session"}
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </form>

          {role === "partner" && (
             <p className="mt-8 text-center text-[11px] text-slate-500">
             Want to register an institution?{" "}
             <Link href="/admin/register" className="font-bold text-cyan-400 hover:text-cyan-300">
               Join the Network
             </Link>
           </p>
          )}
        </div>

        <div className="flex justify-center gap-8 text-xs font-semibold tracking-widest text-slate-600 uppercase">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Platform Home</Link>
          <span className="text-white/5 opacity-0">|</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Protocol</Link>
        </div>
      </div>
    </main>
  );
}
