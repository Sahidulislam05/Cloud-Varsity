import { serverGet } from "@/lib/server-api";
import type {
  Course,
  Department,
  Program,
  University,
} from "@/types/academics";

export type CourseQuery = {
  page?: number;
  limit?: number;
  search?: string;
  programId?: string;
  sortBy?: string;
  sortOrder?: string;
};

export const getUniversities = () => serverGet<University[]>("/universities");
export const getDepartments = () => serverGet<Department[]>("/departments");
export const getPrograms = () => serverGet<Program[]>("/programs");
export const getCourses = (query: CourseQuery = {}) =>
  serverGet<Course[]>("/courses", { query, revalidate: 60 });
