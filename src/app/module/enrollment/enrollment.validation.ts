import { z } from "zod";

export const registerCourseValidationSchema = z.object({
  sectionId: z.string().min(1, { error: "Section is required" }),
});
