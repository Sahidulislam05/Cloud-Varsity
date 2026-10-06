
"use client";

import { Loader2, UsersRound } from "lucide-react";
import { useState } from "react";
import { type Column, DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarkAttendance, useSectionAttendance, useSectionStudents } from "@/hooks/use-instructor";
import { todayLocal } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RosterStudent } from "@/types/instructor";
import type { AttendanceStatus } from "@/types/student";


const OPTIONS: { value: AttendanceStatus; label: string; active: string }[] = [
  { value: "PRESENT", label: "Present", active: "border-success bg-success/15 text-foreground" },
  { value: "LATE", label: "Late", active: "border-warning bg-warning/20 text-foreground" },
  { value: "ABSENT", label: "Absent", active: "border-destructive bg-destructive/15 text-foreground" },
];

type AttendanceFormProps = {
  sectionId: string;
  date: string;
  students: RosterStudent[];
  saved: Map<string, AttendanceStatus>;
};

function AttendanceForm({ sectionId, date, students, saved }: AttendanceFormProps) {
  const markAttendance = useMarkAttendance();
  const [overrides, setOverrides] = useState<Record<string, AttendanceStatus>>({});

  
  const statusOf = (studentId: string): AttendanceStatus => overrides[studentId] ?? saved.get(studentId) ?? "PRESENT";
  const setStatus = (studentId: string, status: AttendanceStatus) => setOverrides((current) => ({ ...current, [studentId]: status }));
  const setAll = (status: AttendanceStatus) => setOverrides(Object.fromEntries(students.map((student) => [student.id, status])));

  const counts = { PRESENT: 0, LATE: 0, ABSENT: 0 };
  for (const student of students) counts[statusOf(student.id)] += 1;

  const handleSave = () =>
    markAttendance.mutate({
      sectionId,
      date,
      records: students.map((student) => ({ studentId: student.id, status: statusOf(student.id) })),
    });

  const columns: Column<RosterStudent>[] = [
    {
      key: "student",
      header: "Student",
      cell: (student) => (
        <div>
          <p className="font-medium">{student.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{student.studentId}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (student) => (
        <div role="radiogroup" aria-label={`Attendance for ${student.name}`} className="flex gap-1">
          {OPTIONS.map((option) => {
            const active = statusOf(student.id) === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStatus(student.id, option.value)}
                className={cn(
                  "border px-2.5 py-1 text-xs font-medium transition-colors",
                  active ? option.active : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Present {counts.PRESENT} · Late {counts.LATE} · Absent {counts.ABSENT}
        </p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setAll("PRESENT")}>
            All present
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setAll("ABSENT")}>
            All absent
          </Button>
        </div>
      </div>

      <DataTable columns={columns} rows={students} rowKey={(student) => student.id} caption="Attendance sheet" />

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave} disabled={markAttendance.isPending}>
          {markAttendance.isPending ? (
            <>
              <Loader2 className="animate-spin" /> Saving…
            </>
          ) : (
            "Save attendance"
          )}
        </Button>
      </div>
    </>
  );
}

export function AttendanceTab({ sectionId }: { sectionId: string }) {
  const [date, setDate] = useState(todayLocal);
  const students = useSectionStudents(sectionId);
  const existing = useSectionAttendance(sectionId, date);

  const saved = new Map((existing.data ?? []).map((record) => [record.studentId, record.status]));
  const loading = students.isLoading || existing.isLoading;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <FormField label="Class date" htmlFor="attendance-date">
          <Input
            id="attendance-date"
            type="date"
            value={date}
            max={todayLocal()}
            onChange={(event) => event.target.value && setDate(event.target.value)}
            className="w-44"
          />
        </FormField>
        {saved.size > 0 && (
          <p className="pb-2 text-xs text-muted-foreground">Attendance for this date is already saved. Saving again updates it.</p>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (students.data ?? []).length === 0 ? (
        <EmptyState icon={UsersRound} title="No enrolled students" description="Students appear here once they register for this section." />
      ) : (
        // key বদলালে (তারিখ বদলালে, বা সেভের পর নতুন ডেটা এলে) ফর্ম নতুন করে শুরু হয়, পুরনো বদল মুছে যায়
        <AttendanceForm
          key={`${date}-${existing.dataUpdatedAt}`}
          sectionId={sectionId}
          date={date}
          students={students.data ?? []}
          saved={saved}
        />
      )}
    </>
  );
}