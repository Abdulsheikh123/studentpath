"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  GraduationCap,
  Landmark,
  Lock,
  Mail,
  Phone,
  School,
  ShieldCheck,
  User,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";

export default function InstitutionRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [debugOtp, setDebugOtp] = useState<{
    emailOtp?: string;
    mobileOtp?: string;
  } | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    institutionTitle: "",
    institutionType: "",
    password: "",
  });

  const [otpForm, setOtpForm] = useState({
    emailOtp: "",
    mobileOtp: "",
  });

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await adminRequest<{
        success: boolean;
        message: string;
        debug?: { emailOtp?: string; mobileOtp?: string };
      }>("/api/institution-admin/request-otp", {
        method: "POST",
        body: JSON.stringify({ email: form.email, mobile: form.mobile }),
      });

      setDebugOtp(response.debug || null);

      if (response.debug?.emailOtp || response.debug?.mobileOtp) {
        setOtpForm((current) => ({
          emailOtp: response.debug?.emailOtp || current.emailOtp,
          mobileOtp: response.debug?.mobileOtp || current.mobileOtp,
        }));
      }

      setMessage(response.message || "OTP sent");
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleVerifyAndRegister = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const verifyResponse = await adminRequest<{
        success: boolean;
        message: string;
        data: { otpToken: string };
      }>("/api/institution-admin/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          mobile: form.mobile,
          emailOtp: otpForm.emailOtp,
          mobileOtp: otpForm.mobileOtp,
        }),
      });

      await adminRequest("/api/institution-admin/register", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          otpToken: verifyResponse.data.otpToken,
        }),
      });

      router.push("/admin?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_28%),#08111f] px-4 py-12 text-slate-100">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center text-center">
          <BrandLogo inverted />
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">
            Partner with StudentPath
          </h1>
          <p className="mt-3 text-slate-400">
            Create an institution account to manage your admissions and courses.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/50 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {(error || message) && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                error
                  ? "border-red-500/20 bg-red-500/10 text-red-200"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {error || message}
            </div>
          )}

          {step === "details" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Username
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                    <input
                      name="username"
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) =>
                        setForm((c) => ({ ...c, username: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                      placeholder="johndoe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Personal Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((c) => ({ ...c, email: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                      placeholder="name@institution.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Mobile
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                  <input
                    name="mobile"
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, mobile: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Full Institution Name
                </label>
                <div className="relative group">
                  <Landmark className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                  <input
                    name="institutionTitle"
                    type="text"
                    required
                    value={form.institutionTitle}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        institutionTitle: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                    placeholder="e.g. Stanford University"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Institution Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["University", "College", "School"].map((type) => (
                    <label key={type} className="relative cursor-pointer">
                      <input
                        name="institutionType"
                        type="radio"
                        value={type}
                        required
                        checked={form.institutionType === type}
                        onChange={() =>
                          setForm((c) => ({ ...c, institutionType: type }))
                        }
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-4 transition-all peer-checked:border-cyan-500/50 peer-checked:bg-cyan-500/10 hover:bg-white/10">
                        {type === "University" && (
                          <GraduationCap className="h-5 w-5 text-cyan-400" />
                        )}
                        {type === "College" && (
                          <Building2 className="h-5 w-5 text-cyan-400" />
                        )}
                        {type === "School" && (
                          <School className="h-5 w-5 text-cyan-400" />
                        )}
                        <span className="mt-2 text-[10px] font-bold tracking-widest uppercase">
                          {type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Access Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, password: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-[1.25rem] bg-cyan-500 py-6 text-sm font-bold tracking-widest text-slate-950 uppercase hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP (Email + Mobile)"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-slate-300">
                OTP sent to <span className="font-semibold">{form.email}</span>{" "}
                and <span className="font-semibold">{form.mobile}</span>.
                {debugOtp ? (
                  <div className="mt-2 text-[11px] text-slate-400">
                    Dev debug OTPs: Email {debugOtp.emailOtp} / Mobile{" "}
                    {debugOtp.mobileOtp}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Email OTP
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpForm.emailOtp}
                      onChange={(e) =>
                        setOtpForm((c) => ({ ...c, emailOtp: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                      placeholder="6-digit"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Mobile OTP
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpForm.mobileOtp}
                      onChange={(e) =>
                        setOtpForm((c) => ({ ...c, mobileOtp: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition focus:border-cyan-500/50 focus:bg-white/10 focus:outline-hidden focus:ring-4 focus:ring-cyan-500/10"
                      placeholder="6-digit"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleVerifyAndRegister}
                className="w-full rounded-[1.25rem] bg-cyan-500 py-6 text-sm font-bold tracking-widest text-slate-950 uppercase hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP & Register"}
                <ShieldCheck className="ml-2 h-4 w-4 shrink-0" />
              </Button>

              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                  onClick={() => {
                    setStep("details");
                    setError("");
                    setMessage("");
                  }}
                  disabled={loading}
                >
                  Edit Details
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                  onClick={() => void sendOtp()}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            Already a partner?{" "}
            <Link
              href="/admin"
              className="font-bold text-cyan-400 hover:text-cyan-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

