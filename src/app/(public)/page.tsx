import {
  ArrowRight,
  Building2,
  GraduationCap,
  Layers,
  Library,
} from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/public/course-card";
import { ProgramCard } from "@/components/public/program-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourses, getDepartments, getPrograms } from "@/lib/public-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CloudVarsity — Digital University Management",
  description:
    "Register for courses, track attendance and results, and pay tuition online. CloudVarsity connects students, instructors and administrators in one secure platform.",
  path: "/",
  absoluteTitle: true,
});

const STEPS = [
  {
    title: "Create your account",
    description:
      "Register as a student and pick your program in a couple of minutes.",
  },
  {
    title: "Register for courses",
    description:
      "Choose sections with open seats. Prerequisites are checked for you.",
  },
  {
    title: "Track your progress",
    description:
      "Follow attendance, results and GPA, and pay tuition online, all in one place.",
  },
];

export default async function HomePage() {
  // একটা fail করলেও বাকিগুলো দেখানো যাবে, তাই প্রতিটায় আলাদা .catch
  const [programsRes, departmentsRes, coursesRes] = await Promise.all([
    getPrograms().catch(() => null),
    getDepartments().catch(() => null),
    getCourses({ limit: 6 }).catch(() => null),
  ]);

  const programs = programsRes?.data ?? [];
  const departments = departmentsRes?.data ?? [];
  const courses = coursesRes?.data ?? [];
  const departmentNames = new Map(
    departments.map((department) => [department.id, department.name]),
  );
  const programNames = new Map(
    programs.map((program) => [program.id, program.name]),
  );

  const stats = [
    {
      label: "Departments",
      value: departmentsRes ? departments.length : null,
      icon: Building2,
    },
    {
      label: "Programs",
      value: programsRes ? programs.length : null,
      icon: Layers,
    },
    { label: "Courses", value: coursesRes?.meta?.total ?? null, icon: Library },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-brand-accent/15"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="gap-1.5">
              <GraduationCap className="size-3.5" aria-hidden="true" />
              Digital University Management
            </Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              One platform for every step of university life
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              From course registration and attendance to results, GPA and
              tuition payments, CloudVarsity connects students, instructors and
              administrators in a single, secure system.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-10 px-5 text-sm">
                <Link href="/register">
                  Get Started <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-10 px-5 text-sm"
              >
                <Link href="/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-px border border-border bg-border">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-card p-5">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <dt className="mt-3 text-xs text-muted-foreground">{label}</dt>
                <dd className="text-3xl font-bold tabular-nums">
                  {value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          title="Programs"
          description="Degree programs offered across our departments."
          href="/programs"
          linkLabel="View all programs"
        />
        {programs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 6).map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                departmentName={departmentNames.get(program.departmentId)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Library}
            title="No programs published yet"
            description="Programs will appear here as soon as the administration adds them."
          />
        )}
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading
            title="Latest courses"
            description="A look at what students can register for."
            href="/programs#courses"
            linkLabel="Browse the catalog"
          />
          {courses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  programName={programNames.get(course.programId)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Library}
              title="No courses available yet"
              description="Courses will be listed here once departments publish them."
            />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          title="How it works"
          description="From sign-up to graduation in three simple steps."
        />
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border border-border bg-card p-5">
              <span className="flex size-7 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">
              Ready to get started?
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Create your student account and register for your first course
              today.
            </p>
          </div>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="h-10 px-5 text-sm"
          >
            <Link href="/register">Create an account</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
