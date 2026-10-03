import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "@/types/academics";

type CourseCardProps = { course: Course; programName?: string };

export function CourseCard({ course, programName }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{course.title}</CardTitle>
          <Badge variant="outline">{course.code}</Badge>
        </div>
        <CardDescription>{programName ?? "—"}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <BookOpen className="size-3.5" aria-hidden="true" />
        {course.creditHours} credit hours
      </CardContent>
    </Card>
  );
}
