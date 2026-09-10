export type TSubmitResultsPayload = {
  examId: string;
  records: { studentId: string; obtainedMarks: number }[];
};
