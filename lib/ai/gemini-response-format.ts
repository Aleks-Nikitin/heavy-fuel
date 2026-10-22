import { Type, type Schema } from "@google/genai";

export const geminiResponseSchema: Schema = {
  type: Type.OBJECT,

  properties: {
    reply: {
      type: Type.STRING,
      description: "The conversational response shown to the customer.",
    },

    recommendedProductIds: {
      type: Type.ARRAY,
      description:
        "IDs of up to five relevant products returned by the available tools.",
      items: {
        type: Type.STRING,
      },
      maxItems: "5",
    },
  },

  required: ["reply", "recommendedProductIds"],
};
