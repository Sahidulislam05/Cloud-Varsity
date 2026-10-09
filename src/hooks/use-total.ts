// src/hooks/use-total.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/lib/api-client";

export function useTotal(
  queryKey: readonly unknown[],
  endpoint: string,
  params: Record<string, string | number> = {},
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<unknown[]>>(endpoint, {
        params: { ...params, limit: 1 },
      });
      return res.data.meta?.total ?? 0;
    },
  });
}
