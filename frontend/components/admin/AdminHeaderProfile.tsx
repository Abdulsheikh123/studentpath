"use client";

import { ShieldCheck, Sparkles, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface AdminProfileProps {
  session: {
    email: string;
    role: string;
    name?: string;
    profileImage?: string;
    googleId?: string;
  } | null;
}

export default function AdminHeaderProfile({ session }: AdminProfileProps) {
  if (!session) return null;

  return (
    <div className="flex shrink-0 transform items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-2 transition-all hover:bg-muted/30 sm:gap-4 sm:p-2.5">
      {/* 1. Profile Image / Shield Icon */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm sm:h-11 sm:w-11">
        {session.profileImage ? (
          <Image
            src={session.profileImage}
            alt={session.name || "Admin"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        )}
      </div>

      {/* 2. Admin Details */}
      <div className="flex min-w-0 flex-col pr-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-foreground">
            {session.name || "System Admin"}
          </p>
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Sparkles className="h-2 w-2" />
            ACTIVE
          </div>
        </div>
        
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 whitespace-nowrap">
          <p className="max-w-[120px] truncate text-[10px] font-medium text-muted-foreground/80 sm:max-w-none">
            {session.email}
          </p>
          {session.googleId && (
            <>
              <div className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <p className="text-[9px] font-mono font-medium text-cyan-600/70 dark:text-cyan-400/70">
                ID: {session.googleId.slice(-8)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
