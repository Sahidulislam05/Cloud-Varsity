import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Program } from "@/types/academics";

type ProgramCardProps = {
  program: Program;
  departmentName?: string;
  active?: boolean;
};

export function ProgramCard({
  program,
  departmentName,
  active = false,
}: ProgramCardProps) {
  return (
    <Card className={active ? "ring-2 ring-primary" : undefined}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{program.name}</CardTitle>
          <Badge variant="secondary">{program.code}</Badge>
        </div>
        <CardDescription>{departmentName ?? "—"}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {program.durationSemesters} semesters ({program.durationSemesters / 2}{" "}
          years)
        </span>
        <Link
          href={`/programs?programId=${program.id}#courses`}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          View courses <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
