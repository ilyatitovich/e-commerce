"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import NavLink from "./nav-link";

type Props = {
  label: string;
  items: { label: string; href: string }[];
};

export function CollapsibleItem({ label, items }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div
        className="flex items-center justify-between cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium">{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      <Collapsible.Content className="ml-4 mt-1 space-y-1">
        {items.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
