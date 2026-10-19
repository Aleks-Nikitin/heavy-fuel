import { aiResponseSchema } from "@/lib/ai/response-schema";

export function validateRecommendations(
  responseText: string,
  availableProductIds: string[],
) {
  const availableIds = new Set(availableProductIds);

  let parsed: unknown;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    return {
      reply: responseText,
      recommendedProductIds: [],
    };
  }

  const result = aiResponseSchema.safeParse(parsed);

  if (!result.success) {
    return {
      reply: responseText,
      recommendedProductIds: [],
    };
  }

  const validatedIds = [
    ...new Set(
      result.data.recommendedProductIds.filter((id) => availableIds.has(id)),
    ),
  ];

  return {
    reply: result.data.reply,
    recommendedProductIds: validatedIds,
  };
}
