"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isRestoring = useAuthStore((s) => s.isRestoring);

  useEffect(() => {
    if (!isRestoring && !user) {
      router.replace("/login");
    }
  }, [isRestoring, user, router]);

  if (isRestoring) {
    return (
      <div className="text-muted-foreground flex justify-center mt-20">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
