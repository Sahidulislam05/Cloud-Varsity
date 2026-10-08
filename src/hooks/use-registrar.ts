"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { fetchData } from "@/lib/fetch-data";
import type { Semester } from "@/types/admin";
import type { PublishSummary } from "@/types/management";
import type { BrowseSection } from "@/types/student";

export const useAllSections = () =>
  useQuery({
    queryKey: ["sections"],
    queryFn: () => fetchData<BrowseSection[]>("/sections"),
  });

export type CreateSemesterInput = {
  name: string;
  year: number;
  startDate: string;
  endDate: string;
};

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSemesterInput) =>
      apiClient.post("/semesters", input),
    onSuccess: () => {
      toast.success("Semester created");
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}

export function useUpdateSemesterStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Semester["status"] }) =>
      apiClient.patch(`/semesters/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Semester updated");
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function usePublishResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      const res = await apiClient.patch<ApiResponse<PublishSummary>>(
        `/results/sections/${sectionId}/publish`,
      );
      return res.data.data;
    },
    onSuccess: ({ publishedFor, skipped }) => {
      toast.success(`Results published for ${publishedFor} student(s)`, {
        description:
          skipped > 0
            ? `${skipped} skipped because they have no marks.`
            : undefined,
      });

      for (const key of [
        "sections",
        "registrations",
        "reports",
        "audit-logs",
      ]) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: (error) => toast.error(error.message),
  });
}
