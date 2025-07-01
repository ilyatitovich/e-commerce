import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import redis from "@/lib/redisClient"; // ваш redis-клиент
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Нет refresh токена" },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    // Проверяем наличие токена в Redis
    const key = `refresh:${payload.userId}`;
    const storedToken = await redis.get(key);

    if (!storedToken || storedToken !== refreshToken) {
      return NextResponse.json(
        { message: "Недействительный токен" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: +payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Выдаём новый access токен
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({ message: "Токен обновлён" });

    response.cookies.set({
      name: "token",
      value: newAccessToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
    });

    return response;
  } catch (err) {
    console.error("Ошибка верификации refresh токена:", err);
    return NextResponse.json(
      { message: "Неверный или просроченный токен" },
      { status: 403 }
    );
  }
}
