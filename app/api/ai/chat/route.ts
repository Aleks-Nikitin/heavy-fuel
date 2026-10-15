import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { chatWithGemini } from "@/lib/ai/chat";
import { createChatConversation } from "@/lib/ai/chat-history";
export const runtime = "nodejs";
const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  conversationId: z.string().optional(),
});
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request." },
        { status: 400 },
      );
    }

    const { message } = parsed.data;
    let conversationId = parsed.data.conversationId;
    if (!conversationId) {
      const conversation = await createChatConversation(session.user.id);
      conversationId = conversation.id;
    }

    const result = await chatWithGemini(
      message,
      conversationId,
      session.user.id,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Failed to process chat request." },
      { status: 500 },
    );
  }
}
