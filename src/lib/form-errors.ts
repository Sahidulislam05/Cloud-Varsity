// src/lib/form-errors.ts
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api-client";

export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly FieldPath<T>[],
): boolean {
  if (!(error instanceof ApiError)) return false;

  let applied = false;
  for (const item of error.errors) {
    const field = fields.find((name) => name === item.field);
    if (field) {
      setError(field, { type: "server", message: item.message });
      applied = true;
    }
  }
  return applied;
}
