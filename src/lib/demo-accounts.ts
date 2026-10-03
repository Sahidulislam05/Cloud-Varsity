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

export type DemoAccount = {
  role: Role;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  email: string | undefined;
  password: string | undefined;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "STUDENT",
    label: "Student",
    description: "Courses, results & payments",
    icon: GraduationCap,
    accent: "border-l-role-student",
    email: process.env.NEXT_PUBLIC_DEMO_STUDENT_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_STUDENT_PASSWORD,
  },
  {
    role: "INSTRUCTOR",
    label: "Instructor",
    description: "Attendance, exams & grading",
    icon: Presentation,
    accent: "border-l-role-instructor",
    email: process.env.NEXT_PUBLIC_DEMO_INSTRUCTOR_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_INSTRUCTOR_PASSWORD,
  },
  {
    role: "DEPARTMENT_ADMIN",
    label: "Department Admin",
    description: "Programs, courses & sections",
    icon: Building2,
    accent: "border-l-role-department-admin",
    email: process.env.NEXT_PUBLIC_DEMO_DEPARTMENT_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_DEPARTMENT_ADMIN_PASSWORD,
  },
  {
    role: "REGISTRAR",
    label: "Registrar",
    description: "Semesters & result publishing",
    icon: FileCheck,
    accent: "border-l-role-registrar",
    email: process.env.NEXT_PUBLIC_DEMO_REGISTRAR_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_REGISTRAR_PASSWORD,
  },
  {
    role: "FINANCE_ADMIN",
    label: "Finance Admin",
    description: "Fees, invoices & payments",
    icon: Wallet,
    accent: "border-l-role-finance-admin",
    email: process.env.NEXT_PUBLIC_DEMO_FINANCE_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_FINANCE_ADMIN_PASSWORD,
  },
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Users, reports & audit logs",
    icon: ShieldCheck,
    accent: "border-l-role-super-admin",
    email: process.env.NEXT_PUBLIC_DEMO_SUPER_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_SUPER_ADMIN_PASSWORD,
  },
];
