import { z } from "zod";

export const submitResultsValidationSchema = z.object({
  examId: z.string().min(1, { error: "Exam is required" }),
  records: z
    .array(
      z.object({
        studentId: z.string().min(1, { error: "Student is required" }),
        obtainedMarks: z.number().min(0),
      }),
    )
    .min(1, { error: "At least one result record is required" }),
});
