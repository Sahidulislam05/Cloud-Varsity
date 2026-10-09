// src/app/(dashboard)/department-admin/page.tsx
import type { Metadata } from "next";
import { DepartmentOverview } from "@/components/department-admin/overview";

export const metadata: Metadata = { title: "Department Overview" };

export default function DepartmentAdminPage() {
  return <DepartmentOverview />;
}
