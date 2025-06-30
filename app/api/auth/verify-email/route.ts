import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/register";

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

    return NextResponse.redirect(`${BASE_URL}`);
  } catch {
    return NextResponse.redirect(`${BASE_URL}/login?error=invalid_token`);
  }
}
