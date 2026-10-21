import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
const minuteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "heavyfuel:ai:minute",
  analytics: false,
  timeout: 6000,
});
const hourLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1h"),
  prefix: "heavyfuel:ai:hour",
  analytics: false,
  timeout: 6000,
});
const transcriptionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  prefix: "heavyfuel:ai:transcription",
  analytics: false,
  timeout: 6000,
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
export async function checkTranscriptionRateLimit(userId: string) {
  try {
    const result = await transcriptionLimiter.limit(`user:${userId}`);

    if (result.reason === "timeout") {
      throw new Error("Redis rate limiter timed out.");
    }

    if (!result.success) {
      return {
        allowed: false as const,
        retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
      };
    }

    return {
      allowed: true as const,
      remaining: result.remaining,
    };
  } catch (error) {
    console.error("Transcription rate limiter failed:", error);
    throw new Error("RATE_LIMIT_UNAVAILABLE");
  }
}
