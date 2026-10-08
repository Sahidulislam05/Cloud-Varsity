
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
import {
  useCreateFeeStructure,
  useGenerateInvoices,
} from "@/hooks/use-finance";
import { ApiError } from "@/lib/api-client";
import { applyApiErrors } from "@/lib/form-errors";
import { formatCurrency, todayLocal } from "@/lib/format";
import type { Program } from "@/types/academics";
import type { Semester } from "@/types/admin";
import type { FeeStructure } from "@/types/management";
import {
  feeStructureSchema,
  FeeStructureValues,
  generateInvoicesSchema,
  GenerateInvoicesValues,
} from "@/lib/validation/finance";

// ---------- নতুন fee structure ----------

type FeeStructureFormProps = {
  programs: Program[];
  semesters: Semester[];
  onDone: () => void;
};

function FeeStructureForm({
  programs,
  semesters,
  onDone,
}: FeeStructureFormProps) {
  const createFee = useCreateFeeStructure();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeeStructureValues>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      title: "Semester Tuition Fee",
      amount: "",
      programId: "",
      semesterId: "",
    },
  });

  const onSubmit = async (values: FeeStructureValues) => {
    try {
      await createFee.mutateAsync({
        title: values.title,
        amount: Number(values.amount),
        programId: values.programId,
        semesterId: values.semesterId,
      });
      onDone();
    } catch (error) {
      if (
        applyApiErrors(error, setError, [
          "title",
          "amount",
          "programId",
          "semesterId",
        ])
      )
        return;

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      // "This fee structure already exists..." এলে title ঘরের নিচেই দেখাই
      if (/already exists/i.test(message))
        setError("title", { type: "server", message });
      else toast.error(message);
    }
  };

  // শেষ হয়ে যাওয়া semester এর জন্য নতুন fee বানানোর মানে হয় না
  const openSemesters = semesters.filter(
    (semester) => semester.status !== "COMPLETED",
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField
        label="Title"
        htmlFor="fee-title"
        error={errors.title?.message}
      >
        <Input
          id="fee-title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "fee-title-error" : undefined}
          {...register("title")}
        />
      </FormField>

      <FormField
        label="Amount (৳)"
        htmlFor="fee-amount"
        error={errors.amount?.message}
      >
        <Input
          id="fee-amount"
          inputMode="decimal"
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? "fee-amount-error" : undefined}
          {...register("amount")}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Program"
          htmlFor="fee-program"
          error={errors.programId?.message}
        >
          <Controller
            control={control}
            name="programId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="fee-program"
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

        <FormField
          label="Semester"
          htmlFor="fee-semester"
          error={errors.semesterId?.message}
        >
          <Controller
            control={control}
            name="semesterId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="fee-semester"
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
          ) : (
            "Create fee structure"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

type FeeStructureFormDialogProps = {
  open: boolean;
  programs: Program[];
  semesters: Semester[];
  onClose: () => void;
};

export function FeeStructureFormDialog({
  open,
  programs,
  semesters,
  onClose,
}: FeeStructureFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New fee structure</DialogTitle>
          <DialogDescription>
            Define a fee for one program in one semester. Invoices are generated
            from it afterwards.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <FeeStructureForm
            programs={programs}
            semesters={semesters}
            onDone={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- invoice generate ----------

function GenerateForm({
  fee,
  onDone,
}: {
  fee: FeeStructure;
  onDone: () => void;
}) {
  const generate = useGenerateInvoices();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateInvoicesValues>({
    resolver: zodResolver(generateInvoicesSchema),
    defaultValues: { dueDate: "" },
  });

  const onSubmit = (values: GenerateInvoicesValues) =>
    generate.mutate(
      { id: fee.id, dueDate: values.dueDate },
      { onSuccess: onDone },
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <dl className="space-y-1.5 border border-border bg-muted/40 p-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Fee</dt>
          <dd className="font-medium">{fee.title}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Program</dt>
          <dd className="text-right font-medium">{fee.program.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Semester</dt>
          <dd className="font-medium">
            {fee.semester.name} {fee.semester.year}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount per student</dt>
          <dd className="font-medium">{formatCurrency(Number(fee.amount))}</dd>
        </div>
      </dl>

      <FormField
        label="Due date"
        htmlFor="due-date"
        error={errors.dueDate?.message}
      >
        <Input
          id="due-date"
          type="date"
          min={todayLocal()}
          className="sm:w-48"
          aria-invalid={!!errors.dueDate}
          aria-describedby={errors.dueDate ? "due-date-error" : undefined}
          {...register("dueDate")}
        />
      </FormField>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={generate.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={generate.isPending}>
          {generate.isPending ? (
            <>
              <Loader2 className="animate-spin" /> Generating…
            </>
          ) : (
            "Generate invoices"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function GenerateInvoicesDialog({
  fee,
  onClose,
}: {
  fee: FeeStructure | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={fee !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate invoices</DialogTitle>
          <DialogDescription>
            An invoice is created for every student in this program. Students
            who already have one are skipped, so it is safe to run again.
          </DialogDescription>
        </DialogHeader>
        {fee && <GenerateForm fee={fee} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
