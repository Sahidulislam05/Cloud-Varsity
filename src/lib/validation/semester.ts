import { z } from "zod";

export const SEMESTER_TERMS = ["Spring", "Summer", "Fall"] as const;

export const semesterSchema = z
  .object({
    name: z.enum(SEMESTER_TERMS, { error: "Please select a term" }),
    year: z
      .string()
      .trim()
      .refine(
        (value) =>
          /^\d{4}$/.test(value) &&
          Number(value) >= 2000 &&
          Number(value) <= 2100,
        {
          error: "Enter a year between 2000 and 2100",
        },
      ),
    startDate: z.string().min(1, { error: "Please pick a start date" }),
    endDate: z.string().min(1, { error: "Please pick an end date" }),
  })

  .refine(
    (values) =>
      !values.startDate || !values.endDate || values.endDate > values.startDate,
    {
      path: ["endDate"],
      error: "End date must be after the start date",
    },
  );

export type SemesterValues = z.infer<typeof semesterSchema>;
