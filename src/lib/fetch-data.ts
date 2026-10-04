import { type ApiResponse, apiClient } from "@/lib/api-client";

export async function fetchData<T>(url: string, params?: Record<string, string>) {
  const res = await apiClient.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}