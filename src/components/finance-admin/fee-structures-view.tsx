"use client";

import { Plus, Receipt } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  FeeStructureFormDialog,
  GenerateInvoicesDialog,
} from "@/components/finance-admin/fee-structure-dialogs";
import { type Column, DataTable } from "@/components/shared/data-table";
import { SemesterFilter } from "@/components/shared/semester-filter";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { usePrograms, useSemesters } from "@/hooks/use-academics";
import { useFeeStructures } from "@/hooks/use-finance";
import { usePagination } from "@/hooks/use-pagination";
import { formatCurrency } from "@/lib/format";
import { paginate } from "@/lib/paginate";
import type { FeeStructure } from "@/types/management";

export function FeeStructuresView() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const semesterId = searchParams.get("semester") ?? "";

  const { data, isLoading, isFetching, isError, refetch } = useFeeStructures();
  const { data: programs = [] } = usePrograms();
  const { data: semesters = [] } = useSemesters();

  const [createOpen, setCreateOpen] = useState(false);
  const [generateTarget, setGenerateTarget] = useState<FeeStructure | null>(
    null,
  );

  const filtered = (data ?? []).filter(
    (fee) => !semesterId || fee.semesterId === semesterId,
  );
  const { rows, meta } = paginate(filtered, page, limit);

  const columns: Column<FeeStructure>[] = [
    {
      key: "title",
      header: "Fee",
      cell: (fee) => <span className="font-medium">{fee.title}</span>,
    },
    {
      key: "program",
      header: "Program",
      className: "hidden md:table-cell",
      cell: (fee) => `${fee.program.name} (${fee.program.code})`,
    },
    {
      key: "semester",
      header: "Semester",
      cell: (fee) => (
        <div className="flex flex-col items-start gap-1">
          <span>
            {fee.semester.name} {fee.semester.year}
          </span>
          <StatusBadge status={fee.semester.status} />
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (fee) => (
        <span className="tabular-nums">
          {formatCurrency(Number(fee.amount))}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (fee) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setGenerateTarget(fee)}
        >
          <Receipt /> Generate invoices
        </Button>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Fee Structures"
        description="Define what each program pays per semester, then generate invoices for its students."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> New fee structure
          </Button>
        }
      />

      <div className="mb-4">
        <SemesterFilter />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(fee) => fee.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Fee structures"
        emptyTitle="No fee structures yet"
        emptyDescription="Create a fee structure for a program and semester, then generate invoices from it."
      />
      <TablePagination meta={isLoading ? undefined : meta} />

      <FeeStructureFormDialog
        open={createOpen}
        programs={programs}
        semesters={semesters}
        onClose={() => setCreateOpen(false)}
      />
      <GenerateInvoicesDialog
        fee={generateTarget}
        onClose={() => setGenerateTarget(null)}
      />
    </>
  );
}
