"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type DepartmentRef } from "@/components/department-admin/department-scope";
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
import { useSemesters } from "@/hooks/use-academics";
import {
  useCreateSection,
  useDepartmentCourses,
  useInstructors,
} from "@/hooks/use-department";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import { type SectionValues, sectionSchema } from "@/lib/validation/department";

function SectionForm({
  department,
  onDone,
}: {
  department: DepartmentRef;
  onDone: () => void;
}) {
  const courses = useDepartmentCourses(department.id);
  const semesters = useSemesters();
  const instructors = useInstructors();
  const createSection = useCreateSection();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SectionValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      courseId: "",
      semesterId: "",
      instructorId: "",
      capacity: "40",
    },
  });

  const onSubmit = async (values: SectionValues) => {
    try {
      await createSection.mutateAsync({
        name: values.name,
        courseId: values.courseId,
        semesterId: values.semesterId,
        instructorId: values.instructorId,
        capacity: Number(values.capacity),
      });
      onDone();
    } catch (error) {
      if (
        applyApiErrors(error, setError, [
          "name",
          "courseId",
          "semesterId",
          "instructorId",
          "capacity",
        ])
      )
        return;

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      // "This section already exists for this course and semester" এলে নামের ঘরের নিচে দেখাই
      if (/already exists/i.test(message))
        setError("name", { type: "server", message });
      else toast.error(message);
    }
  };

  // শেষ হয়ে যাওয়া semester এ নতুন section বানানোর মানে হয় না
  const openSemesters = (semesters.data ?? []).filter(
    (semester) => semester.status !== "COMPLETED",
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField
        label="Course"
        htmlFor="section-course"
        error={errors.courseId?.message}
      >
        <Controller
          control={control}
          name="courseId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={courses.isLoading}
            >
              <SelectTrigger
                id="section-course"
                className="w-full"
                aria-invalid={!!errors.courseId}
              >
                <SelectValue
                  placeholder={
                    courses.isLoading ? "Loading courses…" : "Select a course"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(courses.data ?? []).map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} · {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Semester"
          htmlFor="section-semester"
          error={errors.semesterId?.message}
        >
          <Controller
            control={control}
            name="semesterId"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={semesters.isLoading}
              >
                <SelectTrigger
                  id="section-semester"
                  className="w-full"
                  aria-invalid={!!errors.semesterId}
                >
                  <SelectValue placeholder="Select a semester" />
                </SelectTrigger>
                <SelectContent>
                  {openSemesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name} {semester.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label="Instructor"
          htmlFor="section-instructor"
          error={errors.instructorId?.message}
        >
          <Controller
            control={control}
            name="instructorId"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={instructors.isLoading}
              >
                <SelectTrigger
                  id="section-instructor"
                  className="w-full"
                  aria-invalid={!!errors.instructorId}
                >
                  <SelectValue
                    placeholder={
                      instructors.isLoading
                        ? "Loading…"
                        : "Select an instructor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(instructors.data ?? []).map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.user.name} · {instructor.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Section name"
          htmlFor="section-name"
          hint="e.g. A"
          error={errors.name?.message}
        >
          <Input
            id="section-name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "section-name-error" : undefined}
            {...register("name")}
          />
        </FormField>
        <FormField
          label="Capacity"
          htmlFor="section-capacity"
          hint="Maximum number of students"
          error={errors.capacity?.message}
        >
          <Input
            id="section-capacity"
            inputMode="numeric"
            aria-invalid={!!errors.capacity}
            aria-describedby={
              errors.capacity ? "section-capacity-error" : undefined
            }
            {...register("capacity")}
          />
        </FormField>
      </div>

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
              <Loader2 className="animate-spin" /> Creating…
            </>
          ) : (
            "Create section"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

type SectionFormDialogProps = {
  open: boolean;
  department: DepartmentRef;
  onClose: () => void;
};

export function SectionFormDialog({
  open,
  department,
  onClose,
}: SectionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New section</DialogTitle>
          <DialogDescription>
            Open a section of one of your courses and assign an instructor from
            your department.
          </DialogDescription>
        </DialogHeader>
        {open && <SectionForm department={department} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
