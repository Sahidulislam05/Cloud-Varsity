"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { fetchData } from "@/lib/fetch-data";
import { useAuthStore } from "@/store/auth-store";
import type { Profile } from "@/types/student";

export type UpdateProfileInput = {
  name: string;
  phone: string;
  gender?: string;
};

export const useMyProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchData<Profile>("/user/me"),
  });

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await apiClient.patch<ApiResponse<{ name: string }>>(
        "/user/me",
        input,
      );
      return res.data.data;
    },
    onSuccess: (updated) => {
      updateUser({ name: updated.name });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },
  });
}
