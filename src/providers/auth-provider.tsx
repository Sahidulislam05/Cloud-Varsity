"use client";

import { useEffect } from "react";
import { apiClient, type ApiResponse } from "@/lib/api-client";
import { useAuthStore, type AuthUser } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const finishHydrating = useAuthStore((s) => s.finishHydrating);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const refreshRes = await apiClient.post<
          ApiResponse<{ accessToken: string }>
        >("/auth/refresh-token");
        useAuthStore
          .getState()
          .setAccessToken(refreshRes.data.data.accessToken);

        const meRes = await apiClient.get<ApiResponse<AuthUser>>("/user/me");
        setAuth(meRes.data.data, refreshRes.data.data.accessToken);
      } catch {
        clearAuth();
      } finally {
        finishHydrating();
      }
    };

    hydrate();
  }, [setAuth, clearAuth, finishHydrating]);

  return <>{children}</>;
}
