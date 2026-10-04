// src/hooks/use-list-query.ts
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/lib/api-client";

type ListParams = Record<string, string | number | undefined>;

export function useListQuery<T>(
  resource: string,
  endpoint: string,
  params: ListParams,
) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

  return useQuery({
    queryKey: [resource, cleanParams],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<T[]>>(endpoint, {
        params: cleanParams,
      });
      return res.data;
    },

    placeholderData: keepPreviousData,
  });
}
