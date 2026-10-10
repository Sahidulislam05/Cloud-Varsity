// src/components/super-admin/assign-department-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignDepartment } from "@/hooks/use-admin";
import { useDepartments } from "@/hooks/use-academics";
import type { UserRow } from "@/types/user";

type AssignDepartmentDialogProps = {
  user: UserRow | null;
  onClose: () => void;
};

export function AssignDepartmentDialog({
  user,
  onClose,
}: AssignDepartmentDialogProps) {
  const [departmentId, setDepartmentId] = useState("");
  const { data: departments = [], isLoading: depsLoading } = useDepartments();
  const assign = useAssignDepartment();

  const handleSubmit = () => {
    if (!user || !departmentId) return;
    assign.mutate(
      { id: user.id, departmentId },
      {
        onSuccess: () => {
          setDepartmentId("");
          onClose();
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDepartmentId("");
      onClose();
    }
  };

  return (
    <Dialog open={user !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign department</DialogTitle>
          <DialogDescription>
            Choose a department for{" "}
            <span className="font-medium text-foreground">{user?.name}</span>.
            They will have full access to that department&apos;s programs,
            courses, and sections.
          </DialogDescription>
        </DialogHeader>

        <FormField label="Department" htmlFor="assign-dept">
          <Select
            value={departmentId}
            onValueChange={setDepartmentId}
            disabled={depsLoading}
          >
            <SelectTrigger id="assign-dept" className="w-full">
              <SelectValue
                placeholder={
                  depsLoading ? "Loading departments…" : "Select a department"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}{" "}
                  <span className="text-muted-foreground">({dept.code})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={assign.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!departmentId || assign.isPending}
          >
            {assign.isPending ? (
              <>
                <Loader2 className="animate-spin" /> Assigning…
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

