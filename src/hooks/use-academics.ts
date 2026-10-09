"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/fetch-data";
import type { Department, Program } from "@/types/academics";
import type { Semester } from "@/types/admin";

export const usePrograms = (departmentId?: string) =>
  useQuery({
    queryKey: ["programs", departmentId ?? "all"],
    queryFn: () =>
      fetchData<Program[]>(
        "/programs",
        departmentId ? { departmentId } : undefined,
      ),
  });

export const useSemesters = () =>
  useQuery({
    queryKey: ["semesters"],
    queryFn: () => fetchData<Semester[]>("/semesters"),
  });

export const useDepartments = () =>
  useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchData<Department[]>("/departments"),
  });
