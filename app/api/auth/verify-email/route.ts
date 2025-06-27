import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db/prisma";

const BASE_URL = process.env.BASE_URL!;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/login?error=missing_token`);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    await prisma.user.update({
      where: { id: payload.userId },
      data: { emailVerified: true },
    });

    return NextResponse.redirect(`${BASE_URL}/login?verified=1`);
  } catch {
    return NextResponse.redirect(`${BASE_URL}/login?error=invalid_token`);
  }
}
