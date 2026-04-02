"use client";

import { AccountDetails } from "@/components/my/account-details";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col gap-8 p-10 py-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Account Details</h2>
        <div className="border rounded p-5 px-8">
          <AccountDetails user={user} />
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}
