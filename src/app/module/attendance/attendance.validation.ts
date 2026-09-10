import { z } from "zod";

export const markAttendanceValidationSchema = z.object({
  sectionId: z.string().min(1, { error: "Section is required" }),
  date: z.iso.date({ error: "Date must be in YYYY-MM-DD format" }),
  records: z
    .array(
      z.object({
        studentId: z.string().min(1, { error: "Student is required" }),
        status: z.enum(["PRESENT", "ABSENT", "LATE"]),
      }),
    )
    .min(1, { error: "At least one attendance record is required" }),
});