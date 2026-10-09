import type { Course } from "@/types/academics";

export type RegistrationStatus = "ENROLLED" | "DROPPED" | "COMPLETED";
export type SemesterStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

export type SectionInfo = {
  id: string;
  name: string;
  capacity: number;
  courseId: string;
  semesterId: string;
  course: Course;
  semester: { id: string; name: string; year: number; status: SemesterStatus };
  instructor: { designation: string; user: { name: string; email: string } };
};

export type BrowseSection = SectionInfo & { _count: { registrations: number } };

export type Registration = {
  id: string;
  sectionId: string;
  status: RegistrationStatus;
  registeredAt: string;
  droppedAt: string | null;
  finalGradeLetter: string | null;
  finalGradePoint: number | null;
  section: SectionInfo;
};

export type ExamRow = {
  id: string;
  title: string;
  examType: string;
  totalMarks: number;
  examDate: string;
  section: { name: string; course: Course };
};

export type ResultRow = {
  id: string;
  obtainedMarks: number;
  exam: {
    id: string;
    title: string;
    examType: string;
    totalMarks: number;
    examDate: string;
    section: { name: string; course: Course };
  };
};

export type TranscriptCourse = {
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  gradeLetter: string | null;
  gradePoint: number | null;
};

export type Transcript = {
  studentId: string;
  cgpa: number | null;
  semesters: {
    semester: string;
    semesterGpa: number;
    courses: TranscriptCourse[];
  }[];
};

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type AttendanceData = {
  records: { id: string; date: string; status: AttendanceStatus }[];
  summary: {
    totalClasses: number;
    present: number;
    late: number;
    absent: number;
    presentPercentage: number;
  };
};

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export type PaymentRecord = {
  id: string;
  transactionId: string;
  amount: string; // Prisma Decimal, JSON এ string হয়ে আসে
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export type Invoice = {
  id: string;
  amount: string;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  createdAt: string;
  feeStructure: { title: string; semester: { name: string; year: number } };
  payments: PaymentRecord[];
};

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: Gender | null;
  createdAt: string;
  studentProfile: {
    studentId: string;
    programId: string;
    batch: number;
    cgpa: number | null;
  } | null;

  instructorProfile: {
    employeeId: string;
    departmentId: string;
    designation: string;
  } | null;

  departmentId: string | null;
  department: { id: string; name: string; code: string } | null;
};
