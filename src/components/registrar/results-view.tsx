"use client";

import { FileCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { SemesterFilter } from "@/components/shared/semester-filter";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { useAllSections, usePublishResults } from "@/hooks/use-registrar";
import { paginate } from "@/lib/paginate";
import type { BrowseSection } from "@/types/student";

export function ResultsView() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const semesterId = searchParams.get("semester") ?? "";

  const { data, isLoading, isFetching, isError, refetch } = useAllSections();
  const publish = usePublishResults();
  const [target, setTarget] = useState<BrowseSection | null>(null);

  const filtered = (data ?? []).filter(
    (section) =>
      (!semesterId || section.semesterId === semesterId) &&
      (!search ||
        section.course.title.toLowerCase().includes(search) ||
        section.course.code.toLowerCase().includes(search)),
  );
  const { rows, meta } = paginate(filtered, page, limit);

  const columns: Column<BrowseSection>[] = [
    {
      key: "course",
      header: "Course",
      cell: (section) => (
        <div>
          <p className="font-medium">{section.course.title}</p>
          <p className="text-xs text-muted-foreground">
            {section.course.code} · Section {section.name}
          </p>
        </div>
      ),
    },
    {
      key: "semester",
      header: "Semester",
      className: "hidden md:table-cell",
      cell: (section) => (
        <div className="flex flex-col items-start gap-1">
          <span>
            {section.semester.name} {section.semester.year}
          </span>
          <StatusBadge status={section.semester.status} />
        </div>
      ),
    },
    {
      key: "instructor",
      header: "Instructor",
      className: "hidden lg:table-cell",
      cell: (section) => section.instructor.user.name,
    },
    {
      key: "active",
      header: "Active enrollments",
      cell: (section) => (
        <span className="tabular-nums">{section._count.registrations}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (section) => {
        const nothingToPublish = section._count.registrations === 0;
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={nothingToPublish || publish.isPending}
            title={
              nothingToPublish
                ? "No active enrollments: nobody registered, or results are already published"
                : undefined
            }
            onClick={() => setTarget(section)}
          >
            <FileCheck /> Publish results
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Publish Results"
        description="Finalise a section's results once its instructor has submitted all marks."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchInput placeholder="Search by course title or code" />
        <SemesterFilter />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(section) => section.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Sections"
        emptyTitle="No sections found"
        emptyDescription="Sections appear here once departments create them."
      />
      <TablePagination meta={isLoading ? undefined : meta} />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Publish results for this section?"
        description={
          target
            ? `${target.course.title} (Section ${target.name}): grades and CGPA are calculated for ${target._count.registrations} student(s) and they are notified. Marks become final and this cannot be undone.`
            : ""
        }
        confirmLabel="Publish results"
        isPending={publish.isPending}
        onConfirm={() =>
          target &&
          publish.mutate(target.id, { onSuccess: () => setTarget(null) })
        }
      />
    </>
  );
}
