import { GoogleGenAI, type Content, type Part } from "@google/genai";
import { z } from "zod";
import { getChatConversation, saveChatMessage } from "@/lib/ai/chat-history";
import { prisma } from "@/lib/prisma";
import { searchCatalog } from "./tools/catalog-search";
import { customerToolDefinitions } from "./tools/tool-definitions";
import { retrieveProducts } from "@/lib/ai/product-retrieval";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = "gemini-3.8-flash";

const SYSTEM_INSTRUCTION = `
You are HeavyFuel's AI shopping assistant.

HeavyFuel is an e-commerce store selling supplements, apparel, and gear.

STORE CATEGORIES:
- supplements: Protein powder, creatine, mass gainers, and similar products.
- apparel: Clothing and athletic wear.
- gear: Training equipment and accessories.

YOUR RESPONSIBILITIES:
- Help customers find products based on their goals and preferences.
- Answer questions about product prices, flavors, sizes, and availability.
- Recommend relevant products from HeavyFuel's actual catalog.

TOOL USAGE:
- Use searchCatalog for exact questions about price, flavor, size, stock, or category.
- Use semanticSearch for recommendations based on goals or natural-language descriptions.
- You may use both tools when necessary.
- A category is not the same as a product type.
- For example, "protein powder" is a product type within supplements.
- Never treat all supplements as protein powders.

ACCURACY RULES:
- Never invent products, prices, flavors, sizes, discounts, or inventory.
- Use tool results as the source of truth for store-specific information.
- Never claim a product is available unless its stock is greater than zero.
- If no matching product exists, explain that clearly.
- Do not invent store policies, shipping terms, or return policies.
- Avoid medical diagnoses and unsupported supplement claims.
- If the user asks about something unrelated to shopping, respond briefly and politely.

RESPONSE STYLE:
- Be friendly and conversational.
- Keep responses concise unless the customer asks for details.
- Mention specific products and prices when relevant.
`;

const catalogArgsSchema = z.object({
  category: z.enum(["supplements", "apparel", "gear"]).optional(),
  productName: z.string().optional(),
  productIds: z.array(z.string()).max(20).optional(),
  variant: z.string().optional(),
  size: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  inStockOnly: z.boolean().optional(),
  sortBy: z.enum(["price_asc", "price_desc"]).optional(),
  limit: z.number().int().min(1).max(20).optional(),
});

const semanticArgsSchema = z.object({
  query: z.string().trim().min(1).max(500),
});

export async function chatWithGemini(
  message: string,
  conversationId: string,
  userId: string,
) {
  const conversation = await getChatConversation(conversationId, userId);
  if (!conversation) {
    throw new Error("Conversation not found.");
  }
  const contents: Content[] = conversation.messages.map((item) => ({
    role: item.role === "USER" ? "user" : "model",
    parts: [{ text: item.content }],
  }));

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });
  const MAX_ITERATIONS = 3;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [
          {
            functionDeclarations: customerToolDefinitions,
          },
        ],
      },
    });

    const modelContent = response.candidates?.[0]?.content;

    if (!modelContent) {
      throw new Error("Gemini returned no content.");
    }

    contents.push(modelContent);

    const functionCalls =
      modelContent.parts?.flatMap((part) =>
        part.functionCall ? [part.functionCall] : [],
      ) ?? [];

    if (functionCalls.length === 0) {
      const reply = response.text ?? "Sorry, I couldn't generate a response.";

      await prisma.$transaction([
        prisma.chatMessage.create({
          data: {
            conversationId,
            role: "USER",
            content: message,
          },
        }),

        prisma.chatMessage.create({
          data: {
            conversationId,
            role: "ASSISTANT",
            content: reply,
          },
        }),

        prisma.chatConversation.update({
          where: {
            id: conversationId,
          },
          data: {
            updatedAt: new Date(),
          },
        }),
      ]);

      return {
        conversationId,
        reply,
      };
    }

    const toolResponses: Part[] = [];

    for (const call of functionCalls) {
      let result: unknown;

      try {
        switch (call.name) {
          case "searchCatalog": {
            const args = catalogArgsSchema.parse(call.args ?? {});
            result = await searchCatalog(args);
            break;
          }

          case "semanticSearch": {
            const args = semanticArgsSchema.parse(call.args ?? {});
            result = await retrieveProducts(args.query);
            break;
          }

          default:
            result = {
              error: "Unknown tool requested.",
            };
        }
      } catch (error) {
        console.error(`Tool ${call.name} failed:`, error);

        result = {
          error: "Unable to retrieve the requested information.",
        };
      }

      toolResponses.push({
        functionResponse: {
          name: call.name!,
          response: {
            result,
          },
        },
      });
    }

    contents.push({
      role: "user",
      parts: toolResponses,
    });
  }

  return {
    reply:
      "Sorry, I couldn't complete your request right now. Please try again.",
  };
}
