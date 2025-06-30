import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/lib/validators/registerSchema";
import { prisma } from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "Пользователь уже существует" },
        { status: 400 }
      );
    }

    // Rate limit по email
    // const limitKey = `register_limit:${email}`;
    // const attempt = await redis.incr(limitKey);
    // if (attempt === 1) await redis.expire(limitKey, 60 * 10); // 10 минут
    // if (attempt > 3) {
    //   return NextResponse.json({ message: "Слишком много попыток" }, { status: 429 });
    // }

    const passwordHash = await bcrypt.hash(password, 10);

    // Генерация JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const link = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email,
          passwordHash,
          emailVerified: false,
          provider: "local",
        },
      });
    });

    // Сохраняем токен в Redis (на случай если нужно будет инвалидировать)
    // await redis.set(`email_verify:${email}`, token, "EX", 60 * 60); // 1 час

    await sendVerificationEmail(email, link);

    return NextResponse.json({
      message: "Регистрация успешна. Проверьте вашу почту для подтверждения.",
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    return NextResponse.json(
      { message: "Произошла ошибка при регистрации" },
      { status: 500 }
    );
  }
}
