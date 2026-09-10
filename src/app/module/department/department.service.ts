import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import {
  TCreateDepartmentPayload,
  TUpdateDepartmentPayload,
} from "../academics/academics.interface";

const createDepartment = async (payload: TCreateDepartmentPayload) => {
  const university = await prisma.university.findUnique({
    where: { id: payload.universityId },
  });
  if (!university)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid university");

  const existing = await prisma.department.findUnique({
    where: { code: payload.code },
  });
  if (existing)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Department code already exists",
    );

  return prisma.department.create({ data: payload });
};

const getAllDepartments = async () => {
  return prisma.department.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  });
};

const updateDepartment = async (
  id: string,
  payload: TUpdateDepartmentPayload,
) => {
  const department = await prisma.department.findFirst({
    where: { id, deletedAt: null },
  });
  if (!department)
    throw new AppError(httpStatus.NOT_FOUND, "Department not found");

  return prisma.department.update({ where: { id }, data: payload });
};

export const DepartmentService = {
  createDepartment,
  getAllDepartments,
  updateDepartment,
};
