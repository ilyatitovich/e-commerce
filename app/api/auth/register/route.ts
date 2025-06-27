import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/lib/validators/registerSchema";
import { prisma } from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/email";

const BASE_URL = process.env.BASE_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Некорректные данные" },
      { status: 400 }
    );
  }

  const { email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Пользователь уже существует" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      passwordHash,
      provider: "local",
      emailVerified: false,
    },
  });

  // Сгенерировать токен подтверждения (JWT)
  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  const verificationLink = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  await sendVerificationEmail(email, verificationLink);

  return NextResponse.json({
    message: "Регистрация успешна. Проверьте вашу почту для подтверждения.",
  });
}
