// src/hooks/use-auth.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { ROLE_HOME } from "@/lib/roles";
import { type AuthUser, useAuthStore } from "@/store/auth-store";

type AuthSession = { accessToken: string; user: AuthUser };

export type LoginInput = { email: string; password: string };

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  programId: string;
  batch: number;
  phone?: string;
};


function useCompleteAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return (session: AuthSession) => {
    setAuth(session.user, session.accessToken);
    router.replace(ROLE_HOME[session.user.role] ?? "/");
  };
}

export function useLogin() {
  const completeAuth = useCompleteAuth();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await apiClient.post<ApiResponse<AuthSession>>("/auth/login", input);
      return res.data.data;
    },
    onSuccess: (session) => {
      toast.success(`Welcome back, ${session.user.name}`);
      completeAuth(session);
    },
  });
}

export function useRegister() {
  const completeAuth = useCompleteAuth();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const res = await apiClient.post<ApiResponse<AuthSession>>("/auth/register", input);
      return res.data.data;
    },
    onSuccess: (session) => {
      toast.success("Account created. Welcome to CloudVarsity!");
      completeAuth(session);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    
    onSettled: () => {
      clearAuth();
      queryClient.clear(); 
      router.replace("/login");
    },
  });
}