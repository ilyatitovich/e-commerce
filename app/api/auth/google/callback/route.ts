import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Exchange code for access_token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profile = await userRes.json();

  console.log("Google profile:", profile);

  // Найти или создать пользователя
  const user = await prisma.user.upsert({
    where: { email: profile.email },
    update: {},
    create: {
      email: profile.email,
      passwordHash: "", // можно оставить пустым
      provider: "google",
    },
  });

  // Выдать JWT (если используешь)
  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "7d" });

  // Можно сохранить в куки и редиректнуть
  const res = NextResponse.redirect("http://localhost:3000");
  res.cookies.set("token", token, { httpOnly: true });

  return res;
}
