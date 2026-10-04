"use client";

import {
  Award,
  CircleDollarSign,
  ClipboardCheck,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { StatCard } from "@/components/shared/stat-card";
import { TablePagination } from "@/components/shared/table-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSemesters, usePrograms } from "@/hooks/use-academics";
import { useListQuery } from "@/hooks/use-list-query";
import { usePagination } from "@/hooks/use-pagination";
import { useReport } from "@/hooks/use-reports";
import { useUrlParams } from "@/hooks/use-url-params";
import { summarizeChange } from "@/lib/audit";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  titleCase,
} from "@/lib/format";
import { paginate } from "@/lib/paginate";
import { ROLE_LABEL } from "@/lib/roles";
import type {
  AttendanceReportRow,
  AuditLog,
  EnrollmentReportRow,
  FinanceReport,
  ResultReport,
} from "@/types/admin";

const TABS = [
  { value: "audit", label: "Audit Log" },
  { value: "enrollment", label: "Enrollment" },
  { value: "attendance", label: "Attendance" },
  { value: "results", label: "Results" },
  { value: "finance", label: "Finance" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// audit log এ যেসব entity এর নাম লেখা হয় (backend এর AuditService.logAction কলগুলো থেকে)
const ENTITY_OPTIONS = ["User", "Semester", "Course", "Section", "Invoice"].map(
  (name) => ({ value: name, label: name }),
);

const AUDIT_COLUMNS: Column<AuditLog>[] = [
  { key: "when", header: "When", cell: (log) => formatDateTime(log.createdAt) },
  {
    key: "actor",
    header: "Actor",
    cell: (log) =>
      log.user ? (
        <div>
          <p className="font-medium">{log.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABEL[log.user.role]}
          </p>
        </div>
      ) : (
        <span className="text-muted-foreground">System</span>
      ),
  },
  { key: "action", header: "Action", cell: (log) => titleCase(log.action) },
  {
    key: "entity",
    header: "Entity",
    className: "hidden md:table-cell",
    cell: (log) => (
      <div>
        <p>{log.entityName}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {log.entityId.slice(0, 8)}…
        </p>
      </div>
    ),
  },
  {
    key: "changes",
    header: "Changes",
    className: "hidden lg:table-cell",
    cell: (log) => {
      const summary = summarizeChange(log.oldValue, log.newValue);
      return (
        <span
          className="line-clamp-2 max-w-xs text-xs text-muted-foreground"
          title={summary}
        >
          {summary}
        </span>
      );
    },
  },
];

function AuditLogTab() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination(15);
  const entityName = searchParams.get("entity") ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } =
    useListQuery<AuditLog>("audit-logs", "/admin/audit-logs", {
      page,
      limit,
      entityName,
    });

  return (
    <>
      <div className="mb-4">
        <FilterSelect
          paramName="entity"
          label="Entity"
          allLabel="All entities"
          options={ENTITY_OPTIONS}
        />
      </div>
      <DataTable
        columns={AUDIT_COLUMNS}
        rows={data?.data}
        rowKey={(log) => log.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Audit log"
        emptyTitle="No audit entries"
        emptyDescription="Sensitive actions such as status changes, result publishing and payments are recorded here."
      />
      <TablePagination meta={data?.meta} />
    </>
  );
}

function SemesterFilter() {
  const { data: semesters = [] } = useSemesters();

  return (
    <FilterSelect
      paramName="semester"
      label="Semester"
      allLabel="All semesters"
      options={semesters.map((semester) => ({
        value: semester.id,
        label: `${semester.name} ${semester.year}`,
      }))}
    />
  );
}

const ENROLLMENT_COLUMNS: Column<EnrollmentReportRow>[] = [
  {
    key: "course",
    header: "Course",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.courseTitle}</p>
        <p className="text-xs text-muted-foreground">
          {row.courseCode} · Section {row.section}
        </p>
      </div>
    ),
  },
  {
    key: "semester",
    header: "Semester",
    className: "hidden md:table-cell",
    cell: (row) => row.semester,
  },
  {
    key: "enrolled",
    header: "Enrolled",
    cell: (row) => (
      <span className="tabular-nums">
        {row.enrolled} / {row.capacity}
      </span>
    ),
  },
  {
    key: "seats",
    header: "Seats left",
    className: "hidden sm:table-cell",
    cell: (row) => row.seatsRemaining,
  },
];

