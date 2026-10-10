import { Building2, Layers, Library, TriangleAlert } from "lucide-react";
import { CourseCard } from "@/components/public/course-card";
import { ProgramCard } from "@/components/public/program-card";
import { HeroSection } from "@/components/home/hero-section";
import {
  Band,
  FaqSection,
  FeaturesSection,
  FinalCtaSection,
  RolesSection,
  SecuritySection,
  StepsSection,
} from "@/components/home/static-sections";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getCourses, getDepartments, getPrograms } from "@/lib/public-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "CloudVarsity — Digital University Management",
  description:
    "Register for courses, track attendance and results, and pay tuition online. CloudVarsity connects students, instructors and administrators in one secure platform.",
  path: "/",
  absoluteTitle: true,
});

// API ডাউন থাকলে "কিছু নেই" বলা ভুল বার্তা, তাই "পাওয়া যাচ্ছে না" আলাদা করে বলি
function Unavailable({ what }: { what: string }) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title={`${what} are temporarily unavailable`}
      description="We could not load this section right now. Please refresh in a moment."
    />
  );
}

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
      <HeroSection stats={stats} />

      <FeaturesSection />

      <Band muted>
        <Reveal>
          <SectionHeading
            title="Programs"
            description="Degree programs offered across our departments."
            href="/programs"
            linkLabel="View all programs"
          />
        </Reveal>
        {programsRes === null ? (
          <Unavailable what="Programs" />
        ) : programs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 6).map((program, index) => (
              <Reveal
                key={program.id}
                delay={Math.min(index, 5) * 80}
                className="h-full"
              >
                <ProgramCard
                  program={program}
                  departmentName={departmentNames.get(program.departmentId)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Library}
            title="No programs published yet"
            description="Programs will appear here as soon as the administration adds them."
          />
        )}
      </Band>

      <StepsSection />

      <RolesSection />

      <Band>
        <Reveal>
          <SectionHeading
            title="Latest courses"
            description="A look at what students can register for."
            href="/programs#courses"
            linkLabel="Browse the catalog"
          />
        </Reveal>
        {coursesRes === null ? (
          <Unavailable what="Courses" />
        ) : courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <Reveal
                key={course.id}
                delay={Math.min(index, 5) * 80}
                className="h-full"
              >
                <CourseCard
                  course={course}
                  programName={programNames.get(course.programId)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Library}
            title="No courses available yet"
            description="Courses will be listed here once departments publish them."
          />
        )}
      </Band>

      <SecuritySection />

      <FaqSection />

      <FinalCtaSection />
    </>
  );
}
