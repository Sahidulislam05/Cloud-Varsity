// src/lib/validations/department.ts
import { z } from "zod";

// নিয়ম backend এর academics.validation.ts এর সাথে মেলানো
export const programSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters" }),
  code: z.string().trim().min(2, { error: "Code must be at least 2 characters" }),
  durationSemesters: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 20, {
      error: "Enter a whole number between 1 and 20",
    }),
});

export type ProgramValues = z.infer<typeof programSchema>;

export const sectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Section name is required" })
    .max(10, { error: "Keep the section name short, e.g. A" }),
  courseId: z.string().min(1, { error: "Please select a course" }),
  semesterId: z.string().min(1, { error: "Please select a semester" }),
  instructorId: z.string().min(1, { error: "Please select an instructor" }),
  capacity: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 500, {
      error: "Capacity must be a whole number between 1 and 500",
    }),
});

export type SectionValues = z.infer<typeof sectionSchema>;