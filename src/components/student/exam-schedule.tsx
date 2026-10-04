
"use client";

import { type Column, DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useMyExams } from "@/hooks/use-student";
import { formatDateTime, titleCase } from "@/lib/format";
import type { ExamRow } from "@/types/student";

const COLUMNS: Column<ExamRow>[] = [
  { key: "date", header: "Date & time", cell: (exam) => formatDateTime(exam.examDate) },
  {
    key: "course",
    header: "Course",
    cell: (exam) => (
      <div>
        <p className="font-medium">{exam.section.course.title}</p>
        <p className="text-xs text-muted-foreground">{exam.section.course.code}</p>
      </div>
    ),
  },
  {
    key: "exam",
    header: "Exam",
    className: "hidden md:table-cell",
    cell: (exam) => `${exam.title} · ${titleCase(exam.examType)}`,
  },
  { key: "marks", header: "Total marks", className: "hidden md:table-cell", cell: (exam) => exam.totalMarks },
  {
    key: "status",
    header: "Status",
    cell: (exam) => {
      const upcoming = new Date(exam.examDate) > new Date();
      return <StatusBadge status={upcoming ? "UPCOMING" : "COMPLETED"} label={upcoming ? "Upcoming" : "Done"} />;
    },
  },
];

export function ExamSchedule() {
  const { data, isLoading, isFetching, isError, refetch } = useMyExams();

  return (
    <DataTable
      columns={COLUMNS}
      rows={data}
      rowKey={(exam) => exam.id}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={() => refetch()}
      caption="Exam schedule"
      emptyTitle="No exams scheduled"
      emptyDescription="Exams for your enrolled courses will appear here once your instructors create them."
    />
  );
}