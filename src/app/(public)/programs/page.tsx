import { BookX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CourseCard } from "@/components/public/course-card";
import { ProgramCard } from "@/components/public/program-card";
import { CardGridSkeleton } from "@/components/public/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourses, getDepartments, getPrograms } from "@/lib/public-data";
import { getPageParam, getParam } from "@/lib/search-params";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Programs & Courses",
  description:
    "Browse every degree program and search the full course catalog by title, code, program and credit hours.",
  path: "/programs",
});

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "code-asc", label: "Course code" },
  { value: "creditHours-asc", label: "Credits: low to high" },
  { value: "creditHours-desc", label: "Credits: high to low" },
];
const DEFAULT_SORT = SORT_OPTIONS[0].value;

type CourseResultsProps = {
  page: number;
  search: string;
  programId?: string;
  sort: string;
  programNames: Map<string, string>;
};

async function CourseResults({
  page,
  search,
  programId,
  sort,
  programNames,
}: CourseResultsProps) {
  const [sortBy, sortOrder] = sort.split("-");
  const { data: courses, meta } = await getCourses({
    page,
    limit: PAGE_SIZE,
    search,
    programId,
    sortBy,
    sortOrder,
  });

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookX}
        title="No courses found"
        description="Try a different search term or clear your filters."
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/programs#courses">Clear filters</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <p className="mb-4 text-xs text-muted-foreground">
        {meta?.total ?? courses.length}{" "}
        {(meta?.total ?? courses.length) === 1 ? "course" : "courses"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            programName={programNames.get(course.programId)}
          />
        ))}
      </div>
      <div className="mt-8">
        <Suspense fallback={null}>
          <Pagination
            page={meta?.page ?? page}
            totalPages={meta?.totalPages ?? 1}
            anchor="courses"
          />
        </Suspense>
      </div>
    </>
  );
}

export default async function ProgramsPage(props: PageProps<"/programs">) {
  const searchParams = await props.searchParams;

  const page = getPageParam(searchParams);
  const search = getParam(searchParams, "search")?.trim() ?? "";
  const programId = getParam(searchParams, "programId");
  const requestedSort = getParam(searchParams, "sort");
  // URL এ যা-ই লেখা থাক, শুধু আমাদের তালিকার মান গ্রহণ করি
  const sort =
    SORT_OPTIONS.find((option) => option.value === requestedSort)?.value ??
    DEFAULT_SORT;

  const [programsRes, departmentsRes] = await Promise.all([
    getPrograms(),
    getDepartments(),
  ]);
  const programs = programsRes.data;
  const departmentNames = new Map(
    departmentsRes.data.map((department) => [department.id, department.name]),
  );
  const programNames = new Map(
    programs.map((program) => [program.id, program.name]),
  );
  const activeProgram = programs.find((program) => program.id === programId);

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Programs & Courses"
        description="Explore our degree programs, then search the course catalog to see what each program offers."
      />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          title="Programs"
          description="Select a program to filter the course catalog below."
        />
        {programs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                departmentName={departmentNames.get(program.departmentId)}
                active={program.id === programId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookX}
            title="No programs published yet"
            description="Programs will appear here once the administration adds them."
          />
        )}
      </section>

      <section
        id="courses"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16"
      >
        <SectionHeading
          title="Course catalog"
          description={
            activeProgram
              ? `Showing courses in ${activeProgram.name}`
              : "Search and filter every course on offer."
          }
        />

        <Suspense fallback={<Skeleton className="mb-6 h-8 w-full" />}>
          <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <SearchInput placeholder="Search by course title or code" />
            <FilterSelect
              paramName="programId"
              label="Program"
              allLabel="All programs"
              options={programs.map((program) => ({
                value: program.id,
                label: program.name,
              }))}
            />
            <FilterSelect
              paramName="sort"
              label="Sort by"
              options={SORT_OPTIONS}
              defaultValue={DEFAULT_SORT}
            />
          </div>
        </Suspense>

        <Suspense
          key={`${page}|${search}|${programId ?? ""}|${sort}`}
          fallback={<CardGridSkeleton count={PAGE_SIZE} />}
        >
          <CourseResults
            page={page}
            search={search}
            programId={programId}
            sort={sort}
            programNames={programNames}
          />
        </Suspense>
      </section>
    </>
  );
}
