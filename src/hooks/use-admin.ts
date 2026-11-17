"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/user/${id}/status`, { isActive }),
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "User activated" : "User deactivated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useAssignDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, departmentId }: { id: string; departmentId: string }) =>
      apiClient.patch(`/user/${id}/department`, { departmentId }),
    onSuccess: () => {
      toast.success("Department assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export type StaffRole =
  | "INSTRUCTOR"
  | "DEPARTMENT_ADMIN"
  | "REGISTRAR"
  | "FINANCE_ADMIN";

export type CreateStaffInput = {
  name: string;
  email: string;
  role: StaffRole;
  departmentId?: string;
  employeeId?: string;
  designation?: string;
};

export function useCreateStaffUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStaffInput) => apiClient.post("/user", input),
    onSuccess: () => {
      toast.success("Staff account created. A set-password email was sent.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(error.message),
  });
}
