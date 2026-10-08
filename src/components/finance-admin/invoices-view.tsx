"use client";

import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { useListQuery } from "@/hooks/use-list-query";
import { usePagination } from "@/hooks/use-pagination";
import { formatCurrency, formatDate } from "@/lib/format";
import { displayInvoiceStatus } from "@/lib/invoice";
import type { AdminInvoice } from "@/types/management";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
];

const COLUMNS: Column<AdminInvoice>[] = [
  {
    key: "student",
    header: "Student",
    cell: (invoice) => (
      <div>
        <p className="font-medium">{invoice.student.user.name}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {invoice.student.studentId}
        </p>
      </div>
    ),
  },
  {
    key: "fee",
    header: "Fee",
    className: "hidden md:table-cell",
    cell: (invoice) => invoice.feeStructure.title,
  },
  {
    key: "amount",
    header: "Amount",
    cell: (invoice) => (
      <span className="tabular-nums">
        {formatCurrency(Number(invoice.amount))}
      </span>
    ),
  },
  {
    key: "due",
    header: "Due date",
    className: "hidden sm:table-cell",
    cell: (invoice) => formatDate(invoice.dueDate),
  },
  {
    key: "status",
    header: "Status",
    cell: (invoice) => (
      <StatusBadge
        status={displayInvoiceStatus(invoice.status, invoice.dueDate)}
      />
    ),
  },
];

export function InvoicesView() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const status = searchParams.get("status") ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } =
    useListQuery<AdminInvoice>("invoices", "/payments/invoices", {
      page,
      limit,
      status,
    });

  return (
    <>
      <DashboardHeader
        title="Invoices"
        description="Every invoice issued to students, with live payment status."
      />

      <div className="mb-4">
        <FilterSelect
          paramName="status"
          label="Status"
          allLabel="All invoices"
          options={STATUS_OPTIONS}
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={data?.data}
        rowKey={(invoice) => invoice.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Invoices"
        emptyTitle="No invoices found"
        emptyDescription="Generate invoices from a fee structure, or try a different status filter."
      />
      <TablePagination meta={data?.meta} />
    </>
  );
}
