import { randomUUID, createHash } from "crypto";
import redis from "./redisClient";

export async function generateVerificationToken(
  email: string
): Promise<string> {
  try {
    const token = randomUUID();
    const hashedToken = createHash("sha256").update(token).digest("hex");

    await redis.setex(
      `email:verify:${hashedToken}`,
      60 * 60, // TTL: 1 hour
      JSON.stringify({ email })
    );

    return token;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      throw new Error(
        (error as { message: string }).message || "Token verification failed"
      );
    }
    throw new Error("Token verification failed");
  }
}

export async function verifyToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const data = await redis.get(`email:verify:${hashedToken}`);

    if (!data) return null;

    const { email } = JSON.parse(data);

    await redis.del(`email:verify:${hashedToken}`); // One-time use
    return { email };
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      throw new Error(
        (error as { message: string }).message || "Token verification failed"
      );
    }
    throw new Error("Token verification failed");
  }
}
