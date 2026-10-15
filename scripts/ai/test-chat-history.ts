import "dotenv/config";

import { prisma } from "../../lib/prisma";
import {
  createChatConversation,
  getChatConversation,
  saveChatMessage,
} from "../../lib/ai/chat-history";

async function main() {
  const user = await prisma.user.findFirst({
    select: { id: true },
  });

  if (!user) {
    throw new Error("No users found. Create a test user first.");
  }

  console.log("Testing chat history...");

  const conversation = await createChatConversation(user.id);

  try {
    await saveChatMessage(
      conversation.id,
      "USER",
      "What is your cheapest protein?",
    );

    await saveChatMessage(
      conversation.id,
      "ASSISTANT",
      "HeavyFuel Whey Protein starts at $52.99.",
    );

    const result = await getChatConversation(conversation.id, user.id);

    console.log("Conversation ID:", conversation.id);

    console.table(
      result?.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    );

    if (result?.messages.length !== 2) {
      throw new Error("Expected exactly two messages.");
    }

    if (
      result.messages[0].role !== "USER" ||
      result.messages[1].role !== "ASSISTANT"
    ) {
      throw new Error("Messages are not in the expected order.");
    }

    console.log("Chat history test passed!");
    const anotherUser = await prisma.user.findFirst({
      where: {
        id: {
          not: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (anotherUser) {
      const unauthorizedResult = await getChatConversation(
        conversation.id,
        anotherUser.id,
      );

      if (unauthorizedResult !== null) {
        throw new Error(
          "Security test failed: another user accessed the conversation.",
        );
      }

      console.log("Conversation ownership test passed!");
    }
  } finally {
    await prisma.chatConversation.delete({
      where: { id: conversation.id },
    });

    console.log("Test conversation cleaned up.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
