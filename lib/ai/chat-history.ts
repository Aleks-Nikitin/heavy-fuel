import { prisma } from "@/lib/prisma";
import { getProductCards } from "@/lib/ai/product-cards";

export async function getConversationWithProducts(
  conversationId: string,
  userId: string,
) {
  const conversation = await getChatConversation(conversationId, userId);
  if (!conversation) {
    return null;
  }
  const productIds = [
    ...new Set(conversation.messages.flatMap((message) => message.productIds)),
  ];
  const cards = await getProductCards(productIds, 100);
  const cardMap = new Map(cards.map((card) => [card.id, card]));
  return {
    id: conversation.id,
    title: conversation.title,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      products: message.productIds.flatMap((id) => {
        const card = cardMap.get(id);
        return card ? [card] : [];
      }),
    })),
  };
}
export async function createChatConversation(userId: string) {
  return prisma.chatConversation.create({
    data: {
      userId,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
}

export async function getChatConversation(
  conversationId: string,
  userId: string,
) {
  const conversation = await prisma.chatConversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 30,
      },
    },
  });
  if (conversation) {
    conversation.messages.reverse();
  }
  return conversation;
}

export async function getUserConversations(userId: string) {
  return prisma.chatConversation.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function saveChatMessage(
  conversationId: string,
  role: "USER" | "ASSISTANT",
  content: string,
) {
  return prisma.chatMessage.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}
