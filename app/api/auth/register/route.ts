import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/registerSchema";
import { prisma } from "@/lib/db/prisma";

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

  // Проверка: уже существует?
  // const existingUser = await prisma.user.findUnique({
  //   where: { emailOrPhone },
  // });

  // if (existingUser) {
  //   return NextResponse.json(
  //     { message: "Пользователь уже существует" },
  //     { status: 400 }
  //   );
  // }

  // Хешируем пароль и сохраняем
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      provider: "local",
    },
  });

  return NextResponse.json({ message: "Регистрация успешна" }, { status: 200 });
}
