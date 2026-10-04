// src/hooks/use-pagination.ts
"use client";

import { useSearchParams } from "next/navigation";

const MAX_LIMIT = 100;

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function usePagination(defaultLimit = 10) {
  const searchParams = useSearchParams();

  const page = toPositiveInt(searchParams.get("page"), 1);
  const limit = Math.min(
    toPositiveInt(searchParams.get("limit"), defaultLimit),
    MAX_LIMIT,
  );

  return { page, limit };
}
