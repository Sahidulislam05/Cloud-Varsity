import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { assertDepartmentAccess } from "../../utils/assertDepartmentAccess";
import type { Role } from "../../../generated/prisma/enums";
import {
  TCreateProgramPayload,
  TUpdateProgramPayload,
} from "../academics/academics.interface";

const createProgram = async (
  payload: TCreateProgramPayload,
  requester: { role: Role; departmentId: string | null },
) => {
  assertDepartmentAccess(
    requester.role,
    requester.departmentId,
    payload.departmentId,
  );

  const department = await prisma.department.findFirst({
    where: { id: payload.departmentId, deletedAt: null },
  });
  if (!department)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid department");

  const existing = await prisma.program.findUnique({
    where: { code: payload.code },
  });
  if (existing)
    throw new AppError(httpStatus.BAD_REQUEST, "Program code already exists");

  return prisma.program.create({ data: payload });
};

const getAllPrograms = async (departmentId?: string) => {
  return prisma.program.findMany({
    where: { deletedAt: null, ...(departmentId && { departmentId }) },
    orderBy: { name: "asc" },
  });
};

const updateProgram = async (
  id: string,
  payload: TUpdateProgramPayload,
  requester: { role: Role; departmentId: string | null },
) => {
  const program = await prisma.program.findFirst({
    where: { id, deletedAt: null },
  });
  if (!program) throw new AppError(httpStatus.NOT_FOUND, "Program not found");

  assertDepartmentAccess(
    requester.role,
    requester.departmentId,
    program.departmentId,
  );

  return prisma.program.update({ where: { id }, data: payload });
};

export const ProgramService = { createProgram, getAllPrograms, updateProgram };
