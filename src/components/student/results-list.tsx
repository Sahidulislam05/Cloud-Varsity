
"use client";

import { type Column, DataTable } from "@/components/shared/data-table";
import { useMyResults } from "@/hooks/use-student";
import { formatDate, titleCase } from "@/lib/format";
import type { ResultRow } from "@/types/student";

const COLUMNS: Column<ResultRow>[] = [
  {
    key: "course",
    header: "Course",
    cell: (result) => (
      <div>
        <p className="font-medium">{result.exam.section.course.title}</p>
        <p className="text-xs text-muted-foreground">{result.exam.section.course.code}</p>
      </div>
    ),
  },
  {
    key: "exam",
    header: "Exam",
    cell: (result) => (
      <div>
        <p>{result.exam.title}</p>
        <p className="text-xs text-muted-foreground">{titleCase(result.exam.examType)}</p>
      </div>
    ),
  },
  { key: "date", header: "Date", className: "hidden md:table-cell", cell: (result) => formatDate(result.exam.examDate) },
  {
    key: "marks",
    header: "Marks",
    cell: (result) => (
      <span className="tabular-nums">
        {result.obtainedMarks} / {result.exam.totalMarks}
      </span>
    ),
  },
  {
    key: "percent",
    header: "Score",
    className: "hidden sm:table-cell",
    cell: (result) => `${Math.round((result.obtainedMarks / result.exam.totalMarks) * 100)}%`,
  },
];

export function ResultsList() {
  const { data, isLoading, isFetching, isError, refetch } = useMyResults();

  return (
    <DataTable
      columns={COLUMNS}
      rows={data}
      rowKey={(result) => result.id}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={() => refetch()}
      caption="Published exam results"
      emptyTitle="No published results yet"
      emptyDescription="Results appear here after the registrar publishes them."
    />
  );
}