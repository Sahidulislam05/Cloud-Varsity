import type { ExamType } from "../../generated/prisma/enums";

export const EXAM_TYPE_WEIGHTS: Record<ExamType, number> = {
  QUIZ: 0.1,
  ASSIGNMENT: 0.1,
  MIDTERM: 0.3,
  FINAL: 0.5,
};

export const calculateGrade = (
  percentage: number,
): { gradeLetter: string; gradePoint: number } => {
  if (percentage >= 80) return { gradeLetter: "A+", gradePoint: 4.0 };
  if (percentage >= 75) return { gradeLetter: "A", gradePoint: 3.75 };
  if (percentage >= 70) return { gradeLetter: "A-", gradePoint: 3.5 };
  if (percentage >= 65) return { gradeLetter: "B+", gradePoint: 3.25 };
  if (percentage >= 60) return { gradeLetter: "B", gradePoint: 3.0 };
  if (percentage >= 55) return { gradeLetter: "B-", gradePoint: 2.75 };
  if (percentage >= 50) return { gradeLetter: "C+", gradePoint: 2.5 };
  if (percentage >= 45) return { gradeLetter: "C", gradePoint: 2.25 };
  if (percentage >= 40) return { gradeLetter: "D", gradePoint: 2.0 };
  return { gradeLetter: "F", gradePoint: 0.0 };
};

export const calculateWeightedPercentage = (
  results: { obtainedMarks: number; totalMarks: number; examType: ExamType }[],
) => {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const result of results) {
    const weight = EXAM_TYPE_WEIGHTS[result.examType];
    const percentage = (result.obtainedMarks / result.totalMarks) * 100;
    weightedSum += percentage * weight;
    totalWeight += weight;
  }

  return totalWeight === 0 ? 0 : weightedSum / totalWeight;
};
