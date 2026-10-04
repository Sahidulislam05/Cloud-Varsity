"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { fetchData } from "@/lib/fetch-data";
import type { Course } from "@/types/academics";

export type CourseInput = { title: string; code: string; creditHours: number };
export type CreateCourseInput = CourseInput & {
  programId: string;
  prerequisiteCourseIds: string[];
};

export const useProgramCourses = (programId: string | undefined) =>
  useQuery({
    queryKey: ["courses", "options", programId],
    queryFn: () =>
      fetchData<Course[]>("/courses", {
        programId: programId ?? "",
        limit: "100",
      }),
    enabled: Boolean(programId),
  });

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCourseInput) => apiClient.post("/courses", input),
    onSuccess: () => {
      toast.success("Course created");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: CourseInput & { id: string }) =>
      apiClient.patch(`/courses/${id}`, input),
    onSuccess: () => {
      toast.success("Course updated");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/courses/${id}`),
    onSuccess: () => {
      toast.success("Course deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => toast.error(error.message),
  });
}
