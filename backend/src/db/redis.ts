import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
export const redis = new Redis(redisUrl);

// Connection success
redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

// Connection error
redis.on("error", (err: unknown) => {
  console.error("❌ Redis error:", err);
});

// Optional: Graceful shutdown
process.on("SIGINT", async () => {
  await redis.quit();
  console.log("🔌 Redis connection closed due to app termination");
  process.exit(0);
});
