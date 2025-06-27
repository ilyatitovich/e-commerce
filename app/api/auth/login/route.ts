import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/validators/loginSchema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Неверный формат данных" },
      { status: 400 }
    );
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { message: "Неверный email или пароль" },
      { status: 401 }
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return NextResponse.json(
      { message: "Неверный email или пароль" },
      { status: 401 }
    );
  }

  if (!user.emailVerified) {
    return NextResponse.json(
      { message: "Email не подтвержден. Проверьте почту." },
      { status: 403 }
    );
  }

  // Генерация JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Устанавливаем токен в HttpOnly куку
  const response = NextResponse.json({ message: "Успешный вход" });
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });

  return response;
}
