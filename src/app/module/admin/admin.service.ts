import { prisma } from "../../lib/prisma";

const getDashboardStats = async () => {
  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    totalPrograms,
    activeSemester,
    revenue,
    pendingInvoices,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.instructorProfile.count(),
    prisma.course.count({ where: { deletedAt: null } }),
    prisma.program.count({ where: { deletedAt: null } }),
    prisma.semester.findFirst({ where: { status: "ONGOING" } }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
    prisma.invoice.count({ where: { status: "PENDING" } }),
  ]);

  const enrolledThisSemester = activeSemester
    ? await prisma.courseRegistration.count({
        where: {
          status: "ENROLLED",
          section: { semesterId: activeSemester.id },
        },
      })
    : 0;

  return {
    totalStudents,
    totalInstructors,
    totalCourses,
    totalPrograms,
    activeSemester: activeSemester?.name ?? null,
    enrolledThisSemester,
    totalRevenueCollected: Number(revenue._sum.amount ?? 0),
    pendingInvoices,
  };
};

export const AdminService = { getDashboardStats };
