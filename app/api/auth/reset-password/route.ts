import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.passwordHash) {
      // const token = await createPasswordResetToken(email);
      // const resetLink = `${process.env.BASE_URL}/auth/reset-password/confirm?token=${token}`;
      // await sendResetPasswordEmail(email, resetLink);
    }

    return NextResponse.json({ message: "Please check your mail." });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
