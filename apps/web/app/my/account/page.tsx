"use client";

import { AccountDetails } from "@/components/my/account/account-details";
import { AccountOptions } from "@/components/my/account/account-options";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col gap-10 p-10">
      {/*  */}
      <div className="flex flex-col gap-2">
        <div className="border rounded p-5 px-8">
          <AccountDetails user={user} />
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-2">
        <div className="border rounded p-5 px-8">
          <AccountOptions user={user} />
        </div>
      </div>
    </div>
  );
}
