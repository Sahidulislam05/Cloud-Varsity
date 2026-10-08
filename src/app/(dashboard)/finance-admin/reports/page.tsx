import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { FinanceReportsView } from "@/components/finance-admin/finance-reports-view";

export const metadata: Metadata = { title: "Payment Reports" };

export default function FinanceReportsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FinanceReportsView />
    </Suspense>
  );
}
