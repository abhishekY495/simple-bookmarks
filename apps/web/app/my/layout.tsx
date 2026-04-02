"use client";

import { Header } from "@/components/my/header";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center max-w-4xl mx-auto border-x-2 min-h-screen">
        <Header user={user} />
        {children}
      </div>
    </ProtectedRoute>
  );
}
