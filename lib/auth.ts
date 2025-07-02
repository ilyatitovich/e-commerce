import jwt from "jsonwebtoken";

type JwtPayload = { email: string; userId: string; iat: number; exp: number };

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}
