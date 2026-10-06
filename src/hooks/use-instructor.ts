// src/hooks/use-instructor.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { fetchData } from "@/lib/fetch-data";
import type {
  AttendanceEntry,
  ExamResult,
  ExamType,
  InstructorSection,
  RosterStudent,
  SectionExam,
} from "@/types/instructor";
import type { AttendanceStatus } from "@/types/student";

export const useMySections = () =>
  useQuery({
    queryKey: ["instructor", "sections"],
    queryFn: () => fetchData<InstructorSection[]>("/sections/my-sections"),
  });

export const useSectionStudents = (sectionId: string) =>
  useQuery({
    queryKey: ["instructor", "students", sectionId],
    queryFn: () =>
      fetchData<RosterStudent[]>(`/sections/${sectionId}/students`),
  });

export const useSectionExams = (sectionId: string) =>
  useQuery({
    queryKey: ["instructor", "exams", sectionId],
    queryFn: () => fetchData<SectionExam[]>("/exams", { sectionId }),
  });

// শুধু আগের exam বাছলেই (examId থাকলেই) জমা দেওয়া নম্বর আনে
export const useExamResults = (examId: string | undefined) =>
  useQuery({
    queryKey: ["instructor", "exam-results", examId],
    queryFn: () => fetchData<ExamResult[]>(`/results/exams/${examId}`),
    enabled: Boolean(examId),
  });

export const useSectionAttendance = (sectionId: string, date: string) =>
  useQuery({
    queryKey: ["instructor", "attendance", sectionId, date],
    queryFn: () =>
      fetchData<AttendanceEntry[]>("/attendance", { sectionId, date }),
  });

type MarkAttendanceInput = {
  sectionId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus }[];
};

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MarkAttendanceInput) =>
      apiClient.post("/attendance", input),
    onSuccess: () => {
      toast.success("Attendance saved");
      queryClient.invalidateQueries({ queryKey: ["instructor", "attendance"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

type CreateExamInput = {
  sectionId: string;
  examType: ExamType;
  title: string;
  totalMarks: number;
  examDate: string;
};

export function useCreateExam() {
  return useMutation({
    mutationFn: async (input: CreateExamInput) => {
      const res = await apiClient.post<ApiResponse<SectionExam>>(
        "/exams",
        input,
      );
      return res.data.data;
    },
  });
}

type SubmitResultsInput = {
  examId: string;
  records: { studentId: string; obtainedMarks: number }[];
};

export function useSubmitResults() {
  return useMutation({
    mutationFn: (input: SubmitResultsInput) =>
      apiClient.post("/results", input),
  });
}
