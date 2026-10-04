// src/config/navigation.ts
import {
  BookOpen,
  CalendarRange,
  ChartColumn,
  ClipboardList,
  CreditCard,
  FileCheck,
  Layers,
  LayoutDashboard,
  Library,
  type LucideIcon,
  Presentation,
  Receipt,
  ScrollText,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { Role } from "@/store/auth-store";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: string[]; // detail পেজেও যেন এই item active দেখায়
};

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [
    { label: "My Courses", href: "/student", icon: BookOpen },
    { label: "Payments", href: "/student/payments", icon: CreditCard },
    { label: "Profile", href: "/student/profile", icon: UserRound },
  ],
  INSTRUCTOR: [
    {
      label: "My Sections",
      href: "/instructor",
      icon: Presentation,
      match: ["/instructor/sections"],
    },
    { label: "Profile", href: "/instructor/profile", icon: UserRound },
  ],
  DEPARTMENT_ADMIN: [
    { label: "Overview", href: "/department-admin", icon: LayoutDashboard },
    {
      label: "Programs & Courses",
      href: "/department-admin/courses",
      icon: Library,
    },
    { label: "Sections", href: "/department-admin/sections", icon: Layers },
  ],
  REGISTRAR: [
    { label: "Semesters", href: "/registrar", icon: CalendarRange },
    {
      label: "Registrations",
      href: "/registrar/registrations",
      icon: ClipboardList,
    },
    { label: "Results", href: "/registrar/results", icon: FileCheck },
  ],
  FINANCE_ADMIN: [
    { label: "Fee Structures", href: "/finance-admin", icon: Wallet },
    { label: "Invoices", href: "/finance-admin/invoices", icon: Receipt },
    { label: "Reports", href: "/finance-admin/reports", icon: ChartColumn },
  ],
  SUPER_ADMIN: [
    { label: "Overview", href: "/super-admin", icon: LayoutDashboard },
    { label: "Users", href: "/super-admin/users", icon: Users },
    {
      label: "Audit & Reports",
      href: "/super-admin/reports",
      icon: ScrollText,
    },
  ],
};
