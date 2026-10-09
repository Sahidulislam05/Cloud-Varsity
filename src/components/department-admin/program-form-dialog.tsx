// src/components/department-admin/program-form-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { useCreateProgram, useUpdateProgram } from "@/hooks/use-department";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import { type ProgramValues, programSchema } from "@/lib/validation/department";
import type { Program } from "@/types/academics";

type ProgramFormProps = {
  program: Program | null;
  departmentId: string;
  onDone: () => void;
};

function ProgramForm({ program, departmentId, onDone }: ProgramFormProps) {
  const createProgram = useCreateProgram(departmentId);
  const updateProgram = useUpdateProgram();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProgramValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: program?.name ?? "",
      code: program?.code ?? "",
      durationSemesters: program ? String(program.durationSemesters) : "8",
    },
  });

  const onSubmit = async (values: ProgramValues) => {
    try {
      const input = {
        name: values.name,
        code: values.code,
        durationSemesters: Number(values.durationSemesters),
      };
      if (program)
        await updateProgram.mutateAsync({ id: program.id, ...input });
      else await createProgram.mutateAsync(input);
      onDone();
    } catch (error) {
      if (
        applyApiErrors(error, setError, ["name", "code", "durationSemesters"])
      )
        return;

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      if (/code|duplicate|already exists/i.test(message))
        setError("code", { type: "server", message });
      else toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField
        label="Program name"
        htmlFor="program-name"
        error={errors.name?.message}
      >
        <Input
          id="program-name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "program-name-error" : undefined}
          {...register("name")}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Code"
          htmlFor="program-code"
          hint="e.g. BSC-CSE"
          error={errors.code?.message}
        >
          <Input
            id="program-code"
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? "program-code-error" : undefined}
            {...register("code")}
          />
        </FormField>
        <FormField
          label="Duration (semesters)"
          htmlFor="program-duration"
          error={errors.durationSemesters?.message}
        >
          <Input
            id="program-duration"
            inputMode="numeric"
            aria-invalid={!!errors.durationSemesters}
            aria-describedby={
              errors.durationSemesters ? "program-duration-error" : undefined
            }
            {...register("durationSemesters")}
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
              <Loader2 className="animate-spin" /> Saving…
            </>
          ) : program ? (
            "Save changes"
          ) : (
            "Create program"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

type ProgramFormDialogProps = {
  target: Program | "new" | null;
  departmentId: string;
  onClose: () => void;
};

export function ProgramFormDialog({
  target,
  departmentId,
  onClose,
}: ProgramFormDialogProps) {
  const program = target !== null && target !== "new" ? target : null;

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{program ? "Edit program" : "New program"}</DialogTitle>
          <DialogDescription>
            {program
              ? "Update the program details."
              : "Add a degree program to your department."}
          </DialogDescription>
        </DialogHeader>
        {target !== null && (
          <ProgramForm
            program={program}
            departmentId={departmentId}
            onDone={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
