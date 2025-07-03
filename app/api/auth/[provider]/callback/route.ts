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

    const html = `
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: 'oauth-success'},
              window.origin
            );
            window.opener.location.href = '${process.env.BASE_URL}';
            window.close();
          </script>
          <p>Login successful. You can close this window.</p>
        </body>
      </html>
    `;

    const res = new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
    });

    return res;
  } catch (error) {
    console.error("OAuth error:", error);
    const html = `
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: 'oauth-error', message: 'Internal Server Error' },
              window.origin
            );
            window.close();
          </script>
          <p>Login failed. Please close this window and try again.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
      status: 500,
    });
  }
}
