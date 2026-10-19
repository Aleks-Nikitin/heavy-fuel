import { aiResponseSchema } from "@/lib/ai/response-schema";
export class InvalidGeminiResponseError extends Error {
  constructor() {
    super("Gemini returned an invalid structured response.");
    this.name = "InvalidGeminiResponseError";
  }
}
export function validateRecommendations(
  responseText: string,
  availableProductIds: string[],
) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new InvalidGeminiResponseError();
  }
  const result = aiResponseSchema.safeParse(parsed);

  if (!result.success) {
    throw new InvalidGeminiResponseError();
  }
  const availableIds = new Set(availableProductIds);

  const recommendedProductIds = [
    ...new Set(
      result.data.recommendedProductIds.filter((id) => availableIds.has(id)),
    ),
  ];

  return {
    reply: result.data.reply,
    recommendedProductIds,
  };
}
