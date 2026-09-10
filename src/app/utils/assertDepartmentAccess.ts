import httpStatus from "http-status";
import type { Role } from "../../generated/prisma/enums";
import { AppError } from "./appError";

export const assertDepartmentAccess = (
  requesterRole: Role,
  requesterDepartmentId: string | null,
  targetDepartmentId: string,
) => {
  if (requesterRole === "SUPER_ADMIN") return;

  if (
    requesterRole === "DEPARTMENT_ADMIN" &&
    requesterDepartmentId === targetDepartmentId
  ) {
    return;
  }

  throw new AppError(
    httpStatus.FORBIDDEN,
    "You do not have permission to manage this department's data",
  );
};
