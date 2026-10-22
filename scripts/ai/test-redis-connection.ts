import { config } from "dotenv";

config({ path: ".env" });
async function main() {
  const { redis } = await import("../../lib/redis");

  console.log("Testing Upstash Redis connection...");

  const start = performance.now();

  const result = await redis.ping();

  const elapsed = Math.round(performance.now() - start);

  console.log({
    result,
    elapsedMs: elapsed,
  });

  if (result !== "PONG") {
    throw new Error("Redis did not respond correctly.");
  }

  console.log("Redis connection successful.");
}

main().catch((error) => {
  console.error("Redis connection failed:", error);
  process.exitCode = 1;
});
