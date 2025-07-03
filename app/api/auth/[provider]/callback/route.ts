import { NextRequest, NextResponse } from "next/server";
import { providers } from "@/lib/oauth";
import { prisma } from "@/lib/db/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  context: { params: { provider: string } }
) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const providerId = context.params.provider;
    const provider = providers[providerId];

    if (!code || !provider) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const tokenRes = await fetch(provider.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        redirect_uri: provider.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Token request failed", await tokenRes.text());
      return NextResponse.json(
        { error: "Failed to fetch token" },
        { status: 401 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: "Token error" }, { status: 401 });
    }

    const userRes = await fetch(provider.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      console.error("User info request failed", await userRes.text());
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 401 }
      );
    }

    const profile = await userRes.json();

    if (!profile.email) {
      return NextResponse.json(
        { error: "No email from provider" },
        { status: 400 }
      );
    }

    await prisma.user.upsert({
      where: { email: profile.email },
      update: {},
      create: {
        name: profile.name || profile.email.split("@")[0],
        avatar: profile.avatar || profile.picture,
        email: profile.email,
        provider: providerId,
        emailVerified: true,
      },
    });

    const token = jwt.sign({ email: profile.email }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const res = NextResponse.redirect(process.env.BASE_URL!);

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
