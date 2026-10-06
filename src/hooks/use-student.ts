"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import type {
  AttendanceData,
  BrowseSection,
  ExamRow,
  Invoice,
  Profile,
  Registration,
  ResultRow,
  Transcript,
} from "@/types/student";
import { fetchData } from "@/lib/fetch-data";

export const useMyRegistrations = () =>
  useQuery({
    queryKey: ["student", "registrations"],
    queryFn: () => fetchData<Registration[]>("/enrollment/my-registrations"),
  });

export const useSections = () =>
  useQuery({
    queryKey: ["student", "sections"],
    queryFn: () => fetchData<BrowseSection[]>("/sections"),
  });

export const useMyExams = () =>
  useQuery({
    queryKey: ["student", "exams"],
    queryFn: () => fetchData<ExamRow[]>("/exams/my-upcoming"),
  });

export const useMyResults = () =>
  useQuery({
    queryKey: ["student", "results"],
    queryFn: () => fetchData<ResultRow[]>("/results/my-results"),
  });

export const useMyTranscript = () =>
  useQuery({
    queryKey: ["student", "transcript"],
    queryFn: () => fetchData<Transcript>("/results/my-transcript"),
  });

export const useMyInvoices = () =>
  useQuery({
    queryKey: ["student", "invoices"],
    queryFn: () => fetchData<Invoice[]>("/payments/my-invoices"),
  });

// export const usePrograms = () =>
//   useQuery({
//     queryKey: ["programs"],
//     queryFn: () => fetchData<Program[]>("/programs"),
//   });

export const useMyAttendance = (sectionId: string | undefined) =>
  useQuery({
    queryKey: ["student", "attendance", sectionId],
    queryFn: () =>
      fetchData<AttendanceData>("/attendance/my-attendance", {
        sectionId: sectionId ?? "",
      }),
    enabled: Boolean(sectionId),
  });

export function useRegisterCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) =>
      apiClient.post("/enrollment", { sectionId }),
    onSuccess: () => {
      toast.success("Registered successfully");

      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDropCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: string) =>
      apiClient.patch(`/enrollment/${registrationId}/drop`),
    onSuccess: () => {
      toast.success("Course dropped");
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const res = await apiClient.post<
        ApiResponse<{ paymentUrl: string; transactionId: string }>
      >(`/payments/initiate/${invoiceId}`);
      return res.data.data;
    },
    onSuccess: ({ paymentUrl }) => {
      if (new URL(paymentUrl).protocol !== "https:") {
        toast.error("Received an invalid payment link");
        return;
      }
      window.location.assign(paymentUrl);
    },
    onError: (error) => toast.error(error.message),
  });
}
