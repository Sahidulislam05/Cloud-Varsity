import type { Course, Program } from "@/types/academics";
import type { Semester } from "@/types/admin";
import type { RegistrationStatus } from "@/types/student";

export type FeeStructure = {
  id: string;
  title: string;
  amount: string;
  programId: string;
  semesterId: string;
  program: Program;
  semester: Semester;
};

export type AdminInvoice = {
  id: string;
  amount: string;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  student: { studentId: string; user: { name: string; email: string } };
  feeStructure: { title: string; semesterId: string };
};

export type RegistrationRow = {
  id: string;
  status: RegistrationStatus;
  registeredAt: string;
  finalGradeLetter: string | null;
  finalGradePoint: number | null;
  student: { studentId: string; user: { name: string; email: string } };
  section: {
    id: string;
    name: string;
    course: Course;
    semester: { name: string; year: number };
  };
};

export type InvoiceGenerationSummary = { generated: number; skipped: number };
export type PublishSummary = { publishedFor: number; skipped: number };
