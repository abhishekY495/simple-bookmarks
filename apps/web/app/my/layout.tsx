"use client";

import { Sidebar } from "@/components/my/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { NAV_ITEMS } from "@/utils/constants";
import { usePathname } from "next/navigation";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const headerTitle = NAV_ITEMS.find((item) => item.href === pathname)?.label;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto flex">
        <Sidebar />
        <div className="w-full border-x">
          <p className="border-b p-3 px-5 sticky top-0 bg-background/90 backdrop-blur-sm z-10 font-semibold">
            {headerTitle}
          </p>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
