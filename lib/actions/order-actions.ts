"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { OrderStatus } from "@/lib/types";
export async function getAllOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  if (session) {
    try {
      const rawOrders = await prisma.order.findMany({
        where: session.user.isAdmin ? undefined : { userId: session.user.id },
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
      const orders = rawOrders.map((order) => ({
        ...order,
        totalAmount: order.totalAmount.toNumber(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
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
      }));
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders");
    }
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
