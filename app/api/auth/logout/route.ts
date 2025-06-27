import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Вы вышли из аккаунта" });

  // Удаляем куку с токеном
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
