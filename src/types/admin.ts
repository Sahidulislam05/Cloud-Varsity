import type { Role } from "@/store/auth-store";

export type Semester = {
  id: string;
  name: string;
  year: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  startDate: string;
  endDate: string;
};

export type DashboardStats = {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalPrograms: number;
  activeSemester: string | null;
  enrolledThisSemester: number;
  totalRevenueCollected: number;
  pendingInvoices: number;
};

export type EnrollmentReportRow = {
  courseCode: string;
  courseTitle: string;
  section: string;
  semester: string;
  capacity: number;
  enrolled: number;
  seatsRemaining: number;
};

export type AttendanceReportRow = {
  courseCode: string;
  section: string;
  totalRecords: number;
  averageAttendancePercentage: number;
};

export type ResultReport = {
  totalRecordsGraded: number;
  passRate: number;
  averageGpa: number;
};

export type FinanceReport = {
  invoiceCount: number;
  totalInvoiced: number;
  totalCollected: number;
  totalPending: number;
};

export type AuditLog = {
  id: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
  user: { name: string; email: string; role: Role } | null;
};
