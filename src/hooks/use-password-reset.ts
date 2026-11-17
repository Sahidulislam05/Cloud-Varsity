// src/hooks/use-password-reset.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";

// Backend contract lives here only, so a payload-shape change never
// touches the forms (verified against backend auth.interface.ts):
//   POST /auth/forgot-password { email } → emails a 6-digit OTP
//   POST /auth/reset-password { email, otp, newPassword } → sets the new password
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      const res = await apiClient.post<ApiResponse<unknown>>(
        "/auth/forgot-password",
        input,
      );
      return res.data;
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: {
      email: string;
      otp: string;
      newPassword: string;
    }) => {
      const res = await apiClient.post<ApiResponse<unknown>>(
        "/auth/reset-password",
        input,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated. Log in with your new password.");
      router.replace("/login");
    },
  });
}
