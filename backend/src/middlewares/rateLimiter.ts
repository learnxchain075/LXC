// Redis-based rate limiter with automatic key expiry
import { Request, Response, NextFunction } from "express";
import { redis } from "../db/redis";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

export async function rateLimiter(req: Request, res: Response, next: NextFunction):Promise<any> {
  const key = `rl:${req.ip}`;

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.pexpire(key, WINDOW_MS);
  }

  const ttl = await redis.pttl(key);

  if (ttl > 0) {
    res.setHeader("X-RateLimit-Reset", String(Date.now() + ttl));
  }
  res.setHeader("X-RateLimit-Limit", String(MAX_REQUESTS));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, MAX_REQUESTS - current)));

  if (current > MAX_REQUESTS) {
    res.setHeader("Retry-After", String(Math.ceil(ttl / 1000)));
    return res.status(429).json({ error: "Too many requests" });
  }

  next();
}
