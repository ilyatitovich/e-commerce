import { jwtVerify } from "jose";

type JwtPayload = { email: string; iat: number; exp: number };

export async function verifyAuthToken(
  token: string
): Promise<JwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.email === "string" &&
      typeof payload.iat === "number" &&
      typeof payload.exp === "number"
    ) {
      return payload as JwtPayload;
    }

    return null;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
