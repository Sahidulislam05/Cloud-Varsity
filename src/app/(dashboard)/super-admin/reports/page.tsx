import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { ReportsView } from "@/components/super-admin/reports-view";

export const metadata: Metadata = { title: "Audit & Reports" };

export default function ReportsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ReportsView />
    </Suspense>
  );
}
