import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
const minuteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "heavyfuel:ai:minute",
  analytics: false,
  timeout: 2000,
});
const hourLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1h"),
  prefix: "heavyfuel:ai:hour",
  analytics: false,
  timeout: 2000,
});
type ChatRateLimitResult =
  | {
      allowed: true;
      remaining: number;
    }
  | {
      allowed: false;
      retryAfter: number;
    };
export async function checkChatRateLimit(
  userId: string,
): Promise<ChatRateLimitResult> {
  try {
    const identifier = `user:${userId}`;
    const hour = await hourLimiter.limit(identifier);
    if (hour.reason === "timeout") {
      throw new Error("Redis rate limiter timed out.");
    }
    if (!hour.success) {
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil((hour.reset - Date.now()) / 1000)),
      };
    }
    const minute = await minuteLimiter.limit(identifier);
    if (minute.reason === "timeout") {
      throw new Error("Redis rate limiter timed out.");
    }
    if (!minute.success) {
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil((minute.reset - Date.now()) / 1000)),
      };
    }
    return {
      allowed: true,
      remaining: minute.remaining,
    };
  } catch (error) {
    console.error("Redis rate limiter unavailable:", error);
    throw new Error("RATE_LIMIT_UNAVAILABLE");
  }
}
