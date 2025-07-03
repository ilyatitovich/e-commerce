"use client";

import Link from "next/link";
import { useUserStore } from "@/stores/user";

type UserNavLinkProps = {
  className?: string;
};

export default function UserNavLink({ className }: UserNavLinkProps) {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return (
      <Link href="/auth/login" className={className}>
        Login
      </Link>
    );
  }

  return (
    <Link href="/profile" className={className}>
      Profile
    </Link>
  );
}
