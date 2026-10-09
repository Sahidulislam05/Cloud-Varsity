// src/hooks/use-department.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { fetchData } from "@/lib/fetch-data";
import type { Course } from "@/types/academics";
import type { Instructor } from "@/types/department";
import type { BrowseSection } from "@/types/student";

export const useInstructors = () => useQuery({ queryKey: ["instructors"], queryFn: () => fetchData<Instructor[]>("/instructors") });

export const useDepartmentSections = (departmentId: string) =>
  useQuery({
    queryKey: ["sections", "department", departmentId],
    queryFn: () => fetchData<BrowseSection[]>("/sections", { departmentId }),
  });

// section বানানোর form এর course বাছাইয়ের তালিকা
export const useDepartmentCourses = (departmentId: string) =>
  useQuery({
    queryKey: ["courses", "options", "department", departmentId],
    queryFn: () => fetchData<Course[]>("/courses", { departmentId, limit: "100" }),
  });

export type ProgramInput = { name: string; code: string; durationSemesters: number };

// create/update এর error ফর্ম নিজে ঘরের নিচে দেখায়, তাই এখানে onError নেই
export function useCreateProgram(departmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProgramInput) => apiClient.post("/programs", { ...input, departmentId }),
    onSuccess: () => {
      toast.success("Program created");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: ProgramInput & { id: string }) => apiClient.patch(`/programs/${id}`, input),
    onSuccess: () => {
      toast.success("Program updated");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

export type SectionInput = { name: string; courseId: string; semesterId: string; instructorId: string; capacity: number };

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SectionInput) => apiClient.post("/sections", input),
    onSuccess: () => {
      toast.success("Section created");
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/sections/${id}`),
    onSuccess: () => {
      toast.success("Section deleted");
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (error) => toast.error(error.message),
  });
}