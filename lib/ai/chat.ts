import { GoogleGenAI, type Content, type Part } from "@google/genai";
import { z } from "zod";
import { validateRecommendations } from "@/lib/ai/validate-recommendations";
import { getChatConversation, saveChatMessage } from "@/lib/ai/chat-history";
import { getProductDetails } from "@/lib/ai/tools/product-details";
import { getProductCards } from "@/lib/ai/product-cards";
import { prisma } from "@/lib/prisma";
import { searchCatalog } from "./tools/catalog-search";
import { customerToolDefinitions } from "./tools/tool-definitions";
import { retrieveProducts } from "@/lib/ai/product-retrieval";
import { withGeminiRetry } from "@/lib/ai/gemini-retry";
import { geminiResponseSchema } from "@/lib/ai/gemini-response-format";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    timeout: 45_000,
  },
});

const MODEL = "gemini-3.1-flash-lite";

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
- For greetings, thanks, and general conversation that does not require
  store information, respond directly without calling any tools.
- Avoid redundant tool calls. If a previous tool already returned
  sufficient information to answer the question, do not call another tool.
- Prefer answering after one relevant catalog search when possible.
- Use searchCatalog for exact questions about price, flavor, size, stock, or category.
- Use semanticSearch for recommendations based on goals or natural-language descriptions.
- You may use both tools when necessary.
- A category is not the same as a product type.
- For example, "protein powder" is a product type within supplements.
- Never treat all supplements as protein powders.
TOOL EFFICIENCY:
- Do not call tools for greetings or general conversation.
- Use the minimum number of tool calls needed to answer accurately.
- For straightforward product questions, prefer a single searchCatalog call.
- If searchCatalog returns sufficient product information, answer immediately.
- Do not call semanticSearch after searchCatalog unless the customer asks
  for goal-based recommendations that require semantic retrieval.
- Do not call getProductDetails if searchCatalog already returned
  the necessary product information.
- Never repeat a tool call with substantially identical arguments.

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
 PRODUCT RECOMMENDATIONS:
  - When recommending or displaying products, select only products
    relevant to your final response.
  - Use only product IDs returned by your tools.
  - Never invent product IDs.
  - Recommend at most 5 products.
  - If the customer is asking a general question that doesn't
    require showing products, return an empty recommendedProductIds array.
  - Do not recommend out-of-stock products unless the customer
    specifically asks about unavailable products.
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
const productDetailsArgsSchema = z.object({
  productId: z.string().trim().min(1),
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
  const contents: Content[] = [...conversation.messages]
    .reverse()
    .map((item) => ({
      role: item.role === "USER" ? "user" : "model",
      parts: [{ text: item.content }],
    }));

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });
  const foundProductIds: string[] = [];

  function collectProductIds(ids: string[]) {
    for (const id of ids) {
      if (!foundProductIds.includes(id)) {
        foundProductIds.push(id);
      }
    }
  }
  const MAX_ITERATIONS = 4;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const isLastIteration = iteration === MAX_ITERATIONS - 1;
    const geminiStart = performance.now();
    const response = await withGeminiRetry(() =>
      ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          ...(isLastIteration
            ? {}
            : {
                tools: [
                  {
                    functionDeclarations: customerToolDefinitions,
                  },
                ],
              }),
          responseMimeType: "application/json",
          responseSchema: geminiResponseSchema,
        },
      }),
    );
    console.log(
      `[AI Timing] Gemini iteration ${iteration + 1}: ${Math.round(
        performance.now() - geminiStart,
      )}ms`,
    );

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
      const responseText = response.text;
      if (!responseText?.trim()) {
        throw new Error("Gemini returned an empty response.");
      }
      const validated = validateRecommendations(responseText, foundProductIds);
      const { reply, recommendedProductIds } = validated;
      const products = await getProductCards(recommendedProductIds);
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
            productIds: products.map((product) => product.id),
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
        products,
      };
    }

    const toolResponses: Part[] = [];

    for (const call of functionCalls) {
      let result: unknown;
      const toolStart = performance.now();
      try {
        switch (call.name) {
          case "searchCatalog": {
            const args = catalogArgsSchema.parse(call.args ?? {});
            const products = await searchCatalog(args);
            collectProductIds(products.map((product) => product.productId));
            result = products;
            console.log(
              `[AI Timing] Tool ${call.name}: ${Math.round(
                performance.now() - toolStart,
              )}ms`,
            );
            break;
          }

          case "semanticSearch": {
            const args = semanticArgsSchema.parse(call.args ?? {});
            const products = await retrieveProducts(args.query);
            collectProductIds(products.map((product) => product.id));
            result = products;
            console.log(
              `[AI Timing] Tool ${call.name}: ${Math.round(
                performance.now() - toolStart,
              )}ms`,
            );
            break;
          }
          case "getProductDetails": {
            const args = productDetailsArgsSchema.parse(call.args ?? {});
            const product = await getProductDetails(args.productId);
            if (product) {
              collectProductIds([product.id]);
            }
            result = product;
            console.log(
              `[AI Timing] Tool ${call.name}: ${Math.round(
                performance.now() - toolStart,
              )}ms`,
            );
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

  throw new Error("Gemini failed to produce a final response.");
}
