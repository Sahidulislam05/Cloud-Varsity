import { z } from "zod";

const isValidCredit = (value: string) => {
  const number = Number(value);
  return (
    value !== "" && Number.isFinite(number) && number >= 0.5 && number <= 10
  );
};

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: "Title must be at least 2 characters" }),
  code: z
    .string()
    .trim()
    .min(2, { error: "Code must be at least 2 characters" }),
  creditHours: z.string().trim().refine(isValidCredit, {
    error: "Credit hours must be between 0.5 and 10",
  }),
  programId: z.string().min(1, { error: "Please select a program" }),
  prerequisiteCourseIds: z.array(z.string()),
});

export type CourseValues = z.infer<typeof courseSchema>;
