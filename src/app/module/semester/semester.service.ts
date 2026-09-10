// src/app/module/academics/semester.service.ts
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { SemesterStatus } from "../../../generated/prisma/enums";
import { TCreateSemesterPayload } from "../academics/academics.interface";

const createSemester = async (payload: TCreateSemesterPayload) => {
  const existing = await prisma.semester.findUnique({
    where: { name_year: { name: payload.name, year: payload.year } },
  });
  if (existing)
    throw new AppError(httpStatus.BAD_REQUEST, "This semester already exists");

  return prisma.semester.create({
    data: {
      name: payload.name,
      year: payload.year,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    },
  });
};

const getAllSemesters = async () => {
  return prisma.semester.findMany({
    orderBy: [{ year: "desc" }, { startDate: "desc" }],
  });
};

const VALID_TRANSITIONS: Record<SemesterStatus, SemesterStatus[]> = {
  UPCOMING: ["ONGOING"],
  ONGOING: ["COMPLETED"],
  COMPLETED: [],
};

const updateSemesterStatus = async (id: string, nextStatus: SemesterStatus) => {
  const semester = await prisma.semester.findUnique({ where: { id } });
  if (!semester) throw new AppError(httpStatus.NOT_FOUND, "Semester not found");

  if (!VALID_TRANSITIONS[semester.status].includes(nextStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change semester status from ${semester.status} to ${nextStatus}`,
    );
  }

  return prisma.semester.update({
    where: { id },
    data: { status: nextStatus },
  });
};

export const SemesterService = {
  createSemester,
  getAllSemesters,
  updateSemesterStatus,
};
