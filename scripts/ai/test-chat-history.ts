import "dotenv/config";

import { prisma } from "../../lib/prisma";

import {
  createChatConversation,
  getChatConversation,
  getConversationWithProducts,
  saveChatMessage,
} from "../../lib/ai/chat-history";

async function main() {
  const user = await prisma.user.findFirst({
    select: { id: true },
  });

  if (!user) {
    throw new Error("No users found. Create a test user first.");
  }
  const product = await prisma.product.findFirst({
    select: {
      id: true,
      name: true,
    },
  });

  if (!product) {
    throw new Error("No products found.");
  }
  console.log("Testing chat history...");
  const conversation = await createChatConversation(user.id);
  try {
    await saveChatMessage(
      conversation.id,
      "USER",
      "What is your cheapest protein?",
    );
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: `I recommend ${product.name}.`,
        productIds: [product.id],
      },
    });
    const result = await getChatConversation(conversation.id, user.id);

    if (!result) {
      throw new Error("Conversation not found.");
    }
    console.log("\nConversation ID:", conversation.id);

    console.table(
      result.messages.map((message) => ({
        role: message.role,
        content: message.content,
        productIds: message.productIds,
      })),
    );
    if (result.messages.length !== 2) {
      throw new Error(
        `Expected 2 messages, received ${result.messages.length}.`,
      );
    }
    if (
      result.messages[0].role !== "USER" ||
      result.messages[1].role !== "ASSISTANT"
    ) {
      throw new Error("Messages are not in the expected order.");
    }

    console.log("Chat history test passed!");
    const history = await getConversationWithProducts(conversation.id, user.id);

    if (!history) {
      throw new Error("Conversation with products not found.");
    }

    const assistantMessage = history.messages.find(
      (message) => message.role === "ASSISTANT",
    );

    if (assistantMessage?.products[0]?.id !== product.id) {
      throw new Error("Persisted product recommendation test failed.");
    }
    console.log("Persisted product recommendations test passed!");
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
    } else {
      console.log("Ownership test skipped: only one user exists.");
    }
  } finally {
    await prisma.chatConversation.delete({
      where: {
        id: conversation.id,
      },
    });

    console.log("\nTest conversation cleaned up.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
