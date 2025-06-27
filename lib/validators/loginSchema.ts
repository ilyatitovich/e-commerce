import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Введите email или телефон"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
