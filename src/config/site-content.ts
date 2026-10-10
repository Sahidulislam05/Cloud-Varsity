import {
  Award,
  Bell,
  CalendarCheck,
  ChartColumn,
  ClipboardCheck,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export type Capability = {
  icon: LucideIcon;
  title: string;
  description: string;
};
export type RoleSummary = { name: string; accent: string; points: string[] };

export const CAPABILITIES: Capability[] = [
  {
    icon: ClipboardCheck,
    title: "Safe course registration",
    description:
      "Seat limits and prerequisites hold even when many students register at the same moment.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance tracking",
    description:
      "Instructors mark a whole class at once, and students see their attendance percentage.",
  },
  {
    icon: Award,
    title: "Results and GPA",
    description:
      "Weighted grading turns exam marks into grades, semester GPA and a complete transcript.",
  },
  {
    icon: CreditCard,
    title: "Online payments",
    description:
      "Tuition is paid through SSLCommerz and verified with the gateway before an invoice is marked paid.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "In-app notices and emails for registrations, payments and published results.",
  },
  {
    icon: ChartColumn,
    title: "Reports and audit trail",
    description:
      "Enrollment, attendance, result and finance reports, plus a log of every sensitive action.",
  },
];

export const ROLES: RoleSummary[] = [
  {
    name: "Student",
    accent: "border-l-role-student",
    points: [
      "Register and drop courses with live seat availability",
      "Track attendance, results, GPA and your transcript",
      "Pay tuition online and keep a payment history",
    ],
  },
  {
    name: "Instructor",
    accent: "border-l-role-instructor",
    points: [
      "View assigned sections and enrolled students",
      "Mark attendance and schedule exams",
      "Submit results for every exam",
    ],
  },
  {
    name: "Department Admin",
    accent: "border-l-role-department-admin",
    points: [
      "Manage programs, courses and sections in your department",
      "Assign instructors to sections",
      "Monitor departmental activity",
    ],
  },
  {
    name: "Registrar",
    accent: "border-l-role-registrar",
    points: [
      "Open, run and close semesters",
      "Monitor registrations university-wide",
      "Publish final results",
    ],
  },
  {
    name: "Finance Admin",
    accent: "border-l-role-finance-admin",
    points: [
      "Create fee structures per program and semester",
      "Generate invoices for students",
      "Track payments and financial reports",
    ],
  },
  {
    name: "Super Admin",
    accent: "border-l-role-super-admin",
    points: [
      "Manage every user and role",
      "View statistics, charts and reports",
      "Inspect the full audit log",
    ],
  },
];
