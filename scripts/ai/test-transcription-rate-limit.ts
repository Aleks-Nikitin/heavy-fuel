import { config } from "dotenv";

config({ path: ".env" });
async function main() {
  const { checkTranscriptionRateLimit } =
    await import("../../lib/ai/rate-limit");

  const testUserId = `test-${crypto.randomUUID()}`;

  console.log("Testing transcription rate limiter...");

  for (let attempt = 1; attempt <= 4; attempt++) {
    const start = performance.now();

    const result = await checkTranscriptionRateLimit(testUserId);

    console.log({
      attempt,
      result,
      elapsedMs: Math.round(performance.now() - start),
    });

    if (attempt <= 3 && !result.allowed) {
      throw new Error(`Request ${attempt} was unexpectedly blocked.`);
    }

    if (attempt === 4 && result.allowed) {
      throw new Error("Rate limiter failed to block request 4.");
    }
  }

  console.log("Transcription rate limiter works correctly.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
