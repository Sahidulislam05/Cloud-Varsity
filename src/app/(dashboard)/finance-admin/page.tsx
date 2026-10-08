import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { FeeStructuresView } from "@/components/finance-admin/fee-structures-view";

export const metadata: Metadata = { title: "Fee Structures" };

export default function FinanceAdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FeeStructuresView />
    </Suspense>
  );
}
