import type { ApiResponse } from "@/lib/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ServerGetOptions = {
  query?: Record<string, string | number | undefined>;
  revalidate?: number;
};

export async function serverGet<T>(
  path: string,
  { query, revalidate = 300 }: ServerGetOptions = {},
): Promise<ApiResponse<T>> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok)
    throw new Error(`Request to ${path} failed with status ${res.status}`);

  return res.json() as Promise<ApiResponse<T>>;
}
