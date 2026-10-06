import { z } from "zod";

const isValidTotal = (value: string) => {
  const number = Number(value);
  return (
    value !== "" && Number.isFinite(number) && number >= 1 && number <= 1000
  );
};

export const EXAM_TYPES = [
  { value: "QUIZ", label: "Quiz" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "MIDTERM", label: "Midterm" },
  { value: "FINAL", label: "Final" },
] as const;

export const examSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: "Title must be at least 2 characters" }),
  examType: z.enum(["QUIZ", "ASSIGNMENT", "MIDTERM", "FINAL"], {
    error: "Please select an exam type",
  }),
  totalMarks: z
    .string()
    .trim()
    .refine(isValidTotal, { error: "Total marks must be between 1 and 1000" }),
  examDate: z.string().min(1, { error: "Please pick a date and time" }),
});

export type ExamValues = z.infer<typeof examSchema>;
