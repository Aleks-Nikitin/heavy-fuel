import "dotenv/config";

import { randomUUID } from "node:crypto";
import { redis } from "../../lib/redis";
import { checkChatRateLimit } from "../../lib/ai/rate-limit";

async function main() {
  const testUserId = `test-${randomUUID()}`;

  console.log("Testing Redis rate limiting...");

  try {
    for (let i = 1; i <= 5; i++) {
      const result = await checkChatRateLimit(testUserId);

      if (!result.allowed) {
        throw new Error(`Request ${i} should have been allowed.`);
      }

      console.log(`Request ${i}: allowed (${result.remaining} remaining)`);
    }

    const blocked = await checkChatRateLimit(testUserId);

    if (blocked.allowed) {
      throw new Error("Sixth request should have been blocked.");
    }

    console.log(`Request 6: blocked (retry after ${blocked.retryAfter}s)`);

    console.log("Redis rate limiting test passed!");
  } finally {
    const prefixes = ["heavyfuel:ai:minute", "heavyfuel:ai:hour"];

    for (const prefix of prefixes) {
      let cursor = 0;

      do {
        const result = await redis.scan(cursor, {
          match: `${prefix}:*${testUserId}*`,
          count: 100,
        });

        cursor = Number(result[0]);
        const keys = result[1];

        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== 0);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
