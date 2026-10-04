"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/fetch-data";

type ReportName = "enrollment" | "attendance" | "results" | "finance";

export function useReport<T>(
  name: ReportName,
  params: Record<string, string | undefined> = {},
) {
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) query[key] = value;
  }

  return useQuery({
    queryKey: ["reports", name, query],
    queryFn: () => fetchData<T>(`/reports/${name}`, query),
  });
}
