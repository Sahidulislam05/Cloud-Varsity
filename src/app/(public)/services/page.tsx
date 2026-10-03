import { Award, Bell, CalendarCheck, ChartColumn, ClipboardCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Explore what CloudVarsity offers students, instructors, department admins, the registrar, finance office and administrators.",
  path: "/services",
});

// Tailwind শুধু সম্পূর্ণ লেখা class নাম খুঁজে পায়, তাই `border-l-role-${x}` জোড়া দিয়ে বানানো যাবে না
const ROLES = [
  {
    name: "Student",
    accent: "border-l-role-student",
    points: [
      "Register and drop courses with live seat availability",
      "Track attendance, results, GPA and your transcript",
      "Pay tuition online and keep a payment history",
    ],
  },
  {
    name: "Instructor",
    accent: "border-l-role-instructor",
    points: [
      "View assigned sections and enrolled students",
      "Mark attendance and schedule exams",
      "Submit results for every exam",
    ],
  },
  {
    name: "Department Admin",
    accent: "border-l-role-department-admin",
    points: [
      "Manage programs, courses and sections in your department",
      "Review course registrations",
      "Monitor departmental activity",
    ],
  },
  {
    name: "Registrar",
    accent: "border-l-role-registrar",
    points: [
      "Open, run and close semesters",
      "Monitor registrations university-wide",
      "Publish final results and official transcripts",
    ],
  },
  {
    name: "Finance Admin",
    accent: "border-l-role-finance-admin",
    points: [
      "Create fee structures per program and semester",
      "Generate invoices for students",
      "Track payments and financial reports",
    ],
  },
  {
    name: "Super Admin",
    accent: "border-l-role-super-admin",
    points: [
      "Manage every user and role",
      "View dashboard statistics and reports",
      "Inspect the full audit log",
    ],
  },
];

const CAPABILITIES = [
  {
    icon: ClipboardCheck,
    title: "Safe course registration",
    description: "Seat limits and prerequisites hold even when many students register at the same moment.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance tracking",
    description: "Instructors mark a whole class at once, and students see their attendance percentage.",
  },
  {
    icon: Award,
    title: "Results and GPA",
    description: "Weighted grading turns exam marks into grades, semester GPA and a complete transcript.",
  },
  {
    icon: CreditCard,
    title: "Online payments",
    description: "Tuition is paid through SSLCommerz and verified with the gateway before an invoice is marked paid.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "In-app notices and emails for registrations, payments and published results.",
  },
  {
    icon: ChartColumn,
    title: "Reports and audit trail",
    description: "Enrollment, attendance, result and finance reports, plus a log of every sensitive action.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Built for every role in your university"
        description="Each person gets a dashboard shaped around their work, nothing more and nothing less."
      />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading title="Six roles, six dashboards" description="Strict role-based access keeps data in the right hands." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <article key={role.name} className={`border border-l-4 border-border bg-card p-5 ${role.accent}`}>
              <h3 className="text-sm font-semibold">{role.name}</h3>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="Platform capabilities" description="The features that work behind every dashboard." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="border border-border bg-card p-5">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">See your dashboard in action</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Log in with a demo account for any role and explore the platform yourself.
        </p>
        <Button asChild size="lg" className="mt-6 h-10 px-5 text-sm">
          <Link href="/login">Go to login</Link>
        </Button>
      </section>
    </>
  );
}