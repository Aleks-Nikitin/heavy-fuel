import { GeminiServiceError, withGeminiRetry } from "../../lib/ai/gemini-retry";

import {
  InvalidGeminiResponseError,
  validateRecommendations,
} from "../../lib/ai/validate-recommendations";

async function main() {
  console.log("Testing Gemini reliability...");

  const noWait = async () => {};

  let attempts = 0;

  const result = await withGeminiRetry(
    async () => {
      attempts++;

      if (attempts < 3) {
        throw { status: 503 };
      }

      return "success";
    },
    { sleep: noWait },
  );

  if (result !== "success" || attempts !== 3) {
    throw new Error("503 retry test failed.");
  }

  console.log("503 retry test passed.");

  attempts = 0;

  try {
    await withGeminiRetry(
      async () => {
        attempts++;
        throw { status: 400 };
      },
      { sleep: noWait },
    );

    throw new Error("Expected a permanent error.");
  } catch (error) {
    if (attempts !== 1) {
      throw new Error("Permanent error was retried.");
    }

    if (
      error instanceof Error &&
      error.message === "Expected a permanent error."
    ) {
      throw error;
    }
  }

  console.log("Permanent error test passed.");

  attempts = 0;

  try {
    await withGeminiRetry(
      async () => {
        attempts++;
        throw { status: 503 };
      },
      { maxAttempts: 3, sleep: noWait },
    );

    throw new Error("Expected GeminiServiceError.");
  } catch (error) {
    if (!(error instanceof GeminiServiceError)) {
      throw error;
    }

    if (attempts !== 3) {
      throw new Error("Retry limit test failed.");
    }
  }

  console.log("Maximum retry test passed.");

  const valid = validateRecommendations(
    JSON.stringify({
      reply: "I recommend HeavyFuel Creatine.",
      recommendedProductIds: ["creatine-id"],
    }),
    ["creatine-id"],
  );

  if (valid.recommendedProductIds[0] !== "creatine-id") {
    throw new Error("Structured response validation failed.");
  }

  console.log("Structured response test passed.");

  try {
    validateRecommendations("This is not JSON", ["creatine-id"]);

    throw new Error("Expected invalid response error.");
  } catch (error) {
    if (!(error instanceof InvalidGeminiResponseError)) {
      throw error;
    }
  }

  console.log("Invalid JSON rejection test passed.");

  console.log("\nAll Gemini reliability tests passed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
