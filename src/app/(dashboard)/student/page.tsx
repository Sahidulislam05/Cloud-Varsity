// src/app/(dashboard)/student/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { MyCoursesView } from "@/components/student/my-courses-view";

export const metadata: Metadata = { title: "My Courses" };

export default function StudentPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MyCoursesView />
    </Suspense>
  );
}