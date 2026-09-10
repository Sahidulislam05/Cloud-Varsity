import httpStatus from "http-status";
import type { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { AppError } from "./appError";
import { assertDepartmentAccess } from "./assertDepartmentAccess";

type TRequester = { userId: string; role: Role; departmentId: string | null };

export const assertSectionAccess = async (
  sectionId: string,
  requester: TRequester,
) => {
  const section = await prisma.section.findFirst({
    where: { id: sectionId, deletedAt: null },
    include: { course: { include: { program: true } } },
  });
  if (!section) throw new AppError(httpStatus.NOT_FOUND, "Section not found");

  if (requester.role === "INSTRUCTOR") {
    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: requester.userId },
    });
    if (!instructorProfile || instructorProfile.id !== section.instructorId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not assigned to this section",
      );
    }
    return { section, instructorProfileId: instructorProfile.id };
  }

  if (requester.role === "DEPARTMENT_ADMIN") {
    assertDepartmentAccess(
      requester.role,
      requester.departmentId,
      section.course.program.departmentId,
    );
  }

  return { section, instructorProfileId: null };
};
