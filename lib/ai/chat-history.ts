import { prisma } from "@/lib/prisma";

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
  return prisma.chatConversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: [{ createdAt: "asc" }, { id: "desc" }],
        take: 30,
      },
    },
  });
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
