"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { decodeJwt } from "@/utils/decode-jwt";
import { refreshToken } from "@/services/auth-services";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setIsRestoring = useAuthStore((s) => s.setIsRestoring);

  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await refreshToken();

        if (!data.accessToken) {
          setAuth(null);
          return;
        }

        const accessToken = data.accessToken;
        const decodedAccessToken = decodeJwt(accessToken);
        if (decodedAccessToken) {
          setAuth({
            accessToken,
            id: decodedAccessToken.id,
            fullName: decodedAccessToken.fullName,
            email: decodedAccessToken.email,
          });
        }
      } catch {
        setAuth(null);
      } finally {
        setIsRestoring(false);
      }
    }

    restoreSession();
  }, [setAuth, setIsRestoring]);

  return <>{children}</>;
}
