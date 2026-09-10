import type { ExamType } from "../../../generated/prisma/enums";

export type TCreateExamPayload = {
  sectionId: string;
  examType: ExamType;
  title: string;
  totalMarks: number;
  examDate: string;
};
