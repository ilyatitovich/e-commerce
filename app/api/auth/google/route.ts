import { NextResponse } from "next/server";

export async function GET() {
  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  redirectUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  redirectUrl.searchParams.set(
    "redirect_uri",
    process.env.GOOGLE_REDIRECT_URI!
  );
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("scope", "openid email profile");
  redirectUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(redirectUrl.toString());
}
