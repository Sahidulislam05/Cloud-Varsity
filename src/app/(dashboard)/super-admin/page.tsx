// src/app/(dashboard)/super-admin/page.tsx
import type { Metadata } from "next";
import { SuperAdminOverview } from "@/components/super-admin/overview";

export const metadata: Metadata = { title: "Overview" };

export default function SuperAdminPage() {
  return <SuperAdminOverview />;
}