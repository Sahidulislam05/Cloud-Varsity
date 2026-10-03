import { Award, Layers, MapPin, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { getDepartments, getUniversities } from "@/lib/public-data";
import { createMetadata } from "@/lib/seo";
import { Building2 } from "lucide-react";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn how CloudVarsity connects registration, attendance, results and payments in one secure university platform.",
  path: "/about",
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Security first",
    description: "Role-based access, verified payments and a full audit trail protect every record.",
  },
  {
    icon: Layers,
    title: "One connected system",
    description: "Registration, attendance, results and finance share a single source of truth.",
  },
  {
    icon: Award,
    title: "Academic integrity",
    description: "Grades follow transparent rules and are published only after review.",
  },
];

export default async function AboutPage() {
  const [universitiesRes, departmentsRes] = await Promise.all([
    getUniversities().catch(() => null),
    getDepartments().catch(() => null),
  ]);
  const university = universitiesRes?.data[0];
  const departments = departmentsRes?.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="About CloudVarsity"
        title="Built to make university administration simple"
        description="One secure platform that replaces scattered spreadsheets, paper forms and disconnected tools."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Our mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            CloudVarsity brings the whole academic cycle into one system. Students register for courses and pay
            fees online, instructors record attendance and results, and administrators keep every semester running
            smoothly. Every action is protected by role-based access and recorded in an audit trail, so records stay
            accurate and accountable.
          </p>
        </div>

        {university && (
          <div className="border border-border bg-card p-6">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">The university</p>
            <h3 className="mt-2 text-lg font-semibold">{university.name}</h3>
            {university.address && (
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {university.address}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="What we stand for" />
          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="border border-border bg-card p-5">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading title="Our departments" description="The academic units that make up the university." />
        {departments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <div key={department.id} className="flex items-start justify-between gap-2 border border-border bg-card p-4">
                <h3 className="text-sm font-semibold">{department.name}</h3>
                <Badge variant="secondary">{department.code}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No departments listed yet"
            description="Departments will appear here once the administration adds them."
          />
        )}
      </section>
    </>
  );
}