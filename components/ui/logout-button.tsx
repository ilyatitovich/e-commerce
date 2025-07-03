"use client";

import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      useUserStore.persist.clearStorage();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
