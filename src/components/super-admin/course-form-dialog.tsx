// src/components/super-admin/course-form-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCourse,
  useProgramCourses,
  useUpdateCourse,
} from "@/hooks/use-courses";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";

import type { Course, Program } from "@/types/academics";
import { courseSchema, CourseValues } from "@/lib/validation/course";

type CourseFormProps = {
  course: Course | null;
  programs: Program[];
  onDone: () => void;
};

function CourseForm({ course, programs, onDone }: CourseFormProps) {
  const isEdit = course !== null;
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? "",
      code: course?.code ?? "",
      creditHours: course ? String(course.creditHours) : "",
      programId: course?.programId ?? "",
      prerequisiteCourseIds: [],
    },
  });

  const programId = watch("programId");
  const { data: options, isLoading: optionsLoading } = useProgramCourses(
    isEdit ? undefined : programId,
  );

  // program বদলালে আগে বেছে নেওয়া prerequisite অর্থহীন হয়ে যায়
  useEffect(() => {
    if (!isEdit) setValue("prerequisiteCourseIds", []);
  }, [programId, isEdit, setValue]);

  const onSubmit = async (values: CourseValues) => {
    try {
      const creditHours = Number(values.creditHours);
      if (course) {
        await updateCourse.mutateAsync({
          id: course.id,
          title: values.title,
          code: values.code,
          creditHours,
        });
      } else {
        await createCourse.mutateAsync({
          title: values.title,
          code: values.code,
          creditHours,
          programId: values.programId,
          prerequisiteCourseIds: values.prerequisiteCourseIds,
        });
      }
      onDone();
    } catch (error) {
      if (
        applyApiErrors(error, setError, [
          "title",
          "code",
          "creditHours",
          "programId",
        ])
      )
        return;

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      // "Course code already exists" বা "Duplicate key error" এলে code ঘরের নিচেই দেখাই
      if (/code|duplicate/i.test(message))
        setError("code", { type: "server", message });
      else toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField label="Title" htmlFor="title" error={errors.title?.message}>
        <Input
          id="title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          {...register("title")}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Course code"
          htmlFor="code"
          hint="e.g. CSE201"
          error={errors.code?.message}
        >
          <Input
            id="code"
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? "code-error" : undefined}
            {...register("code")}
          />
        </FormField>
        <FormField
          label="Credit hours"
          htmlFor="creditHours"
          hint="0.5 to 10"
          error={errors.creditHours?.message}
        >
          <Input
            id="creditHours"
            inputMode="decimal"
            aria-invalid={!!errors.creditHours}
            aria-describedby={
              errors.creditHours ? "creditHours-error" : undefined
            }
            {...register("creditHours")}
          />
        </FormField>
      </div>

      <FormField
        label="Program"
        htmlFor="programId"
        error={errors.programId?.message}
      >
        <Controller
          control={control}
          name="programId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isEdit}
            >
              <SelectTrigger
                id="programId"
                className="w-full"
                aria-invalid={!!errors.programId}
              >
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      {!isEdit && (
        <FormField
          label="Prerequisites"
          htmlFor="prerequisites"
          optional
          hint="Students must complete these before registering."
        >
          <Controller
            control={control}
            name="prerequisiteCourseIds"
            render={({ field }) => (
              <div
                id="prerequisites"
                className="max-h-40 space-y-1 overflow-y-auto border border-border p-2"
              >
                {!programId ? (
                  <p className="text-xs text-muted-foreground">
                    Select a program first.
                  </p>
                ) : optionsLoading ? (
                  <p className="text-xs text-muted-foreground">
                    Loading courses…
                  </p>
                ) : options && options.length > 0 ? (
                  options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <input
                        type="checkbox"
                        className="size-3.5 accent-primary"
                        checked={field.value.includes(option.id)}
                        onChange={(event) =>
                          field.onChange(
                            event.target.checked
                              ? [...field.value, option.id]
                              : field.value.filter((id) => id !== option.id),
                          )
                        }
                      />
                      <span className="font-mono">{option.code}</span>{" "}
                      {option.title}
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This program has no other courses yet.
                  </p>
                )}
              </div>
            )}
          />
        </FormField>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Saving…
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create course"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

type CourseFormDialogProps = {
  target: Course | "new" | null;
  programs: Program[];
  onClose: () => void;
};

export function CourseFormDialog({
  target,
  programs,
  onClose,
}: CourseFormDialogProps) {
  const course = target !== null && target !== "new" ? target : null;

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{course ? "Edit course" : "New course"}</DialogTitle>
          <DialogDescription>
            {course
              ? "Update the course details. The program and prerequisites cannot be changed."
              : "Add a course to a program. Students can register once a section is created for it."}
          </DialogDescription>
        </DialogHeader>

        {target !== null && (
          <CourseForm course={course} programs={programs} onDone={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
