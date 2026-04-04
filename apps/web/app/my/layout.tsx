"use client";

import { Header } from "@/components/my/header";
import { ProtectedRoute } from "@/components/protected-route";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center max-w-4xl mx-auto min-h-screen lg:p-2 lg:pt-0 px-0 pt-0">
        <Header />
        {children}
      </div>
    </ProtectedRoute>
  );
}
