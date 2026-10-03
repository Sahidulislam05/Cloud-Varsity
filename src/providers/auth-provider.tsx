"use client";

import { useEffect } from "react";
import { apiClient, type ApiResponse } from "@/lib/api-client";
import { type Role, useAuthStore } from "@/store/auth-store";

type MeResponse = { id: string; name: string; email: string; role: Role };

const hasSessionHint = () =>
  document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("session-role="));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { setAuth, clearAuth, finishHydrating } = useAuthStore.getState();

    const hydrate = async () => {
      if (!hasSessionHint()) {
        finishHydrating();
        return;
      }

      try {
        const refreshRes = await apiClient.post<
          ApiResponse<{ accessToken: string }>
        >("/auth/refresh-token");
        const accessToken = refreshRes.data.data.accessToken;

        useAuthStore.getState().setAccessToken(accessToken);
        const meRes = await apiClient.get<ApiResponse<MeResponse>>("/user/me");
        const me = meRes.data.data;

        setAuth(
          { userId: me.id, name: me.name, email: me.email, role: me.role },
          accessToken,
        );
      } catch {
        if (!useAuthStore.getState().isAuthenticated) clearAuth();
      } finally {
        finishHydrating();
      }
    };

    hydrate();
  }, []);

  return <>{children}</>;
}
