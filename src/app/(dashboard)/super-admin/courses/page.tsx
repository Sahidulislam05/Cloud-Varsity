import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { CoursesView } from "@/components/super-admin/courses-view";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CoursesView />
    </Suspense>
  );
}
