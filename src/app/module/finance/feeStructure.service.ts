import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type {
  TCreateFeeStructurePayload,
  TGenerateInvoicesPayload,
} from "./finance.interface";

const createFeeStructure = async (payload: TCreateFeeStructurePayload) => {
  const program = await prisma.program.findFirst({
    where: { id: payload.programId, deletedAt: null },
  });
  if (!program) throw new AppError(httpStatus.BAD_REQUEST, "Invalid program");

  const semester = await prisma.semester.findUnique({
    where: { id: payload.semesterId },
  });
  if (!semester) throw new AppError(httpStatus.BAD_REQUEST, "Invalid semester");

  const existing = await prisma.feeStructure.findUnique({
    where: {
      programId_semesterId_title: {
        programId: payload.programId,
        semesterId: payload.semesterId,
        title: payload.title,
      },
    },
  });
  if (existing)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This fee structure already exists for this program and semester",
    );

  return prisma.feeStructure.create({ data: payload });
};

const getAllFeeStructures = async () => {
  return prisma.feeStructure.findMany({
    include: { program: true, semester: true },
    orderBy: { createdAt: "desc" },
  });
};

const generateInvoices = async (
  feeStructureId: string,
  payload: TGenerateInvoicesPayload,
) => {
  const feeStructure = await prisma.feeStructure.findUnique({
    where: { id: feeStructureId },
  });
  if (!feeStructure)
    throw new AppError(httpStatus.NOT_FOUND, "Fee structure not found");

  const students = await prisma.studentProfile.findMany({
    where: { programId: feeStructure.programId },
  });
  if (students.length === 0)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No students found in this program",
    );

  const existingInvoices = await prisma.invoice.findMany({
    where: { feeStructureId, studentId: { in: students.map((s) => s.id) } },
    select: { studentId: true },
  });
  const alreadyInvoicedIds = new Set(existingInvoices.map((i) => i.studentId));
  const studentsToInvoice = students.filter(
    (s) => !alreadyInvoicedIds.has(s.id),
  );

  if (studentsToInvoice.length === 0) {
    return { generated: 0, skipped: students.length };
  }

  await prisma.invoice.createMany({
    data: studentsToInvoice.map((student) => ({
      studentId: student.id,
      feeStructureId,
      amount: feeStructure.amount,
      dueDate: new Date(payload.dueDate),
    })),
  });

  return {
    generated: studentsToInvoice.length,
    skipped: alreadyInvoicedIds.size,
  };
};

export const FeeStructureService = {
  createFeeStructure,
  getAllFeeStructures,
  generateInvoices,
};
