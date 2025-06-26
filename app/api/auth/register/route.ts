import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/registerSchema";

// временная БД
const mockDB: Record<string, unknown> = {};

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Некорректные данные" },
      { status: 400 }
    );
  }

  const { emailOrPhone, password } = result.data;

  if (mockDB[emailOrPhone]) {
    return NextResponse.json(
      { message: "Пользователь уже существует" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  mockDB[emailOrPhone] = {
    id: Date.now(),
    emailOrPhone,
    passwordHash,
    provider: "local",
  };

  return NextResponse.json({ message: "Регистрация успешна" }, { status: 200 });
}
