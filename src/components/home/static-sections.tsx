import {
  ChevronDown,
  CreditCard,
  Lock,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { CAPABILITIES, ROLES } from "@/config/site-content";
import { cn } from "@/lib/utils";

export function Band({
  muted = false,
  children,
}: {
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(muted && "border-y border-border bg-secondary/40")}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">{children}</div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <Band>
      <Reveal>
        <SectionHeading
          title="Everything your university needs"
          description="Registration, teaching, grading and payments work together, so nothing is entered twice."
        />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 80} className="h-full">
            <article className="group h-full border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md motion-reduce:transform-none">
              <span className="flex size-10 items-center justify-center bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}

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

export function StepsSection() {
  return (
    <Band>
      <Reveal>
        <SectionHeading
          title="How it works"
          description="From sign-up to graduation in three simple steps."
        />
      </Reveal>
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 120} className="h-full">
              <div className="h-full border border-border bg-card p-5">
                <span className="flex size-8 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Band>
  );
}

export function RolesSection() {
  return (
    <Band muted>
      <Reveal>
        <SectionHeading
          title="A dashboard for every role"
          description="Six roles, each with exactly the tools it needs."
          href="/login"
          linkLabel="Try a demo account"
        />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role, index) => (
          <Reveal key={role.name} delay={index * 80} className="h-full">
            <article
              className={cn(
                "h-full border border-l-4 border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none",
                role.accent,
              )}
            >
              <h3 className="text-sm font-semibold">{role.name}</h3>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {role.points.slice(0, 2).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}

const SECURITY = [
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Six roles, each limited to what it needs. A deactivated account loses access immediately.",
  },
  {
    icon: CreditCard,
    title: "Verified payments",
    description:
      "Every payment is confirmed with SSLCommerz before an invoice is marked as paid.",
  },
  {
    icon: ScrollText,
    title: "Full audit trail",
    description:
      "Status changes, result publishing and payments are recorded with who did what and when.",
  },
  {
    icon: Lock,
    title: "Fair registration",
    description:
      "Seat limits hold even when many students register at the same moment.",
  },
];

export function SecuritySection() {
  return (
    <section className="bg-linear-to-br from-primary to-brand-accent text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Built to be trusted
          </h2>
          <p className="mt-1 max-w-xl text-sm">
            Academic records and money deserve more than a login screen.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100}>
              <span className="flex size-10 items-center justify-center bg-white/15">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    question: "Who can create an account?",
    answer:
      "Students register themselves from the sign-up page. Instructor, department admin, registrar and finance accounts are created by the university administration.",
  },
  {
    question: "How does course registration work?",
    answer:
      "Browse the open sections, check the seats left and register. Prerequisites and seat limits are verified automatically, and seats are locked so two students can never take the last one.",
  },
  {
    question: "How do I pay my tuition?",
    answer:
      "Open the Payments page and pay an invoice online through SSLCommerz. The payment is verified with the gateway before the invoice is marked as paid.",
  },
  {
    question: "How is my GPA calculated?",
    answer:
      "Each course grade combines quizzes (10%), assignments (10%), midterm (30%) and final (50%) exams, converted to grade points on a 4.00 scale. Your CGPA is the credit-weighted average of all completed courses.",
  },
  {
    question: "Can I drop a course?",
    answer:
      "Yes. You can drop an enrolled course from My Courses until the semester is completed, and register again later if seats are available.",
  },
  {
    question: "Who can see my records?",
    answer:
      "Access is role-based: you see your own data, instructors see only their own sections, and administrators see what their role requires. Sensitive actions are written to an audit log.",
  },
];

export function FaqSection() {
  return (
    <Band>
      <Reveal>
        <SectionHeading
          title="Frequently asked questions"
          description="Quick answers about accounts, registration and payments."
        />
      </Reveal>
      <Reveal className="mx-auto max-w-3xl">
        {/* native <details>: JS ছাড়াই খোলে-বন্ধ হয়, কিবোর্ড (Enter/Space) আর screen reader এ নিজে থেকেই সঠিক */}
        <div className="divide-y divide-border border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </Band>
  );
}

export function FinalCtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <div
        className="pointer-events-none absolute -top-16 -right-16 -z-10 size-56 bg-white/10 blur-2xl motion-safe:animate-float"
        aria-hidden="true"
      />
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">
              Ready to get started?
            </h2>
            <p className="mt-1 text-sm">
              Create your student account and register for your first course
              today.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-10 px-5 text-sm"
            >
              <Link href="/register">Create an account</Link>
            </Button>
            <Link
              href="/login"
              className="text-xs underline underline-offset-4 hover:no-underline"
            >
              or explore with a demo account
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
