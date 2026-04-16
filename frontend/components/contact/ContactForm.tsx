"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import GoogleAuthButton from "../auth/google-login";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function buildApiUrl(path: string) {
  const normalizedBase = API_BASE.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedBase.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${normalizedBase}${normalizedPath.slice(4)}`;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    classCourse: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/users/me"), {
          credentials: "include",
          cache: "no-store",
        });
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    void checkSession();
  }, []);

  const handleChange =
    (field: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const submitContactRequest = async () => {
    setStatus({ type: "", message: "" });
    setSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/api/contact-requests"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? ((await response.json()) as { message?: string })
        : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (contentType.includes("text/html")
              ? "Contact API route not found. Please check backend route configuration."
              : "Unable to submit form."),
        );
      }

      setStatus({
        type: "success",
        message: data?.message || "Your message was submitted successfully.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        classCourse: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit your message right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (pendingSubmit && isAuthenticated && !submitting) {
      setPendingSubmit(false);
      void submitContactRequest();
    }
  }, [isAuthenticated, pendingSubmit, submitting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (checkingAuth) {
      return;
    }

    if (!isAuthenticated) {
      setLoginError("");
      setPendingSubmit(true);
      setLoginOpen(true);
      return;
    }

    await submitContactRequest();
  };

  return (
    <Card className="rounded-[2.5rem] border border-border/70 bg-background py-0 shadow-sm transition-all hover:shadow-md">
      <CardContent className="px-6 py-8 sm:px-10 sm:py-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Name
              </p>
              <Input
                placeholder="Your Full Name"
                value={form.name}
                onChange={handleChange("name")}
                className="h-12 rounded-2xl border-border/60 bg-muted/20 px-4 focus-visible:bg-background"
                required
              />
            </div>
            <div className="space-y-1">
              <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Email
              </p>
              <Input
                placeholder="support@studentpath.in"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="h-12 rounded-2xl border-border/60 bg-muted/20 px-4 focus-visible:bg-background"
                required
              />
            </div>
            <div className="space-y-1">
              <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Phone Number
              </p>
              <Input
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={handleChange("phone")}
                className="h-12 rounded-2xl border-border/60 bg-muted/20 px-4 focus-visible:bg-background"
              />
            </div>
            <div className="space-y-1">
              <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                City
              </p>
              <Input
                placeholder="Your Current City"
                value={form.city}
                onChange={handleChange("city")}
                className="h-12 rounded-2xl border-border/60 bg-muted/20 px-4 focus-visible:bg-background"
              />
            </div>
            <div className="space-y-1">
              <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Course Interested
              </p>
              <Input
                placeholder="e.g. B.Tech, MBA"
                value={form.classCourse}
                onChange={handleChange("classCourse")}
                className="h-12 rounded-2xl border-border/60 bg-muted/20 px-4 focus-visible:bg-background"
              />
            </div>
            <div className="space-y-1">
              <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Subject
              </p>
              <Input
                placeholder="Inquiry Subject"
                value={form.subject}
                onChange={handleChange("subject")}
                className="h-12 rounded-2xl border-border/60 bg-muted/20 px-4 focus-visible:bg-background"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="pl-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Message
            </p>
            <textarea
              value={form.message}
              onChange={handleChange("message")}
              className="min-h-40 w-full rounded-2xl border border-border/60 bg-muted/20 px-4 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-cyan-500/20"
              placeholder="How can we help you today?"
              required
            />
          </div>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              size="lg"
              className="h-12 rounded-2xl bg-cyan-600 px-8 hover:bg-cyan-500"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Support is online
            </div>
          </div>
          {status.message ? (
            <div
              className={`rounded-2xl border p-5 text-sm font-medium ${
                status.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-600"
              }`}
            >
              {status.message}
            </div>
          ) : null}
        </form>
      </CardContent>
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="rounded-[2rem] border border-border/70 bg-background p-0 sm:max-w-md">
          <DialogHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <DialogTitle className="text-2xl">Login Required</DialogTitle>
            <DialogDescription>
              Please sign in with Google to submit your contact request.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="rounded-3xl border border-border/70 bg-background p-5">
              <GoogleAuthButton
                onLoginSuccess={() => {
                  setIsAuthenticated(true);
                  setLoginError("");
                  setLoginOpen(false);
                }}
                onLoginError={(message) => {
                  setLoginError(message);
                }}
              />
              {loginError ? (
                <p className="mt-3 text-sm text-red-500">{loginError}</p>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
