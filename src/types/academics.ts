export type University = { id: string; name: string; address: string | null };
export type Department = {
  id: string;
  name: string;
  code: string;
  universityId: string;
};
export type Program = {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  durationSemesters: number;
};
export type Course = {
  id: string;
  title: string;
  code: string;
  creditHours: number;
  programId: string;
};
