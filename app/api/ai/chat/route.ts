import { NextResponse } from "next/server";
import { z } from "zod";

import { chatWithGemini } from "@/lib/ai/chat";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat message." },
        { status: 400 },
      );
    }

    const result = await chatWithGemini(parsed.data.message);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Failed to process chat request." },
      { status: 500 },
    );
  }
}
