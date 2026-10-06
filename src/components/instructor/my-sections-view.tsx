"use client";

import {
  BookX,
  CalendarRange,
  ClipboardList,
  Layers,
  TriangleAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CardGridSkeleton } from "@/components/public/skeletons";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMySections } from "@/hooks/use-instructor";
import type { InstructorSection } from "@/types/instructor";

function SectionCard({ section }: { section: InstructorSection }) {
  const enrolled = section._count.registrations;
  const fill =
    section.capacity > 0
      ? Math.min(100, Math.round((enrolled / section.capacity) * 100))
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{section.course.title}</CardTitle>
          <Badge variant="outline">{section.course.code}</Badge>
        </div>
        <CardDescription>Section {section.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-center justify-between gap-2 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarRange className="size-3.5" aria-hidden="true" />
            {section.semester.name} {section.semester.year}
          </span>
          <StatusBadge status={section.semester.status} />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-muted-foreground">
            <span>Enrolled</span>
            <span className="tabular-nums">
              {enrolled} / {section.capacity}
            </span>
          </div>
          <div className="h-1.5 bg-muted" role="presentation">
            <div className="h-full bg-primary" style={{ width: `${fill}%` }} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/instructor/sections/${section.id}`}>Open section</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/instructor/sections/${section.id}/grade`}>Grade</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MySectionsView() {
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const semesterId = searchParams.get("semester") ?? "";

  const { data, isLoading, isError, refetch } = useMySections();
  const sections = data ?? [];

  const semesterOptions = [
    ...new Map(sections.map((s) => [s.semester.id, s.semester])).values(),
  ].map((semester) => ({
    value: semester.id,
    label: `${semester.name} ${semester.year}`,
  }));

  const filtered = sections.filter(
    (section) =>
      (!semesterId || section.semesterId === semesterId) &&
      (!search ||
        section.course.title.toLowerCase().includes(search) ||
        section.course.code.toLowerCase().includes(search)),
  );

  const totalStudents = sections.reduce(
    (sum, section) => sum + section._count.registrations,
    0,
  );
  const ongoing = sections.filter(
    (section) => section.semester.status === "ONGOING",
  ).length;

  if (isError) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Could not load your sections"
        description="Please try again in a moment."
      >
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <DashboardHeader
        title="My Sections"
        description="The sections assigned to you. Open one to take attendance and grade exams."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Sections"
          value={sections.length}
          icon={Layers}
          isLoading={isLoading}
        />
        <StatCard
          label="Enrolled students"
          value={totalStudents}
          icon={Users}
          tone="info"
          isLoading={isLoading}
        />
        <StatCard
          label="In ongoing semesters"
          value={ongoing}
          icon={ClipboardList}
          tone="success"
          isLoading={isLoading}
        />
      </div>

      <div className="mt-6 mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchInput placeholder="Search by course title or code" />
        <FilterSelect
          paramName="semester"
          label="Semester"
          allLabel="All semesters"
          options={semesterOptions}
        />
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="No sections found"
          description={
            sections.length === 0
              ? "No sections have been assigned to you yet."
              : "Try a different search term or semester."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      )}
    </>
  );
}
