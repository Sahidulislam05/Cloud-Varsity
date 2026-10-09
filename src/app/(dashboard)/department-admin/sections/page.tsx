import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { SectionsView } from "@/components/department-admin/sections-view";

export const metadata: Metadata = { title: "Sections" };

export default function DepartmentSectionsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SectionsView />
    </Suspense>
  );
}
