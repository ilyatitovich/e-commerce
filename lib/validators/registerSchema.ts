import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const phoneRegex = /^\+?[0-9]{10,15}$/;

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Please enter an email")
    .refine((val) => emailRegex.test(val), "Please enter a valid email"),
  password: z
    .string()
    .min(1, "Please enter a password")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .refine(
      (val) =>
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /\d/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
