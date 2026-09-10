import type { AttendanceStatus } from "../../../generated/prisma/enums";

export type TMarkAttendancePayload = {
  sectionId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus }[];
};

export type TAttendanceListQuery = {
  sectionId: string;
  date?: string;
};