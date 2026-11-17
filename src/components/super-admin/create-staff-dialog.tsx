// src/components/super-admin/create-staff-dialog.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import { useDepartments } from "@/hooks/use-academics";
import { type StaffRole, useCreateStaffUser } from "@/hooks/use-admin";
import { ROLE_LABEL } from "@/lib/roles";

const STAFF_ROLES: StaffRole[] = [
  "INSTRUCTOR",
  "DEPARTMENT_ADMIN",
  "REGISTRAR",
  "FINANCE_ADMIN",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "" as StaffRole | "",
  departmentId: "",
  employeeId: "",
  designation: "",
};

type CreateStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateStaffDialog({
  open,
  onOpenChange,
}: CreateStaffDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { data: departments = [], isLoading: depsLoading } = useDepartments();
  const createStaff = useCreateStaffUser();

  const isInstructor = form.role === "INSTRUCTOR";
  const needsDepartment = isInstructor || form.role === "DEPARTMENT_ADMIN";
  const canSubmit =
    form.name.trim().length >= 2 &&
    form.email.trim() !== "" &&
    form.role !== "" &&
    (!needsDepartment || form.departmentId !== "") &&
    (!isInstructor ||
      (form.employeeId.trim() !== "" && form.designation.trim().length >= 2));

  const update = (patch: Partial<typeof EMPTY_FORM>) =>
    setForm((current) => ({ ...current, ...patch }));

  const close = () => {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || form.role === "") return;
    createStaff.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        ...(needsDepartment && { departmentId: form.departmentId }),
        ...(isInstructor && {
          employeeId: form.employeeId.trim(),
          designation: form.designation.trim(),
        }),
      },
      { onSuccess: close },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add staff account</DialogTitle>
            <DialogDescription>
              The person receives an email to set their own password. You never
              see or share it.
            </DialogDescription>
          </DialogHeader>

          <FormField label="Full name" htmlFor="staff-name">
            <Input
              id="staff-name"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </FormField>

          <FormField label="Email" htmlFor="staff-email">
            <Input
              id="staff-email"
              type="email"
              value={form.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </FormField>

          <FormField label="Role" htmlFor="staff-role">
            <Select
              value={form.role}
              onValueChange={(role) => update({ role: role as StaffRole })}
            >
              <SelectTrigger id="staff-role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {needsDepartment && (
            <FormField label="Department" htmlFor="staff-dept">
              <Select
                value={form.departmentId}
                onValueChange={(departmentId) => update({ departmentId })}
                disabled={depsLoading}
              >
                <SelectTrigger id="staff-dept" className="w-full">
                  <SelectValue
                    placeholder={
                      depsLoading
                        ? "Loading departments…"
                        : "Select a department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}{" "}
                      <span className="text-muted-foreground">
                        ({dept.code})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {isInstructor && (
            <>
              <FormField label="Employee ID" htmlFor="staff-employee-id">
                <Input
                  id="staff-employee-id"
                  value={form.employeeId}
                  onChange={(e) => update({ employeeId: e.target.value })}
                />
              </FormField>
              <FormField label="Designation" htmlFor="staff-designation">
                <Input
                  id="staff-designation"
                  placeholder="e.g. Lecturer"
                  value={form.designation}
                  onChange={(e) => update({ designation: e.target.value })}
                />
              </FormField>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={createStaff.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || createStaff.isPending}
            >
              {createStaff.isPending ? (
                <>
                  <Loader2 className="animate-spin" /> Creating…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
