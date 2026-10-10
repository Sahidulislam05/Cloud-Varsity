"use client";

import { CalendarCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AttendanceSheet } from "@/components/student/attendance-sheet";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useDropCourse, useMyRegistrations } from "@/hooks/use-student";
import type { Registration } from "@/types/student";

const STATUS_OPTIONS = [
  { value: "ENROLLED", label: "Enrolled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DROPPED", label: "Dropped" },
];

export function RegisteredCourses() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";

  const { data, isLoading, isFetching, isError, refetch } =
    useMyRegistrations();
  const dropCourse = useDropCourse();
  const [dropTarget, setDropTarget] = useState<Registration | null>(null);
  const [attendanceTarget, setAttendanceTarget] = useState<Registration | null>(
    null,
  );

  const rows = (data ?? []).filter(
    (registration) => !status || registration.status === status,
  );

  const columns: Column<Registration>[] = [
    {
      key: "course",
      header: "Course",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.section.course.title}</p>
          <p className="text-xs text-muted-foreground">
            {r.section.course.code} · Section {r.section.name}
          </p>
        </div>
      ),
    },
    {
      key: "semester",
      header: "Semester",
      className: "hidden md:table-cell",
      cell: (r) => `${r.section.semester.name} ${r.section.semester.year}`,
    },
    {
      key: "instructor",
      header: "Instructor",
      className: "hidden lg:table-cell",
      cell: (r) => r.section.instructor.user.name,
    },
    {
      key: "credits",
      header: "Credits",
      className: "hidden md:table-cell",
      cell: (r) => r.section.course.creditHours,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge status={r.status} />
          {r.status === "COMPLETED" && r.finalGradeLetter && (
            <span className="text-xs text-muted-foreground">
              Grade {r.finalGradeLetter} ({r.finalGradePoint?.toFixed(2)})
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAttendanceTarget(r)}
          >
            <CalendarCheck /> Attendance
          </Button>
          {r.status === "ENROLLED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDropTarget(r)}
            >
              Drop
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <FilterSelect
          paramName="status"
          label="Status"
          allLabel="All statuses"
          options={STATUS_OPTIONS}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        caption="Your course registrations"
        emptyTitle={
          status ? "No matching registrations" : "No registrations yet"
        }
        emptyDescription={
          status
            ? "Try a different status filter."
            : "Open the Browse & Register tab to find sections with open seats."
        }
      />

      <ConfirmDialog
        open={dropTarget !== null}
        onOpenChange={(open) => !open && setDropTarget(null)}
        title="Drop this course?"
        description={
          dropTarget
            ? `You will be removed from ${dropTarget.section.course.title} (Section ${dropTarget.section.name}). You can register again later if seats are available.`
            : ""
        }
        confirmLabel="Drop course"
        destructive
        isPending={dropCourse.isPending}
        onConfirm={() =>
          dropTarget &&
          dropCourse.mutate(dropTarget.id, {
            onSuccess: () => setDropTarget(null),
          })
        }
      />

      <AttendanceSheet
        registration={attendanceTarget}
        onClose={() => setAttendanceTarget(null)}
      />
    </>
  );
}
