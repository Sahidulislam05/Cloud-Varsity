"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { fetchData } from "@/lib/fetch-data";
import type {
  FeeStructure,
  InvoiceGenerationSummary,
} from "@/types/management";

export type CreateFeeStructureInput = {
  title: string;
  amount: number;
  programId: string;
  semesterId: string;
};

export const useFeeStructures = () =>
  useQuery({
    queryKey: ["fee-structures"],
    queryFn: () => fetchData<FeeStructure[]>("/fee-structures"),
  });

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFeeStructureInput) =>
      apiClient.post("/fee-structures", input),
    onSuccess: () => {
      toast.success("Fee structure created");
      queryClient.invalidateQueries({ queryKey: ["fee-structures"] });
    },
  });
}

export function useGenerateInvoices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dueDate }: { id: string; dueDate: string }) => {
      const res = await apiClient.post<ApiResponse<InvoiceGenerationSummary>>(
        `/fee-structures/${id}/generate-invoices`,
        {
          dueDate,
        },
      );
      return res.data.data;
    },
    onSuccess: ({ generated, skipped }) => {
      if (generated === 0) {
        toast.info("No new invoices", {
          description:
            "Every student in this program already has an invoice for this fee.",
        });
      } else {
        toast.success(`Generated ${generated} invoice(s)`, {
          description:
            skipped > 0 ? `${skipped} student(s) already had one.` : undefined,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => toast.error(error.message),
  });
}
