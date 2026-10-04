
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/fetch-data";
import type { Program } from "@/types/academics";
import type { Semester } from "@/types/admin";

export const usePrograms = () =>
  useQuery({
    queryKey: ["programs"],
    queryFn: () => fetchData<Program[]>("/programs"),
  });

export const useSemesters = () =>
  useQuery({
    queryKey: ["semesters"],
    queryFn: () => fetchData<Semester[]>("/semesters"),
  });
