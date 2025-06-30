import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/register";
import jwt from "jsonwebtoken";

const BASE_URL = process.env.BASE_URL!;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      `${process.env.BASE_URL!}/login?error=missing_token`
    );
  }

  try {
    const data = await verifyToken(token);

    if (!data) {
      return NextResponse.redirect(`${BASE_URL}/login?error=invalid_token`);
    }

    // await prisma.user.update({
    //   where: { email: data.email },
    //   data: { emailVerified: true },
    // });

    const accessToken = jwt.sign(
      { email: data.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const response = NextResponse.redirect(`${BASE_URL}`);

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 минут
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(`${BASE_URL}/login?error=invalid_token`);
  }
}
