// src/components/student/payments-view.tsx
"use client";

import { CircleDollarSign, CreditCard, Loader2, Receipt, Wallet } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useInitiatePayment, useMyInvoices } from "@/hooks/use-student";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type { Invoice, PaymentRecord } from "@/types/student";

const DAY_MS = 24 * 60 * 60 * 1000;


const effectiveStatus = (invoice: Invoice) =>
  invoice.status === "PENDING" && new Date(invoice.dueDate).getTime() + DAY_MS < Date.now() ? "OVERDUE" : invoice.status;

type PaymentHistoryRow = PaymentRecord & { feeTitle: string };

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
];

const HISTORY_COLUMNS: Column<PaymentHistoryRow>[] = [
  { key: "date", header: "Date", cell: (payment) => formatDateTime(payment.paidAt ?? payment.createdAt) },
  { key: "fee", header: "Fee", cell: (payment) => payment.feeTitle },
  { key: "amount", header: "Amount", cell: (payment) => formatCurrency(Number(payment.amount)) },
  {
    key: "transaction",
    header: "Transaction ID",
    className: "hidden md:table-cell",
    cell: (payment) => <span className="font-mono text-xs">{payment.transactionId}</span>,
  },
  { key: "status", header: "Status", cell: (payment) => <StatusBadge status={payment.status} /> },
];

export function PaymentsView() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") ?? "";

  const { data, isLoading, isFetching, isError, refetch } = useMyInvoices();
  const pay = useInitiatePayment();

  const invoices = data ?? [];
  const visibleInvoices = invoices.filter((invoice) => !statusFilter || invoice.status === statusFilter);

  const totalDue = invoices.filter((i) => i.status === "PENDING").reduce((sum, i) => sum + Number(i.amount), 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + Number(i.amount), 0);
  const pendingCount = invoices.filter((i) => i.status === "PENDING").length;

  const history: PaymentHistoryRow[] = invoices
    .flatMap((invoice) => invoice.payments.map((payment) => ({ ...payment, feeTitle: invoice.feeStructure.title })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const invoiceColumns: Column<Invoice>[] = [
    {
      key: "fee",
      header: "Fee",
      cell: (invoice) => (
        <div>
          <p className="font-medium">{invoice.feeStructure.title}</p>
          <p className="text-xs text-muted-foreground">
            {invoice.feeStructure.semester.name} {invoice.feeStructure.semester.year}
          </p>
        </div>
      ),
    },
    { key: "amount", header: "Amount", cell: (invoice) => formatCurrency(Number(invoice.amount)) },
    { key: "due", header: "Due date", className: "hidden sm:table-cell", cell: (invoice) => formatDate(invoice.dueDate) },
    { key: "status", header: "Status", cell: (invoice) => <StatusBadge status={effectiveStatus(invoice)} /> },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      cell: (invoice) => {
        if (invoice.status === "PAID") return <span className="text-xs text-muted-foreground">Paid</span>;

        const redirecting = (pay.isPending || pay.isSuccess) && pay.variables === invoice.id;
        return (
          <Button size="sm" disabled={pay.isPending || pay.isSuccess} onClick={() => pay.mutate(invoice.id)}>
            {redirecting ? (
              <>
                <Loader2 className="animate-spin" /> Redirecting…
              </>
            ) : (
              <>
                <CreditCard /> Pay now
              </>
            )}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DashboardHeader title="Payments" description="Your tuition invoices and payment history. Payments are processed securely by SSLCommerz." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total due" value={formatCurrency(totalDue)} icon={Wallet} tone="warning" isLoading={isLoading} />
        <StatCard label="Total paid" value={formatCurrency(totalPaid)} icon={CircleDollarSign} tone="success" isLoading={isLoading} />
        <StatCard label="Pending invoices" value={pendingCount} icon={Receipt} isLoading={isLoading} />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Invoices</h2>
          <FilterSelect paramName="status" label="Status" allLabel="All invoices" options={STATUS_OPTIONS} />
        </div>
        <DataTable
          columns={invoiceColumns}
          rows={visibleInvoices}
          rowKey={(invoice) => invoice.id}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          onRetry={() => refetch()}
          caption="Your invoices"
          emptyTitle="No invoices"
          emptyDescription="Invoices appear here when the finance office generates them for your program."
        />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">Payment history</h2>
        <DataTable
          columns={HISTORY_COLUMNS}
          rows={history}
          rowKey={(payment) => payment.id}
          isLoading={isLoading}
          isError={isError}
          caption="Payment history"
          emptyTitle="No payments yet"
          emptyDescription="Every payment attempt, successful or not, is listed here."
        />
      </section>
    </>
  );
}