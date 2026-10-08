// src/components/finance-admin/finance-reports-view.tsx
"use client";

import { CircleDollarSign, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SemesterFilter } from "@/components/shared/semester-filter";
import { StatCard } from "@/components/shared/stat-card";
import { RevenueChart } from "@/components/super-admin/overview-charts";
import { useReport } from "@/hooks/use-reports";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { FinanceReport } from "@/types/admin";

export function FinanceReportsView() {
  const searchParams = useSearchParams();
  const semester = searchParams.get("semester") ?? undefined;
  const { data, isLoading } = useReport<FinanceReport>("finance", {
    semesterId: semester,
  });

  const collectionRate =
    data && data.totalInvoiced > 0
      ? Math.round((data.totalCollected / data.totalInvoiced) * 100)
      : 0;

  return (
    <>
      <DashboardHeader
        title="Payment Reports"
        description="How much has been invoiced, collected and is still pending."
      />

      <div className="mb-4">
        <SemesterFilter />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Invoices"
          value={data && formatNumber(data.invoiceCount)}
          icon={Receipt}
          isLoading={isLoading}
        />
        <StatCard
          label="Total invoiced"
          value={data && formatCurrency(data.totalInvoiced)}
          icon={Wallet}
          tone="info"
          isLoading={isLoading}
        />
        <StatCard
          label="Collected"
          value={data && formatCurrency(data.totalCollected)}
          icon={CircleDollarSign}
          tone="success"
          isLoading={isLoading}
        />
        <StatCard
          label="Pending"
          value={data && formatCurrency(data.totalPending)}
          icon={Wallet}
          tone="warning"
          isLoading={isLoading}
        />
        <StatCard
          label="Collection rate"
          value={data && `${collectionRate}%`}
          icon={TrendingUp}
          tone="accent"
          isLoading={isLoading}
        />
      </div>

      <div className="mt-6 lg:max-w-xl">
        <RevenueChart semesterId={semester} />
      </div>
    </>
  );
}
