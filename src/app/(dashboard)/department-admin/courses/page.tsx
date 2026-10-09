import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { ProgramsCoursesView } from "@/components/department-admin/programs-courses-view";

export const metadata: Metadata = { title: "Programs & Courses" };

export default function DepartmentCoursesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProgramsCoursesView />
    </Suspense>
  );
}
