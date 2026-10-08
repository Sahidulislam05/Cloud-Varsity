import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { InvoicesView } from "@/components/finance-admin/invoices-view";

export const metadata: Metadata = { title: "Invoices" };

export default function FinanceInvoicesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <InvoicesView />
    </Suspense>
  );
}
