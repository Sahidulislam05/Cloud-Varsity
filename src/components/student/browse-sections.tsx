"use client";

import {
  BookX,
  CalendarRange,
  Loader2,
  TriangleAlert,
  UserRound,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CardGridSkeleton } from "@/components/public/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { TablePagination } from "@/components/shared/table-pagination";
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
import { usePagination } from "@/hooks/use-pagination";
import {
  useMyRegistrations,
  useRegisterCourse,
  useSections,
} from "@/hooks/use-student";
import { paginate } from "@/lib/paginate";
import { cn } from "@/lib/utils";
import type { BrowseSection, Registration } from "@/types/student";

const PAGE_SIZE = 9;

type SectionCardProps = {
  section: BrowseSection;
  registration: Registration | undefined;
  isPending: boolean;
  disabled: boolean;
  onRegister: () => void;
};

function SectionCard({
  section,
  registration,
  isPending,
  disabled,
  onRegister,
}: SectionCardProps) {
  const seatsLeft = section.capacity - section._count.registrations;
  const full = seatsLeft <= 0;

  let label =
    registration?.status === "DROPPED" ? "Register again" : "Register";
  let blocked = false;
  if (registration?.status === "ENROLLED") {
    label = "Registered";
    blocked = true;
  } else if (registration?.status === "COMPLETED") {
    label = "Completed";
    blocked = true;
  } else if (full) {
    label = "Full";
    blocked = true;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{section.course.title}</CardTitle>
          <Badge variant="outline">{section.course.code}</Badge>
        </div>
        <CardDescription>
          Section {section.name} · {section.course.creditHours} credits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <CalendarRange className="size-3.5" aria-hidden="true" />
          {section.semester.name} {section.semester.year}
        </p>
        <p className="flex items-center gap-1.5">
          <UserRound className="size-3.5" aria-hidden="true" />
          {section.instructor.user.name}
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5",
            full && "font-medium text-destructive",
          )}
        >
          <Users className="size-3.5" aria-hidden="true" />
          {full
            ? "No seats left"
            : `${seatsLeft} of ${section.capacity} seats left`}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          className="w-full"
          disabled={blocked || disabled}
          onClick={onRegister}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Registering…
            </>
          ) : (
            label
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BrowseSections() {
  const searchParams = useSearchParams();
  const { page, limit } = usePagination(PAGE_SIZE);
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const semesterId = searchParams.get("semester") ?? "";

  const sectionsQuery = useSections();
  const registrationsQuery = useMyRegistrations();
  const register = useRegisterCourse();

  const registrationBySection = new Map(
    (registrationsQuery.data ?? []).map((r) => [r.sectionId, r]),
  );

  const openSections = (sectionsQuery.data ?? []).filter(
    (section) => section.semester.status !== "COMPLETED",
  );

  const semesterOptions = [
    ...new Map(openSections.map((s) => [s.semester.id, s.semester])).values(),
  ].map((semester) => ({
    value: semester.id,
    label: `${semester.name} ${semester.year}`,
  }));

  const filtered = openSections.filter(
    (section) =>
      (!semesterId || section.semesterId === semesterId) &&
      (!search ||
        section.course.title.toLowerCase().includes(search) ||
        section.course.code.toLowerCase().includes(search)),
  );
  const { rows, meta } = paginate(filtered, page, limit);

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchInput placeholder="Search by course title or code" />
        <FilterSelect
          paramName="semester"
          label="Semester"
          allLabel="All semesters"
          options={semesterOptions}
        />
      </div>

      {sectionsQuery.isLoading ? (
        <CardGridSkeleton count={PAGE_SIZE} />
      ) : sectionsQuery.isError ? (
        <EmptyState
          icon={TriangleAlert}
          title="Could not load sections"
          description="Please try again in a moment."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => sectionsQuery.refetch()}
          >
            Try again
          </Button>
        </EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="No sections found"
          description={
            openSections.length === 0
              ? "No sections are open for registration right now."
              : "Try a different search term or semester."
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                registration={registrationBySection.get(section.id)}
                isPending={
                  register.isPending && register.variables === section.id
                }
                disabled={register.isPending}
                onRegister={() => register.mutate(section.id)}
              />
            ))}
          </div>
          <TablePagination meta={meta} />
        </>
      )}
    </>
  );
}
