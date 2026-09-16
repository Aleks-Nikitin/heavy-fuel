"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { prisma } from "@/lib/prisma";

export async function deleteReview(reviewId: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      throw new Error("Unauthorized access request.");
    }
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found.");
    }

    if (review.userId !== session.user.id) {
      throw new Error("You do not have permission to delete this review.");
    }
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}
export async function getReviewsByUser() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      throw new Error("Unauthorized access request.");
    }

    const reviews = await prisma.review.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
}
