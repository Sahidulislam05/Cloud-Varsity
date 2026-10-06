"use client";

import {
  ArrowLeft,
  ClipboardList,
  FileQuestion,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AttendanceTab } from "@/components/instructor/attendance-tab";
import { type Column, DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMySections,
  useSectionExams,
  useSectionStudents,
} from "@/hooks/use-instructor";
import { useUrlParams } from "@/hooks/use-url-params";
import { formatDateTime, titleCase } from "@/lib/format";
import type { RosterStudent, SectionExam } from "@/types/instructor";

const TABS = [
  { value: "students", label: "Students" },
  { value: "attendance", label: "Attendance" },
  { value: "exams", label: "Exams" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const STUDENT_COLUMNS: Column<RosterStudent>[] = [
  {
    key: "id",
    header: "Student ID",
    cell: (student) => (
      <span className="font-mono text-xs">{student.studentId}</span>
    ),
  },
  {
    key: "name",
    header: "Name",
    cell: (student) => <span className="font-medium">{student.name}</span>,
  },
  {
    key: "email",
    header: "Email",
    className: "hidden sm:table-cell",
    cell: (student) => student.email,
  },
];

function StudentsTab({ sectionId }: { sectionId: string }) {
  const { data, isLoading, isFetching, isError, refetch } =
    useSectionStudents(sectionId);

  return (
    <DataTable
      columns={STUDENT_COLUMNS}
      rows={data}
      rowKey={(student) => student.id}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={() => refetch()}
      caption="Enrolled students"
      emptyTitle="No enrolled students"
      emptyDescription="Students appear here once they register for this section."
    />
  );
}

function ExamsTab({ sectionId }: { sectionId: string }) {
  const { data, isLoading, isFetching, isError, refetch } =
    useSectionExams(sectionId);

  const columns: Column<SectionExam>[] = [
    {
      key: "exam",
      header: "Exam",
      cell: (exam) => (
        <div>
          <p className="font-medium">{exam.title}</p>
          <p className="text-xs text-muted-foreground">
            {titleCase(exam.examType)}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & time",
      cell: (exam) => formatDateTime(exam.examDate),
    },
    {
      key: "marks",
      header: "Total marks",
      className: "hidden sm:table-cell",
      cell: (exam) => exam.totalMarks,
    },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      cell: (exam) => (
        <Button asChild size="sm" variant="outline">
          <Link
            href={`/instructor/sections/${sectionId}/grade?exam=${exam.id}`}
          >
            Grade
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={data}
      rowKey={(exam) => exam.id}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={() => refetch()}
      caption="Exams"
      emptyTitle="No exams yet"
      emptyDescription="Use “Grade results” to create the first exam for this section."
    />
  );
}

export function SectionWorkspace({ sectionId }: { sectionId: string }) {
  const searchParams = useSearchParams();
  const { setParams } = useUrlParams();
  const { data: sections, isLoading, isError, refetch } = useMySections();

  const section = sections?.find((item) => item.id === sectionId);

  const requested = searchParams.get("tab");
  const tab: TabValue =
    TABS.find((item) => item.value === requested)?.value ?? "students";

  const backLink = (
    <Link
      href="/instructor"
      className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" /> My sections
    </Link>
  );

  if (isLoading) {
    return (
      <>
        {backLink}
        <Skeleton className="mb-6 h-12 w-72" />
        <Skeleton className="h-64 w-full" />
      </>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Could not load this section"
        description="Please try again in a moment."
      >
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  if (!section) {
    return (
      <>
        {backLink}
        <EmptyState
          icon={FileQuestion}
          title="Section not found"
          description="This section does not exist or is not assigned to you."
        />
      </>
    );
  }

  return (
    <>
      {backLink}
      <DashboardHeader
        title={`${section.course.title} · Section ${section.name}`}
        description={`${section.course.code} · ${section.semester.name} ${section.semester.year} · ${section._count.registrations} of ${section.capacity} seats filled`}
        actions={
          <>
            <StatusBadge status={section.semester.status} />
            <Button asChild>
              <Link href={`/instructor/sections/${sectionId}/grade`}>
                <ClipboardList /> Grade results
              </Link>
            </Button>
          </>
        }
      />

      <Tabs
        value={tab}
        onValueChange={(next) =>
          setParams({ tab: next === "students" ? null : next })
        }
      >
        <TabsList>
          {TABS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <StudentsTab sectionId={sectionId} />
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <AttendanceTab sectionId={sectionId} />
        </TabsContent>
        <TabsContent value="exams" className="mt-4">
          <ExamsTab sectionId={sectionId} />
        </TabsContent>
      </Tabs>
    </>
  );
}
