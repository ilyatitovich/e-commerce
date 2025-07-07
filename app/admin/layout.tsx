import type { ReactNode } from "react";
import Sidebar from "@/widgets/sidebar/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-white p-4">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
