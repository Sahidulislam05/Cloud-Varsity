export type TRegisterCoursePayload = {
  sectionId: string;
};

export type TRegistrationListQuery = {
  page?: string;
  limit?: string;
  sectionId?: string;
  status?: string;
};
