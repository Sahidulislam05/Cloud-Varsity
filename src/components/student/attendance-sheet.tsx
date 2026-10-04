
"use client";

import { CalendarX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMyAttendance } from "@/hooks/use-student";
import { formatDate } from "@/lib/format";
import type { AttendanceData, Registration } from "@/types/student";

const COLUMNS: Column<AttendanceData["records"][number]>[] = [
  { key: "date", header: "Date", cell: (record) => formatDate(record.date) },
  { key: "status", header: "Status", cell: (record) => <StatusBadge status={record.status} /> },
];

type AttendanceSheetProps = { registration: Registration | null; onClose: () => void };

export function AttendanceSheet({ registration, onClose }: AttendanceSheetProps) {
  const { data, isLoading, isError, refetch } = useMyAttendance(registration?.sectionId);

  return (
    <Sheet open={registration !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{registration?.section.course.title}</SheetTitle>
          <SheetDescription>
            Section {registration?.section.name} · {registration?.section.semester.name} {registration?.section.semester.year}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Attendance"
              value={data && `${data.summary.presentPercentage}%`}
              hint="Present + late"
              icon={CalendarX}
              tone="primary"
              isLoading={isLoading}
            />
            <StatCard label="Classes held" value={data?.summary.totalClasses} icon={CalendarX} tone="info" isLoading={isLoading} />
            <StatCard label="Present / Late" value={data && `${data.summary.present} / ${data.summary.late}`} icon={CalendarX} tone="success" isLoading={isLoading} />
            <StatCard label="Absent" value={data?.summary.absent} icon={CalendarX} tone="warning" isLoading={isLoading} />
          </div>

          <DataTable
            columns={COLUMNS}
            rows={data?.records}
            rowKey={(record) => record.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            skeletonRows={5}
            caption="Attendance records"
            emptyTitle="No attendance recorded"
            emptyDescription="Your instructor has not marked attendance for this section yet."
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}