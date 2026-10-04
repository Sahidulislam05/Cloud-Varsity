// src/lib/validations/profile.ts
import { z } from "zod";


export const profileSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/, { error: "Enter a valid phone number (7–15 digits)" })
    .or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;