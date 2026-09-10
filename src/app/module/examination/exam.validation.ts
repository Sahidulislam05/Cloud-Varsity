import { z } from "zod";

export const createExamValidationSchema = z.object({
  sectionId: z.string().min(1, { error: "Section is required" }),
  examType: z.enum(["QUIZ", "ASSIGNMENT", "MIDTERM", "FINAL"]),
  title: z.string().min(2, { error: "Title is required" }),
  totalMarks: z.number().min(1).max(1000),
  examDate: z.iso.datetime({ error: "Invalid exam date" }),
});
