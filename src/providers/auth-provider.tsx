"use client";

import { useEffect } from "react";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { type Role, useAuthStore } from "@/store/auth-store";

type MeResponse = { id: string; name: string; email: string; role: Role };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { setAuth, clearAuth, finishHydrating } = useAuthStore.getState();

    const hydrate = async () => {
      // The refresh-token cookie is httpOnly, so it is never readable here.
      // We simply ask the backend: the cookie is the source of truth, and a
      // failure means there is no session. The verified role from /user/me
      // also refreshes the client-side cv_role UX cookie via setAuth.
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
