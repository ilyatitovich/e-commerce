import { NextRequest, NextResponse } from "next/server";
import { providers } from "@/lib/oauth";

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = providers[params.provider];
  if (!provider) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const url = new URL(provider.authorizeUrl);
  url.searchParams.set("client_id", provider.clientId);
  url.searchParams.set("redirect_uri", provider.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", provider.scope);
  url.searchParams.set("prompt", "consent");

  return NextResponse.redirect(url.toString());
}
