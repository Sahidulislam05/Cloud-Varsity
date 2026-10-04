// src/hooks/use-student.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { Program } from "@/types/academics";
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

async function fetchData<T>(url: string, params?: Record<string, string>) {
  const res = await apiClient.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

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

export const useMyProfile = () =>
  useQuery({
    queryKey: ["student", "profile"],
    queryFn: () => fetchData<Profile>("/user/me"),
  });

export const usePrograms = () =>
  useQuery({
    queryKey: ["programs"],
    queryFn: () => fetchData<Program[]>("/programs"),
  });

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

export type UpdateProfileInput = {
  name: string;
  phone: string;
  gender?: string;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await apiClient.patch<ApiResponse<{ name: string }>>(
        "/user/me",
        input,
      );
      return res.data.data;
    },
    onSuccess: (updated) => {
      updateUser({ name: updated.name });
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
      toast.success("Profile updated");
    },
  });
}
