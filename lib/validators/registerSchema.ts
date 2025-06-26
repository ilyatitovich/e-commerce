import { z } from "zod";

export const registerSchema = z.object({
  emailOrPhone: z.string().min(3, "Введите email или телефон"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
