// src/components/registrar/semester-form-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useCreateSemester } from "@/hooks/use-registrar";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import {
  SEMESTER_TERMS,
  semesterSchema,
  SemesterValues,
} from "@/lib/validation/semester";

function SemesterForm({ onDone }: { onDone: () => void }) {
  const createSemester = useCreateSemester();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SemesterValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: undefined,
      year: String(new Date().getFullYear()),
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (values: SemesterValues) => {
    try {
      await createSemester.mutateAsync({
        name: values.name,
        year: Number(values.year),
        // date input এ সময় থাকে না: শুরু = দিনের শুরু, শেষ = দিনের শেষ। backend এর নিয়মে UTC ISO তে পাঠাই
        startDate: new Date(`${values.startDate}T00:00:00`).toISOString(),
        endDate: new Date(`${values.endDate}T23:59:59`).toISOString(),
      });
      onDone();
    } catch (error) {
      if (
        applyApiErrors(error, setError, [
          "name",
          "year",
          "startDate",
          "endDate",
        ])
      )
        return;

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      // "This semester already exists" (name + year এর জোড়া) এলে term ঘরের নিচে দেখাই
      if (/already exists/i.test(message))
        setError("name", { type: "server", message });
      else toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Term"
          htmlFor="semester-term"
          error={errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="semester-term"
                  className="w-full"
                  aria-invalid={!!errors.name}
                >
                  <SelectValue placeholder="Select a term" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_TERMS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label="Year"
          htmlFor="semester-year"
          error={errors.year?.message}
        >
          <Input
            id="semester-year"
            inputMode="numeric"
            aria-invalid={!!errors.year}
            aria-describedby={errors.year ? "semester-year-error" : undefined}
            {...register("year")}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Start date"
          htmlFor="semester-start"
          error={errors.startDate?.message}
        >
          <Input
            id="semester-start"
            type="date"
            aria-invalid={!!errors.startDate}
            aria-describedby={
              errors.startDate ? "semester-start-error" : undefined
            }
            {...register("startDate")}
          />
        </FormField>
        <FormField
          label="End date"
          htmlFor="semester-end"
          error={errors.endDate?.message}
        >
          <Input
            id="semester-end"
            type="date"
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? "semester-end-error" : undefined}
            {...register("endDate")}
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
            "Create semester"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function SemesterFormDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New semester</DialogTitle>
          <DialogDescription>
            New semesters start as “Upcoming”. You start and complete them from
            the table.
          </DialogDescription>
        </DialogHeader>
        {open && <SemesterForm onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
