"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";

import { buildAdminUrl } from "@/lib/admin-api";
import GoogleAuthButton from "./google-login";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type AuthUser = {
  name: string;
  email: string;
  profileImage: string;
};

type NavbarAuthProps = {
  mobile?: boolean;
};

export default function NavbarAuth({ mobile = false }: NavbarAuthProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(buildAdminUrl("/api/users/me"), {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = (await response.json()) as { user: AuthUser };
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void getUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await fetch(buildAdminUrl("/api/users/logout"), {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <Button
        variant="outline"
        className={mobile ? "mt-auto w-full gap-2" : "gap-2"}
        disabled
      >
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div
        className={
          mobile ? "mt-auto flex flex-col gap-3" : "relative flex items-center"
        }
      >
        <div className={mobile ? "w-full" : "group relative"}>
          <Button
            variant="outline"
            className={`rounded-xl border-border/60 gap-2 transition-all hover:border-cyan-300 hover:bg-cyan-400/10  hover:text-cyan-300 dark:hover:text-cyan-300   ${
              mobile ? "w-full" : ""
            }`}
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            <LogOut className="h-4 w-4" />
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>

          {!mobile ? (
            <div className="pointer-events-none absolute top-full right-0 z-50 mt-3 w-64 rounded-3xl border border-border/70 bg-background/95 p-4 text-left opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="flex items-center gap-3">
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Dialog defaultOpen={false} open={loginOpen} onOpenChange={setLoginOpen}>
      <div className={mobile ? "mt-auto w-full" : "relative"}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className={`rounded-xl border-border/60 gap-2 transition-all hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-300 ${
                mobile ? "w-full" : ""
              }`}
            />
          }
        >
          <LogIn className="h-4 w-4" />
          Login
        </DialogTrigger>
      </div>

      <DialogContent className="rounded-[2rem] border border-border/70 bg-background p-0 sm:max-w-md">
        <DialogHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
          <DialogTitle className="text-2xl tracking-tight">
            Access Your Account
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Please sign in with your Google account to access personalized
            academic guidance and saved institutions.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="rounded-3xl border border-border/70 bg-background p-5">
            <GoogleAuthButton
              onLoginSuccess={(nextUser) => {
                setUser(nextUser);
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
            <div className="mt-4 flex justify-end">
              <DialogClose render={<Button variant="ghost" size="sm" />}>
                Close
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
