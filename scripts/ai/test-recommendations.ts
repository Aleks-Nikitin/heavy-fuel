import { validateRecommendations } from "../../lib/ai/validate-recommendations";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  console.log("Testing AI recommendation validation...");

  const availableIds = ["creatine-id", "whey-id", "mass-gainer-id"];

  const valid = validateRecommendations(
    JSON.stringify({
      reply: "I recommend HeavyFuel Creatine.",
      recommendedProductIds: ["creatine-id"],
    }),
    availableIds,
  );

  assert(
    valid.recommendedProductIds.length === 1,
    "Valid recommendation test failed.",
  );

  assert(
    valid.recommendedProductIds[0] === "creatine-id",
    "Incorrect product ID returned.",
  );

  const invented = validateRecommendations(
    JSON.stringify({
      reply: "Here are my recommendations.",
      recommendedProductIds: ["whey-id", "fake-product-id"],
    }),
    availableIds,
  );

  assert(
    invented.recommendedProductIds.length === 1,
    "Invented product ID was not filtered.",
  );

  const duplicates = validateRecommendations(
    JSON.stringify({
      reply: "Try HeavyFuel Creatine.",
      recommendedProductIds: ["creatine-id", "creatine-id"],
    }),
    availableIds,
  );

  assert(
    duplicates.recommendedProductIds.length === 1,
    "Duplicate IDs were not removed.",
  );

  const invalid = validateRecommendations(
    "I recommend HeavyFuel Whey Protein.",
    availableIds,
  );

  assert(
    invalid.recommendedProductIds.length === 0,
    "Invalid JSON should not produce recommendations.",
  );

  assert(
    invalid.reply === "I recommend HeavyFuel Whey Protein.",
    "Invalid JSON fallback failed.",
  );

  const empty = validateRecommendations(
    JSON.stringify({
      reply: "Creatine and whey protein serve different purposes.",
      recommendedProductIds: [],
    }),
    availableIds,
  );

  assert(
    empty.recommendedProductIds.length === 0,
    "Empty recommendations test failed.",
  );

  console.log("All recommendation validation tests passed!");
}

main();
