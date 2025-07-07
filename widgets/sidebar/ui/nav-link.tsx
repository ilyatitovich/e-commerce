"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "block rounded px-2 py-1 text-sm hover:bg-gray-100 transition-colors",
        isActive && "bg-gray-100 font-semibold text-blue-600"
      )}
    >
      {children}
    </Link>
  );
}
