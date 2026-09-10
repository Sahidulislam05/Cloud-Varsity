import { z } from "zod";

export const createDepartmentValidationSchema = z.object({
  name: z.string().min(2, { error: "Name is required" }),
  code: z.string().min(2, { error: "Code is required" }),
  universityId: z.string().min(1, { error: "University is required" }),
});
export const updateDepartmentValidationSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).optional(),
});

export const createProgramValidationSchema = z.object({
  name: z.string().min(2, { error: "Name is required" }),
  code: z.string().min(2, { error: "Code is required" }),
  departmentId: z.string().min(1, { error: "Department is required" }),
  durationSemesters: z.number().int().min(1).max(20),
});
export const updateProgramValidationSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).optional(),
  durationSemesters: z.number().int().min(1).max(20).optional(),
});

export const createCourseValidationSchema = z.object({
  title: z.string().min(2, { error: "Title is required" }),
  code: z.string().min(2, { error: "Code is required" }),
  creditHours: z.number().min(0.5).max(10),
  programId: z.string().min(1, { error: "Program is required" }),
  prerequisiteCourseIds: z.array(z.string()).optional(),
});
export const updateCourseValidationSchema = z.object({
  title: z.string().min(2).optional(),
  code: z.string().min(2).optional(),
  creditHours: z.number().min(0.5).max(10).optional(),
});

export const createSemesterValidationSchema = z.object({
  name: z.string().min(2, { error: "Name is required" }),
  year: z.number().int().min(2000).max(2100),
  startDate: z.iso.datetime({ error: "Invalid start date" }),
  endDate: z.iso.datetime({ error: "Invalid end date" }),
});
export const updateSemesterStatusValidationSchema = z.object({
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]),
});

export const createSectionValidationSchema = z.object({
  name: z.string().min(1, { error: "Section name is required" }),
  courseId: z.string().min(1, { error: "Course is required" }),
  semesterId: z.string().min(1, { error: "Semester is required" }),
  instructorId: z.string().min(1, { error: "Instructor is required" }),
  capacity: z.number().int().min(1).max(500),
});
