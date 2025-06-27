import { NextRequest, NextResponse } from "next/server";
import { providers } from "@/lib/oauth";
import { prisma } from "@/lib/db/prisma";
// import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  context: { params: { provider: string } }
) {
  const code = req.nextUrl.searchParams.get("code");
  const providerId = context.params.provider;
  const provider = providers[providerId];

  if (!code || !provider) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 1. Get token
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

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return NextResponse.json({ error: "Token error" }, { status: 401 });
  }

  // 2. Get user info
  const userRes = await fetch(provider.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = await userRes.json();

  if (!profile.email) {
    return NextResponse.json(
      { error: "No email from provider" },
      { status: 400 }
    );
  }

  console.log("User profile:", profile);

  // 3. Upsert user
  await prisma.user.upsert({
    where: { email: profile.email },
    update: {},
    create: {
      email: profile.email,
      passwordHash: "", // пусто для OAuth
      provider: providerId,
    },
  });

  // 4. Create JWT
  // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
  //   expiresIn: "7d",
  // });

  const res = NextResponse.redirect("http://localhost:3000");
  // res.cookies.set("token", token, { httpOnly: true });

  return res;
}
