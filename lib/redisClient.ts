import Redis from "ioredis";

const REDIS_HOST =
  process.env.NODE_ENV === "development" ? "localhost" : "redis";

const redis = new Redis({
  host: REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => {
  console.log("Redis client connected");
});
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});
redis.on("reconnecting", () => {
  console.log("Redis client reconnecting");
});
redis.on("end", () => {
  console.log("Redis client disconnected");
});

export default redis;
