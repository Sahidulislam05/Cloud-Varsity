"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { TablePagination } from "@/components/shared/table-pagination";
import { CourseFormDialog } from "@/components/super-admin/course-form-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCourse } from "@/hooks/use-courses";
import { useListQuery } from "@/hooks/use-list-query";
import { usePagination } from "@/hooks/use-pagination";
import { usePrograms } from "@/hooks/use-academics";
import type { Course } from "@/types/academics";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "code-asc", label: "Course code" },
  { value: "creditHours-asc", label: "Credits: low to high" },
  { value: "creditHours-desc", label: "Credits: high to low" },
];
const DEFAULT_SORT = SORT_OPTIONS[0].value;

type CoursesViewProps = { departmentId?: string; embedded?: boolean };

export function CoursesView({
  departmentId,
  embedded = false,
}: CoursesViewProps) {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination();
  const search = searchParams.get("search") ?? "";
  const programId = searchParams.get("programId") ?? undefined;
  const requestedSort = searchParams.get("sort");
  // URL এ যা-ই লেখা থাক, শুধু আমাদের তালিকার মান গ্রহণ করি
  const sort =
    SORT_OPTIONS.find((option) => option.value === requestedSort)?.value ??
    DEFAULT_SORT;
  const [sortBy, sortOrder] = sort.split("-");

  const { data: programs = [] } = usePrograms(departmentId);
  const { data, isLoading, isFetching, isError, refetch } =
    useListQuery<Course>("courses", "/courses", {
      page,
      limit,
      search,
      programId,
      sortBy,
      sortOrder,
      departmentId,
    });
  const deleteCourse = useDeleteCourse();

  const [formTarget, setFormTarget] = useState<Course | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const programNames = new Map(
    programs.map((program) => [program.id, program.name]),
  );

  const columns: Column<Course>[] = [
    {
      key: "course",
      header: "Course",
      cell: (course) => (
        <div>
          <p className="font-medium">{course.title}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {course.code}
          </p>
        </div>
      ),
    },
    {
      key: "program",
      header: "Program",
      className: "hidden md:table-cell",
      cell: (course) => programNames.get(course.programId) ?? "—",
    },
    { key: "credits", header: "Credits", cell: (course) => course.creditHours },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (course) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFormTarget(course)}
            aria-label={`Edit ${course.title}`}
          >
            <Pencil /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteTarget(course)}
            aria-label={`Delete ${course.title}`}
          >
            <Trash2 /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const newCourseButton = (
    <Button onClick={() => setFormTarget("new")}>
      <Plus /> New course
    </Button>
  );

  return (
    <>
      {embedded ? (
        <div className="mb-4 flex justify-end">{newCourseButton}</div>
      ) : (
        <DashboardHeader
          title="Courses"
          description="Create and manage the course catalog across every program."
          actions={newCourseButton}
        />
      )}

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <SearchInput placeholder="Search by course title or code" />
        <FilterSelect
          paramName="programId"
          label="Program"
          allLabel="All programs"
          options={programs.map((program) => ({
            value: program.id,
            label: program.name,
          }))}
        />
        <FilterSelect
          paramName="sort"
          label="Sort by"
          options={SORT_OPTIONS}
          defaultValue={DEFAULT_SORT}
        />
      </div>

      <DataTable
        columns={columns}
        rows={data?.data}
        rowKey={(course) => course.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Courses"
        emptyTitle="No courses found"
        emptyDescription="Try a different search term or program, or create a new course."
      />
      <TablePagination meta={data?.meta} />

      <CourseFormDialog
        target={formTarget}
        programs={programs}
        onClose={() => setFormTarget(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this course?"
        description={
          deleteTarget
            ? `${deleteTarget.title} (${deleteTarget.code}) will be removed from the catalog. Existing records are kept.`
            : ""
        }
        confirmLabel="Delete course"
        destructive
        isPending={deleteCourse.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteCourse.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
      />
    </>
  );
}
