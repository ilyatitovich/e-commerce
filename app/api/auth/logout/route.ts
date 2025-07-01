import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redisClient";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      // Декодируем refresh токен, чтобы получить userId
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { userId: string };

      // Удаляем refresh токен из Redis
      await redis.del(`refresh:${payload.userId}`);
    } catch (err) {
      console.warn("Ошибка при удалении refresh токена:", err);
    }
  }

  const response = NextResponse.json({ message: "Вы вышли из аккаунта" });

  // Удаляем куки
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  response.cookies.set({
    name: "refreshToken",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
