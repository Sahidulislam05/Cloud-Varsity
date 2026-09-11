import { prisma } from "../../lib/prisma";
import type { TReportQuery } from "./report.interface";

const getEnrollmentReport = async (query: TReportQuery) => {
  const sections = await prisma.section.findMany({
    where: {
      deletedAt: null,
      ...(query.semesterId && { semesterId: query.semesterId }),
    },
    include: {
      course: true,
      semester: true,
      _count: {
        select: {
          registrations: {
            where: { status: { in: ["ENROLLED", "COMPLETED"] } },
          },
        },
      },
    },
  });

  return sections.map((s) => ({
    courseCode: s.course.code,
    courseTitle: s.course.title,
    section: s.name,
    semester: `${s.semester.name} ${s.semester.year}`,
    capacity: s.capacity,
    enrolled: s._count.registrations,
    seatsRemaining: s.capacity - s._count.registrations,
  }));
};

const getAttendanceReport = async (query: TReportQuery) => {
  const sections = await prisma.section.findMany({
    where: {
      deletedAt: null,
      ...(query.semesterId && { semesterId: query.semesterId }),
    },
    include: { course: true, attendances: true },
  });

  return sections.map((s) => {
    const total = s.attendances.length;
    const present = s.attendances.filter(
      (a) => a.status === "PRESENT" || a.status === "LATE",
    ).length;
    return {
      courseCode: s.course.code,
      section: s.name,
      totalRecords: total,
      averageAttendancePercentage:
        total === 0 ? 0 : Math.round((present / total) * 100),
    };
  });
};

const getResultReport = async (query: TReportQuery) => {
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      status: "COMPLETED",
      ...(query.programId && { student: { programId: query.programId } }),
    },
    select: { finalGradePoint: true },
  });

  const totalGraded = registrations.length;
  const passCount = registrations.filter(
    (r) => (r.finalGradePoint ?? 0) > 0,
  ).length;
  const averageGpa =
    totalGraded === 0
      ? 0
      : Number(
          (
            registrations.reduce(
              (sum, r) => sum + (r.finalGradePoint ?? 0),
              0,
            ) / totalGraded
          ).toFixed(2),
        );

  return {
    totalRecordsGraded: totalGraded,
    passRate:
      totalGraded === 0 ? 0 : Math.round((passCount / totalGraded) * 100),
    averageGpa,
  };
};

const getFinanceReport = async (query: TReportQuery) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      ...(query.semesterId && {
        feeStructure: { semesterId: query.semesterId },
      }),
    },
  });

  const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalCollected = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  return {
    invoiceCount: invoices.length,
    totalInvoiced,
    totalCollected,
    totalPending: totalInvoiced - totalCollected,
  };
};

export const ReportService = {
  getEnrollmentReport,
  getAttendanceReport,
  getResultReport,
  getFinanceReport,
};
