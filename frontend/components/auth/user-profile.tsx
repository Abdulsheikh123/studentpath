"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { buildAdminUrl } from "@/lib/admin-api";

type AuthUser = {
  name: string;
  profileImage: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(buildAdminUrl("/api/users/me"), {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { user: AuthUser };
        setUser(data.user);
      } catch {}
    };

    void getUser();
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user.profileImage}
        alt={user.name}
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />
      <span>{user.name}</span>
    </div>
  );
}
