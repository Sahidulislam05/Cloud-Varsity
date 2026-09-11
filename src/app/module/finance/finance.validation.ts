import { z } from "zod";

export const createFeeStructureValidationSchema = z.object({
  title: z.string().min(2, { error: "Title is required" }),
  amount: z.number().positive({ error: "Amount must be a positive number" }),
  programId: z.string().min(1, { error: "Program is required" }),
  semesterId: z.string().min(1, { error: "Semester is required" }),
});

export const generateInvoicesValidationSchema = z.object({
  dueDate: z.iso.date({ error: "Due date must be in YYYY-MM-DD format" }),
});