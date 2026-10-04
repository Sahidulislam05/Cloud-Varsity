
"use client";

import { Award, CalendarRange, Layers, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { useMyTranscript } from "@/hooks/use-student";
import type { TranscriptCourse } from "@/types/student";

const COLUMNS: Column<TranscriptCourse>[] = [
  { key: "code", header: "Code", cell: (course) => <span className="font-mono text-xs">{course.courseCode}</span> },
  { key: "title", header: "Course", cell: (course) => course.courseTitle },
  { key: "credits", header: "Credits", cell: (course) => course.creditHours },
  { key: "grade", header: "Grade", cell: (course) => course.gradeLetter ?? "—" },
  { key: "point", header: "Grade point", className: "hidden sm:table-cell", cell: (course) => course.gradePoint?.toFixed(2) ?? "—" },
];

export function TranscriptView() {
  const { data, isLoading, isError, refetch } = useMyTranscript();

  if (isError) {
    return (
      <EmptyState icon={TriangleAlert} title="Could not load your transcript" description="Please try again in a moment.">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  const creditsAttempted = data?.semesters.reduce(
    (total, semester) => total + semester.courses.reduce((sum, course) => sum + course.creditHours, 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="CGPA" value={data?.cgpa?.toFixed(2) ?? "—"} icon={Award} tone="success" isLoading={isLoading} />
        <StatCard label="Semesters completed" value={data?.semesters.length} icon={CalendarRange} tone="info" isLoading={isLoading} />
        <StatCard label="Credits attempted" value={creditsAttempted} icon={Layers} isLoading={isLoading} />
      </div>

      {!isLoading && data?.semesters.length === 0 && (
        <EmptyState
          icon={Award}
          title="No completed courses yet"
          description="Your transcript fills in as the registrar publishes results for each semester."
        />
      )}

      {data?.semesters.map((semester) => (
        <section key={semester.semester}>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">{semester.semester}</h2>
            <p className="text-xs text-muted-foreground">Semester GPA {semester.semesterGpa.toFixed(2)}</p>
          </div>
          <DataTable
            columns={COLUMNS}
            rows={semester.courses}
            rowKey={(course) => course.courseCode}
            caption={`${semester.semester} results`}
          />
        </section>
      ))}
    </div>
  );
}