"use client";

import { Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  type DepartmentRef,
  DepartmentScope,
} from "@/components/department-admin/department-scope";
import { SectionFormDialog } from "@/components/department-admin/section-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { SemesterFilter } from "@/components/shared/semester-filter";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import {
  useDeleteSection,
  useDepartmentSections,
} from "@/hooks/use-department";
import { usePagination } from "@/hooks/use-pagination";
import { paginate } from "@/lib/paginate";
import type { BrowseSection } from "@/types/student";

function SectionsContent({ department }: { department: DepartmentRef }) {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const semesterId = searchParams.get("semester") ?? "";

  const { data, isLoading, isFetching, isError, refetch } =
    useDepartmentSections(department.id);
  const deleteSection = useDeleteSection();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BrowseSection | null>(null);

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
      key: "seats",
      header: "Enrolled",
      cell: (section) => (
        <span className="tabular-nums">
          {section._count.registrations} / {section.capacity}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (section) => {
        // ছাত্র থাকলে মোছা যায় না, আগে result publish হয়ে (বা drop করে) সংখ্যা ০ হতে হবে
        const hasStudents = section._count.registrations > 0;
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={hasStudents}
            title={
              hasStudents
                ? "Students are still enrolled in this section"
                : undefined
            }
            onClick={() => setDeleteTarget(section)}
            aria-label={`Delete section ${section.name} of ${section.course.title}`}
          >
            <Trash2 /> Delete
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Sections"
        description={`Class sections for the Department of ${department.name}.`}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus /> New section
          </Button>
        }
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
        emptyDescription="Create a section for one of your courses, or try a different search or semester."
      />
      <TablePagination meta={isLoading ? undefined : meta} />

      <SectionFormDialog
        open={formOpen}
        department={department}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this section?"
        description={
          deleteTarget
            ? `${deleteTarget.course.title} (Section ${deleteTarget.name}) will be removed. Its instructor will no longer see it.`
            : ""
        }
        confirmLabel="Delete section"
        destructive
        isPending={deleteSection.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteSection.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
      />
    </>
  );
}

export function SectionsView() {
  return (
    <DepartmentScope>
      {(department) => <SectionsContent department={department} />}
    </DepartmentScope>
  );
}
