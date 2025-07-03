"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user";

export default function UserLoader() {
  const [loading, setLoading] = useState(true);
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          setUser(user);
        }
      } catch (err) {
        setUser(null);
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [setUser]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return null;
}
