"use client";

import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { useListQuery } from "@/hooks/use-list-query";
import { usePagination } from "@/hooks/use-pagination";
import { useAllSections } from "@/hooks/use-registrar";
import { formatDate } from "@/lib/format";
import type { RegistrationRow } from "@/types/management";

const STATUS_OPTIONS = [
  { value: "ENROLLED", label: "Enrolled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DROPPED", label: "Dropped" },
];

const COLUMNS: Column<RegistrationRow>[] = [
  {
    key: "student",
    header: "Student",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.student.user.name}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {row.student.studentId}
        </p>
      </div>
    ),
  },
  {
    key: "course",
    header: "Course",
    cell: (row) => (
      <div>
        <p>{row.section.course.title}</p>
        <p className="text-xs text-muted-foreground">
          {row.section.course.code} · Section {row.section.name}
        </p>
      </div>
    ),
  },
  {
    key: "semester",
    header: "Semester",
    className: "hidden md:table-cell",
    cell: (row) => `${row.section.semester.name} ${row.section.semester.year}`,
  },
  {
    key: "registered",
    header: "Registered",
    className: "hidden lg:table-cell",
    cell: (row) => formatDate(row.registeredAt),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <div className="flex flex-col items-start gap-1">
        <StatusBadge status={row.status} />
        {row.status === "COMPLETED" && row.finalGradeLetter && (
          <span className="text-xs text-muted-foreground">
            Grade {row.finalGradeLetter}
          </span>
        )}
      </div>
    ),
  },
];

export function RegistrationsView() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const status = searchParams.get("status") ?? undefined;
  const sectionId = searchParams.get("section") ?? undefined;

  const { data: sections = [] } = useAllSections();
  const { data, isLoading, isFetching, isError, refetch } =
    useListQuery<RegistrationRow>("registrations", "/enrollment", {
      page,
      limit,
      status,
      sectionId,
    });

  const sectionOptions = sections.map((section) => ({
    value: section.id,
    label: `${section.course.code} · Section ${section.name} · ${section.semester.name} ${section.semester.year}`,
  }));

  return (
    <>
      <DashboardHeader
        title="Registrations"
        description="Monitor every course registration across the university."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <FilterSelect
          paramName="section"
          label="Section"
          allLabel="All sections"
          options={sectionOptions}
        />
        <FilterSelect
          paramName="status"
          label="Status"
          allLabel="All statuses"
          options={STATUS_OPTIONS}
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={data?.data}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Course registrations"
        emptyTitle="No registrations found"
        emptyDescription="Try a different section or status filter."
      />
      <TablePagination meta={data?.meta} />
    </>
  );
}
