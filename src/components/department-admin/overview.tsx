// src/components/department-admin/overview.tsx
"use client";

import { ClipboardList, Layers, Library, Presentation, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { type DepartmentRef, DepartmentScope } from "@/components/department-admin/department-scope";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useDepartmentSections, useInstructors } from "@/hooks/use-department";
import { usePrograms } from "@/hooks/use-academics";
import { useTotal } from "@/hooks/use-total";
import { formatNumber } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import type { BrowseSection } from "@/types/student";

const fillRatio = (section: BrowseSection) => (section.capacity > 0 ? section._count.registrations / section.capacity : 0);

const COLUMNS: Column<BrowseSection>[] = [
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
    key: "seats",
    header: "Seats filled",
    cell: (section) => {
      const percent = Math.min(100, Math.round(fillRatio(section) * 100));
      return (
        <div className="min-w-28">
          <p className="text-xs tabular-nums">
            {section._count.registrations} / {section.capacity}
          </p>
          <div className="mt-1 h-1.5 bg-muted" role="presentation">
            <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
        </div>
      );
    },
  },
];

function OverviewContent({ department }: { department: DepartmentRef }) {
  const user = useAuthStore((state) => state.user);
  const programs = usePrograms(department.id);
  const instructors = useInstructors();
  const sections = useDepartmentSections(department.id);
  const courseTotal = useTotal(["courses", "count", "department", department.id], "/courses", { departmentId: department.id });
  // /enrollment backend নিজেই Department Admin কে শুধু নিজের department এর registration দেখায় (Phase 5)
  const enrollmentTotal = useTotal(["registrations", "count", "department"], "/enrollment", { status: "ENROLLED" });

  const firstName = user?.name.split(" ")[0] ?? "";
  const busiest = [...(sections.data ?? [])].sort((a, b) => fillRatio(b) - fillRatio(a)).slice(0, 6);

  return (
    <>
      <DashboardHeader title={`Welcome back, ${firstName}`} description={`Department of ${department.name} (${department.code})`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Programs" value={programs.data && formatNumber(programs.data.length)} icon={Layers} isLoading={programs.isLoading} />
        <StatCard label="Courses" value={courseTotal.data !== undefined ? formatNumber(courseTotal.data) : null} icon={Library} tone="info" isLoading={courseTotal.isLoading} />
        <StatCard label="Instructors" value={instructors.data && formatNumber(instructors.data.length)} icon={Presentation} tone="accent" isLoading={instructors.isLoading} />
        <StatCard label="Sections" value={sections.data && formatNumber(sections.data.length)} icon={Users} tone="info" isLoading={sections.isLoading} />
        <StatCard label="Active enrollments" value={enrollmentTotal.data !== undefined ? formatNumber(enrollmentTotal.data) : null} icon={ClipboardList} tone="success" isLoading={enrollmentTotal.isLoading} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">Busiest sections</h2>
        <DataTable
          columns={COLUMNS}
          rows={busiest}
          rowKey={(section) => section.id}
          isLoading={sections.isLoading}
          isError={sections.isError}
          onRetry={() => sections.refetch()}
          skeletonRows={4}
          caption="Busiest sections"
          emptyTitle="No sections yet"
          emptyDescription="Create sections from the Sections page and they will show up here."
        />
      </section>
    </>
  );
}

export function DepartmentOverview() {
  return <DepartmentScope>{(department) => <OverviewContent department={department} />}</DepartmentScope>;
}