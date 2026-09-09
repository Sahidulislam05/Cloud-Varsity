import type { Role } from "../../../generated/prisma/enums";

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  programId: string;
  batch: number;
  phone?: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TGoogleLoginPayload = {
  idToken: string;
};

export type TForgotPasswordPayload = {
  email: string;
};

export type TResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type TJwtPayload = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};
