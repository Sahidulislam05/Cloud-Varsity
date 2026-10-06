import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { MySectionsView } from "@/components/instructor/my-sections-view";

export const metadata: Metadata = { title: "My Sections" };

export default function InstructorPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MySectionsView />
    </Suspense>
  );
}
