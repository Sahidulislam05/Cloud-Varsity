import type { Course } from "@/types/academics";
import type { AttendanceStatus, SemesterStatus } from "@/types/student";

export type ExamType = "QUIZ" | "ASSIGNMENT" | "MIDTERM" | "FINAL";

export type InstructorSection = {
  id: string;
  name: string;
  capacity: number;
  courseId: string;
  semesterId: string;
  course: Course;
  semester: { id: string; name: string; year: number; status: SemesterStatus };
  _count: { registrations: number };
};

export type RosterStudent = {
  id: string;
  studentId: string;
  name: string;
  email: string;
};

export type SectionExam = {
  id: string;
  sectionId: string;
  examType: ExamType;
  title: string;
  totalMarks: number;
  examDate: string;
};

export type ExamResult = {
  studentId: string;
  obtainedMarks: number;
  publishedAt: string | null;
};

export type AttendanceEntry = { studentId: string; status: AttendanceStatus };
