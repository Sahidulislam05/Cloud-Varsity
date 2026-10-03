import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Name must be at least 2 characters" }),
    email: z.email({ error: "Please enter a valid email address" }),
    phone: z
      .string()
      .trim()
      .regex(/^\+?\d{7,15}$/, {
        error: "Enter a valid phone number (7–15 digits)",
      })
      .or(z.literal("")),
    programId: z.string().min(1, { error: "Please select your program" }),
    batch: z
      .string()
      .regex(/^\d{4}$/, { error: "Please select your batch year" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

export type RegisterValues = z.infer<typeof registerSchema>;
