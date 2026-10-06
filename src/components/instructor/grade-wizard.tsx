// src/components/instructor/grade-wizard.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  FileQuestion,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { type Column, DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FormField } from "@/components/shared/form-field";
import { Stepper } from "@/components/shared/stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateExam,
  useExamResults,
  useMySections,
  useSectionExams,
  useSectionStudents,
  useSubmitResults,
} from "@/hooks/use-instructor";
import { ApiError } from "@/lib/api-client";
import { formatDate, formatDateTime, titleCase } from "@/lib/format";
import { EXAM_TYPES, type ExamValues, examSchema } from "@/lib/validation/exam";
import type { RosterStudent, SectionExam } from "@/types/instructor";

const STEPS = ["Exam", "Marks", "Review"];

type Mode = "new" | "existing";

type Entry = {
  student: RosterStudent;
  raw: string;
  number: number;
  blank: boolean;
  invalid: boolean;
};

// ---------- ধাপ ১: Exam ----------

type ExamStepProps = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  examForm: UseFormReturn<ExamValues>;
  exams: SectionExam[];
  existingExamId: string;
  onExistingChange: (id: string) => void;
};

function ExamStep({
  mode,
  onModeChange,
  examForm,
  exams,
  existingExamId,
  onExistingChange,
}: ExamStepProps) {
  const {
    register,
    control,
    formState: { errors },
  } = examForm;

  const options: {
    value: Mode;
    title: string;
    hint: string;
    disabled: boolean;
  }[] = [
    {
      value: "new",
      title: "Create a new exam",
      hint: "Set up a quiz, assignment, midterm or final, then enter marks.",
      disabled: false,
    },
    {
      value: "existing",
      title: "Grade an existing exam",
      hint:
        exams.length === 0
          ? "No exams exist for this section yet."
          : "Enter or update marks for an exam you already created.",
      disabled: exams.length === 0,
    },
  ];

  return (
    <div className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold">
          What would you like to do?
        </legend>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 border border-border p-3 has-checked:border-primary has-checked:bg-primary/5 has-disabled:cursor-not-allowed has-disabled:opacity-50"
          >
            <input
              type="radio"
              name="mode"
              className="mt-0.5 accent-primary"
              checked={mode === option.value}
              disabled={option.disabled}
              onChange={() => onModeChange(option.value)}
            />
            <span>
              <span className="block text-sm font-medium">{option.title}</span>
              <span className="block text-xs text-muted-foreground">
                {option.hint}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      {mode === "new" ? (
        <div className="space-y-4">
          <FormField
            label="Title"
            htmlFor="exam-title"
            error={errors.title?.message}
          >
            <Input
              id="exam-title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "exam-title-error" : undefined}
              {...register("title")}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Exam type"
              htmlFor="exam-type"
              hint="Final grade weights: Quiz 10%, Assignment 10%, Midterm 30%, Final 50%."
              error={errors.examType?.message}
            >
              <Controller
                control={control}
                name="examType"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="exam-type"
                      className="w-full"
                      aria-invalid={!!errors.examType}
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Total marks"
              htmlFor="exam-total"
              error={errors.totalMarks?.message}
            >
              <Input
                id="exam-total"
                inputMode="decimal"
                aria-invalid={!!errors.totalMarks}
                aria-describedby={
                  errors.totalMarks ? "exam-total-error" : undefined
                }
                {...register("totalMarks")}
              />
            </FormField>
          </div>

          <FormField
            label="Date & time"
            htmlFor="exam-date"
            error={errors.examDate?.message}
          >
            <Input
              id="exam-date"
              type="datetime-local"
              className="sm:w-64"
              aria-invalid={!!errors.examDate}
              aria-describedby={errors.examDate ? "exam-date-error" : undefined}
              {...register("examDate")}
            />
          </FormField>
        </div>
      ) : (
        <FormField label="Exam" htmlFor="existing-exam">
          <Select value={existingExamId} onValueChange={onExistingChange}>
            <SelectTrigger id="existing-exam" className="w-full">
              <SelectValue placeholder="Choose an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.title} · {titleCase(exam.examType)} ·{" "}
                  {formatDate(exam.examDate)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    </div>
  );
}

// ---------- ধাপ ২: Marks ----------

type MarksStepProps = {
  entries: Entry[];
  total: number | undefined;
  locked: boolean;
  isLoading: boolean;
  onMarkChange: (studentId: string, value: string) => void;
  onClear: () => void;
};

function MarksStep({
  entries,
  total,
  locked,
  isLoading,
  onMarkChange,
  onClear,
}: MarksStepProps) {
  const entered = entries.filter((entry) => !entry.blank).length;

  const columns: Column<Entry>[] = [
    {
      key: "student",
      header: "Student",
      cell: (entry) => (
        <div>
          <p className="font-medium">{entry.student.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {entry.student.studentId}
          </p>
        </div>
      ),
    },
    {
      key: "marks",
      header: `Marks (out of ${total ?? "—"})`,
      cell: (entry) => (
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          max={total}
          value={entry.raw}
          disabled={locked}
          onChange={(event) =>
            onMarkChange(entry.student.id, event.target.value)
          }
          aria-label={`Marks for ${entry.student.name}`}
          aria-invalid={entry.invalid}
          className={entry.invalid ? "w-28 border-destructive" : "w-28"}
        />
      ),
    },
    {
      key: "score",
      header: "Score",
      className: "hidden sm:table-cell",
      cell: (entry) =>
        entry.invalid ? (
          <span className="text-xs text-destructive">Invalid</span>
        ) : !entry.blank && total ? (
          `${Math.round((entry.number / total) * 100)}%`
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div>
      {locked && (
        <div
          role="alert"
          className="mb-4 border border-warning/50 bg-warning/10 p-3 text-xs"
        >
          Results for this exam have already been published and can no longer be
          changed.
        </div>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {entered} of {entries.length} students have a mark. Leave a mark blank
          to skip that student.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onClear}
          disabled={locked || entered === 0}
        >
          Clear all
        </Button>
      </div>
      <DataTable
        columns={columns}
        rows={entries}
        rowKey={(entry) => entry.student.id}
        isLoading={isLoading}
        caption="Marks entry"
        emptyTitle="No enrolled students"
        emptyDescription="You can still create the exam now and enter marks later, once students register."
      />
    </div>
  );
}

// ---------- ধাপ ৩: Review ----------

type ReviewStepProps = {
  summary: {
    title: string;
    type: string;
    date: string;
    total: number | undefined;
  };
  mode: Mode;
  entries: Entry[];
  filled: Entry[];
  locked: boolean;
  createdExamId: string | null;
};

function ReviewStep({
  summary,
  mode,
  entries,
  filled,
  locked,
  createdExamId,
}: ReviewStepProps) {
  const values = filled.map((entry) => entry.number);
  const average = values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
  const rows = [
    { label: "Exam", value: summary.title },
    { label: "Type", value: summary.type ? titleCase(summary.type) : "—" },
    {
      label: "Date & time",
      value: summary.date ? formatDateTime(summary.date) : "—",
    },
    { label: "Total marks", value: summary.total ?? "—" },
    {
      label: "Marks entered",
      value: `${filled.length} of ${entries.length} students`,
    },
    ...(values.length
      ? [
          { label: "Average", value: average.toFixed(1) },
          {
            label: "Highest / lowest",
            value: `${Math.max(...values)} / ${Math.min(...values)}`,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      <dl className="space-y-3 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between gap-4 border-b border-border pb-2 last:border-0"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      {entries.length - filled.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {entries.length - filled.length} student(s) have no mark and will be
          skipped. You can grade them later.
        </p>
      )}
      {filled.length === 0 && mode === "new" && (
        <p className="text-xs text-muted-foreground">
          No marks entered, so only the exam will be created.
        </p>
      )}
      {createdExamId && (
        <p
          role="status"
          className="border border-info/40 bg-info/10 p-3 text-xs"
        >
          The exam was already created. Submitting again will only send the
          marks.
        </p>
      )}
      {locked && (
        <p
          role="alert"
          className="border border-warning/50 bg-warning/10 p-3 text-xs"
        >
          Results for this exam are already published, so they cannot be
          submitted again.
        </p>
      )}
    </div>
  );
}

// ---------- মূল wizard ----------

export function GradeWizard({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const preselected = useSearchParams().get("exam") ?? "";

  const sections = useMySections();
  const students = useSectionStudents(sectionId);
  const exams = useSectionExams(sectionId);
  const createExam = useCreateExam();
  const submitResults = useSubmitResults();

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>(preselected ? "existing" : "new");
  const [existingExamId, setExistingExamId] = useState(preselected);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [createdExamId, setCreatedExamId] = useState<string | null>(null);

  const examForm = useForm<ExamValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      examType: undefined,
      totalMarks: "100",
      examDate: "",
    },
  });
  const draft = examForm.watch();

  const section = sections.data?.find((item) => item.id === sectionId);
  const examList = exams.data ?? [];
  const existingExam = examList.find((exam) => exam.id === existingExamId);
  const examResults = useExamResults(
    mode === "existing" ? existingExamId : undefined,
  );

  const existingMarks = new Map(
    (examResults.data ?? []).map((result) => [
      result.studentId,
      result.obtainedMarks,
    ]),
  );
  const locked =
    mode === "existing" &&
    (examResults.data ?? []).some((result) => result.publishedAt !== null);

  const rawTotal =
    mode === "existing" ? existingExam?.totalMarks : Number(draft.totalMarks);
  const total =
    rawTotal !== undefined && Number.isFinite(rawTotal) && rawTotal > 0
      ? rawTotal
      : undefined;

  // শিক্ষকের লেখা মান, নইলে আগে জমা দেওয়া নম্বর, নইলে ফাঁকা
  const markOf = (studentId: string) =>
    marks[studentId] ??
    (existingMarks.has(studentId) ? String(existingMarks.get(studentId)) : "");

  const entries: Entry[] = (students.data ?? []).map((student) => {
    const raw = markOf(student.id).trim();
    const number = Number(raw);
    const blank = raw === "";
    const invalid =
      !blank &&
      (!Number.isFinite(number) ||
        number < 0 ||
        (total !== undefined && number > total));
    return { student, raw, number, blank, invalid };
  });
  const filled = entries.filter((entry) => !entry.blank && !entry.invalid);
  const invalidCount = entries.filter((entry) => entry.invalid).length;

  const summary =
    mode === "existing" && existingExam
      ? {
          title: existingExam.title,
          type: existingExam.examType,
          date: existingExam.examDate,
          total: existingExam.totalMarks,
        }
      : {
          title: draft.title,
          type: draft.examType ?? "",
          date: draft.examDate ? new Date(draft.examDate).toISOString() : "",
          total,
        };

  const busy = createExam.isPending || submitResults.isPending;
  const submitBlocked =
    busy || locked || (mode === "existing" && filled.length === 0);

  const changeMode = (next: Mode) => {
    setMode(next);
    setMarks({});
  };

  const changeExisting = (id: string) => {
    setExistingExamId(id);
    setMarks({});
  };

  const goNext = async () => {
    if (step === 0) {
      if (mode === "new") {
        if (!(await examForm.trigger())) return;
      } else if (!existingExam) {
        toast.error("Please choose an exam first");
        return;
      }
    }
    if (step === 1 && invalidCount > 0) {
      toast.error("Fix the highlighted marks before continuing");
      return;
    }
    setStep((current) => current + 1);
  };

  const handleSubmit = async () => {
    try {
      let examId = mode === "existing" ? existingExamId : createdExamId;

      if (!examId) {
        const values = examForm.getValues();
        const exam = await createExam.mutateAsync({
          sectionId,
          examType: values.examType,
          title: values.title,
          totalMarks: Number(values.totalMarks),
          // datetime-local এ timezone থাকে না; এখানে ব্রাউজারের সময়কে UTC ISO তে বদলে backend এর নিয়মে পাঠাই
          examDate: new Date(values.examDate).toISOString(),
        });
        examId = exam.id;
        setCreatedExamId(exam.id);
      }

      if (filled.length > 0) {
        await submitResults.mutateAsync({
          examId,
          records: filled.map((entry) => ({
            studentId: entry.student.id,
            obtainedMarks: entry.number,
          })),
        });
      }

      toast.success(
        filled.length > 0
          ? `Results submitted for ${filled.length} student(s)`
          : "Exam created",
      );
      await queryClient.invalidateQueries({ queryKey: ["instructor"] });
      router.replace(`/instructor/sections/${sectionId}?tab=exams`);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const backLink = (
    <Link
      href={`/instructor/sections/${sectionId}`}
      className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to section
    </Link>
  );

  if (sections.isLoading || students.isLoading || exams.isLoading)
    return <PageSkeleton />;

  if (sections.isError || students.isError || exams.isError) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Could not load this section"
        description="Please try again in a moment."
      >
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          Reload
        </Button>
      </EmptyState>
    );
  }

  if (!section) {
    return (
      <>
        {backLink}
        <EmptyState
          icon={FileQuestion}
          title="Section not found"
          description="This section does not exist or is not assigned to you."
        />
      </>
    );
  }

  return (
    <>
      {backLink}
      <DashboardHeader
        title="Grade an exam"
        description={`${section.course.title} (${section.course.code}) · Section ${section.name}`}
      />

      <div className="mb-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="border border-border bg-card p-5">
        {step === 0 && (
          <ExamStep
            mode={mode}
            onModeChange={changeMode}
            examForm={examForm}
            exams={examList}
            existingExamId={existingExamId}
            onExistingChange={changeExisting}
          />
        )}
        {step === 1 && (
          <MarksStep
            entries={entries}
            total={total}
            locked={locked}
            isLoading={mode === "existing" && examResults.isLoading}
            onMarkChange={(studentId, value) =>
              setMarks((current) => ({ ...current, [studentId]: value }))
            }
            onClear={() =>
              setMarks(
                Object.fromEntries(
                  entries.map((entry) => [entry.student.id, ""]),
                ),
              )
            }
          />
        )}
        {step === 2 && (
          <ReviewStep
            summary={summary}
            mode={mode}
            entries={entries}
            filled={filled}
            locked={locked}
            createdExamId={createdExamId}
          />
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((current) => current - 1)}
          disabled={step === 0 || busy}
        >
          <ArrowLeft /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={goNext}>
            Next <ArrowRight />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitBlocked}>
            {busy ? (
              <>
                <Loader2 className="animate-spin" /> Submitting…
              </>
            ) : mode === "new" ? (
              filled.length > 0 ? (
                "Create exam & submit results"
              ) : (
                "Create exam"
              )
            ) : (
              "Submit results"
            )}
          </Button>
        )}
      </div>
    </>
  );
}
