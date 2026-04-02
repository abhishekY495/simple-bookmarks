"use client";

import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function MyPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <div className="mt-3 px-1"></div>
    </div>
  );
}