function EnrollmentTab() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const semester = searchParams.get("semester") ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } = useReport<
    EnrollmentReportRow[]
  >("enrollment", { semesterId: semester });
  const { rows, meta } = paginate(data ?? [], page, limit);

  return (
    <>
      <div className="mb-4">
        <SemesterFilter />
      </div>
      <DataTable
        columns={ENROLLMENT_COLUMNS}
        rows={rows}
        rowKey={(row) => `${row.courseCode}-${row.section}-${row.semester}`}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Enrollment report"
        emptyTitle="No sections found"
        emptyDescription="Sections appear here once departments create them."
      />
      <TablePagination meta={isLoading ? undefined : meta} />
    </>
  );
}

const ATTENDANCE_COLUMNS: Column<AttendanceReportRow>[] = [
  {
    key: "course",
    header: "Course",
    cell: (row) => <span className="font-medium">{row.courseCode}</span>,
  },
  { key: "section", header: "Section", cell: (row) => row.section },
  {
    key: "records",
    header: "Records",
    className: "hidden sm:table-cell",
    cell: (row) => row.totalRecords,
  },
  {
    key: "average",
    header: "Average attendance",
    cell: (row) => (
      <span className="tabular-nums">{row.averageAttendancePercentage}%</span>
    ),
  },
];

function AttendanceTab() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const semester = searchParams.get("semester") ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } = useReport<
    AttendanceReportRow[]
  >("attendance", { semesterId: semester });
  const { rows, meta } = paginate(data ?? [], page, limit);

  return (
    <>
      <div className="mb-4">
        <SemesterFilter />
      </div>
      <DataTable
        columns={ATTENDANCE_COLUMNS}
        rows={rows}
        rowKey={(row) => `${row.courseCode}-${row.section}`}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Attendance report"
        emptyTitle="No attendance data"
        emptyDescription="Instructors' attendance records are summarised here per section."
      />
      <TablePagination meta={isLoading ? undefined : meta} />
    </>
  );
}

function ResultsTab() {
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId") ?? undefined;
  const { data: programs = [] } = usePrograms();
  const { data, isLoading } = useReport<ResultReport>("results", { programId });

  return (
    <>
      <div className="mb-4">
        <FilterSelect
          paramName="programId"
          label="Program"
          allLabel="All programs"
          options={programs.map((program) => ({
            value: program.id,
            label: program.name,
          }))}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Graded course records"
          value={data && formatNumber(data.totalRecordsGraded)}
          icon={ClipboardCheck}
          isLoading={isLoading}
        />
        <StatCard
          label="Pass rate"
          value={data && `${data.passRate}%`}
          icon={TrendingUp}
          tone="success"
          isLoading={isLoading}
        />
        <StatCard
          label="Average GPA"
          value={data?.averageGpa.toFixed(2)}
          icon={Award}
          tone="accent"
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

function FinanceTab() {
  const searchParams = useSearchParams();
  const semester = searchParams.get("semester") ?? undefined;
  const { data, isLoading } = useReport<FinanceReport>("finance", {
    semesterId: semester,
  });

  return (
    <>
      <div className="mb-4">
        <SemesterFilter />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      </div>
    </>
  );
}

export function ReportsView() {
  const searchParams = useSearchParams();
  const { setParams } = useUrlParams();

  const requested = searchParams.get("tab");
  const tab: TabValue =
    TABS.find((item) => item.value === requested)?.value ?? "audit";

  // tab বদলালে আগের tab এর সব filter মুছে যায়
  const handleTabChange = (next: string) =>
    setParams({
      tab: next === "audit" ? null : next,
      entity: null,
      semester: null,
      programId: null,
    });

  return (
    <>
      <DashboardHeader
        title="Audit & Reports"
        description="Who changed what, plus enrollment, attendance, result and finance summaries."
      />

      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="overflow-x-auto">
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="audit" className="mt-4">
          <AuditLogTab />
        </TabsContent>
        <TabsContent value="enrollment" className="mt-4">
          <EnrollmentTab />
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <AttendanceTab />
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          <ResultsTab />
        </TabsContent>
        <TabsContent value="finance" className="mt-4">
          <FinanceTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
