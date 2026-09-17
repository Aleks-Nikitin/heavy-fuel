"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { OrderStatus } from "@/lib/types";

type CartItemInput = {
  productVariantId?: string;
  variantId?: string;
  quantity: number;
};
function formatOrder(order: any) {
  return {
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item: any) => ({
      ...item,
      priceAtPurchase: item.priceAtPurchase.toNumber(),
      variant: {
        ...item.variant,
        price: item.variant.price.toNumber(),
        product: {
          ...item.variant.product,
        },
      },
    })),
  };
}

export async function createOrder(cartItems: CartItemInput[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    const variantIds = cartItems
      .map((item) => item.productVariantId || item.variantId)
      .filter((id): id is string => Boolean(id));

    if (variantIds.length === 0) {
      throw new Error("Invalid cart items: missing variant IDs");
    }

    const dbVariants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
      },
      include: { product: true },
    });

    let calculatedTotal = 0;
    const orderItemsPayload = [];

    for (const item of cartItems) {
      const targetId = item.productVariantId || item.variantId;
      const dbVariant = dbVariants.find((v) => v.id === targetId);

      if (!dbVariant || !targetId) {
        throw new Error(`Product variant not found (ID: ${targetId})`);
      }

      if (item.quantity > dbVariant.stock) {
        throw new Error(
          `Insufficient stock for ${dbVariant.product.name} (${dbVariant.variant}). Only ${dbVariant.stock} left.`,
        );
      }

      const realPrice = Number(dbVariant.price);
      calculatedTotal += realPrice * item.quantity;

      orderItemsPayload.push({
        productVariantId: targetId,
        quantity: item.quantity,
        priceAtPurchase: realPrice,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: calculatedTotal,
        items: {
          create: orderItemsPayload,
        },
      },
    });

    return order.id;
  } catch (error) {
    console.error("Error creating secure order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create order",
    );
  }
}

export async function getUserOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const rawOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return rawOrders.map(formatOrder);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
}

export async function getAdminOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id || !session.user.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    const rawOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return rawOrders.map(formatOrder);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    throw new Error("Failed to fetch admin orders");
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.isAdmin) {
    throw new Error("User not authorized");
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    if (updatedOrder) {
      return { msg: "Order status updated successfully" };
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}
