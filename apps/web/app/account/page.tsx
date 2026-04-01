"use client";

import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function Account() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <h1>Account</h1>
    </>
  );
}
