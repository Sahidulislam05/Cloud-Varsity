import { ArrowRight, GraduationCap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/home/count-up";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type HeroStat = { label: string; value: number | null; icon: LucideIcon };

export function HeroSection({ stats }: { stats: HeroStat[] }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-brand-accent/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 -z-10 size-72 bg-primary/15 blur-3xl motion-safe:animate-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-64 bg-brand-accent/15 blur-3xl motion-safe:animate-float [animation-delay:-3s]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge
            variant="secondary"
            className="gap-1.5 motion-safe:animate-fade-up"
          >
            <GraduationCap className="size-3.5" aria-hidden="true" />
            Digital University Management
          </Badge>
          <h1
            className="mt-4 text-3xl font-bold tracking-tight motion-safe:animate-fade-up sm:text-5xl"
            style={{ animationDelay: "100ms" }}
          >
            One platform for every step of university life
          </h1>
          <p
            className="mt-4 max-w-xl text-sm text-muted-foreground motion-safe:animate-fade-up sm:text-base"
            style={{ animationDelay: "200ms" }}
          >
            From course registration and attendance to results, GPA and tuition
            payments, CloudVarsity connects students, instructors and
            administrators in a single, secure system.
          </p>
          <div
            className="mt-8 flex flex-wrap gap-3 motion-safe:animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
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
              <Link href="/login">Try a demo</Link>
            </Button>
          </div>
        </div>

        <dl
          className="grid grid-cols-3 gap-px border border-border bg-border motion-safe:animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card p-3 sm:p-5">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <dt className="mt-3 text-[11px] text-muted-foreground sm:text-xs">
                {label}
              </dt>
              <dd className="text-2xl font-bold tabular-nums sm:text-3xl">
                {value === null ? "—" : <CountUp value={value} />}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
