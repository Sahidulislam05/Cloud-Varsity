import type { Role } from "@/store/auth-store";

export const ROLE_HOME: Record<string, string> = {
  STUDENT: "/student",
  INSTRUCTOR: "/instructor",
  DEPARTMENT_ADMIN: "/department-admin",
  REGISTRAR: "/registrar",
  FINANCE_ADMIN: "/finance-admin",
  SUPER_ADMIN: "/super-admin",
};

export const ROLE_LABEL: Record<Role, string> = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  DEPARTMENT_ADMIN: "Department Admin",
  REGISTRAR: "Registrar",
  FINANCE_ADMIN: "Finance Admin",
  SUPER_ADMIN: "Super Admin",
};

export const ROLE_ACCENT: Record<Role, { dot: string; border: string }> = {
  STUDENT: { dot: "bg-role-student", border: "border-l-role-student" },
  INSTRUCTOR: { dot: "bg-role-instructor", border: "border-l-role-instructor" },
  DEPARTMENT_ADMIN: {
    dot: "bg-role-department-admin",
    border: "border-l-role-department-admin",
  },
  REGISTRAR: { dot: "bg-role-registrar", border: "border-l-role-registrar" },
  FINANCE_ADMIN: {
    dot: "bg-role-finance-admin",
    border: "border-l-role-finance-admin",
  },
  SUPER_ADMIN: {
    dot: "bg-role-super-admin",
    border: "border-l-role-super-admin",
  },
};
