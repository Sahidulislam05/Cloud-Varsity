// src/lib/demo-accounts.ts
import {
  Building2,
  FileCheck,
  GraduationCap,
  type LucideIcon,
  Presentation,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { Role } from "@/store/auth-store";

// Only controls whether the demo buttons are shown. No credentials live in
// the client: the backend signs in the seeded account for a role, and only
// when its own DEMO_MODE is enabled.
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export type DemoAccount = {
  role: Role;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "STUDENT",
    label: "Student",
    description: "Courses, results & payments",
    icon: GraduationCap,
    accent: "border-l-role-student",
  },
  {
    role: "INSTRUCTOR",
    label: "Instructor",
    description: "Attendance, exams & grading",
    icon: Presentation,
    accent: "border-l-role-instructor",
  },
  {
    role: "DEPARTMENT_ADMIN",
    label: "Department Admin",
    description: "Programs, courses & sections",
    icon: Building2,
    accent: "border-l-role-department-admin",
  },
  {
    role: "REGISTRAR",
    label: "Registrar",
    description: "Semesters & result publishing",
    icon: FileCheck,
    accent: "border-l-role-registrar",
  },
  {
    role: "FINANCE_ADMIN",
    label: "Finance Admin",
    description: "Fees, invoices & payments",
    icon: Wallet,
    accent: "border-l-role-finance-admin",
  },
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Users, reports & audit logs",
    icon: ShieldCheck,
    accent: "border-l-role-super-admin",
  },
];
