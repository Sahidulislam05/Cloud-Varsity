import { z } from "zod";
import { todayLocal } from "@/lib/format";

const isValidAmount = (value: string) =>
  /^\d+(\.\d{1,2})?$/.test(value) &&
  Number(value) > 0 &&
  Number(value) <= 10_000_000;

export const feeStructureSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: "Title must be at least 2 characters" }),
  amount: z.string().trim().refine(isValidAmount, {
    error: "Enter a valid amount (up to 2 decimals)",
  }),
  programId: z.string().min(1, { error: "Please select a program" }),
  semesterId: z.string().min(1, { error: "Please select a semester" }),
});

export type FeeStructureValues = z.infer<typeof feeStructureSchema>;

export const generateInvoicesSchema = z.object({
  dueDate: z
    .string()
    .min(1, { error: "Please pick a due date" })
    .refine((value) => value >= todayLocal(), {
      error: "Due date cannot be in the past",
    }),
});

export type GenerateInvoicesValues = z.infer<typeof generateInvoicesSchema>;
