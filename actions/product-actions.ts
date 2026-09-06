"use server";

import { prisma } from "@/lib/prisma";
import type { ProductDisplay } from "@/lib/product-types";

function toProductDisplay(product: {
  id: string;
  name: string;
  image: string;
  description: string;
  category: { title: string; slug: string };
  variants: { id: string; size: string; variant: string; price: unknown; stock: number }[];
  reviews: { id: string; rating: number; title: string; body: string; author: string; createdAt: Date }[];
}): ProductDisplay {
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
    })),
    reviews: product.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    })),
  };
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
        variants: true,
        reviews: true,
      },
    });
    return products.map(toProductDisplay);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
}
export async function getProducts() {
  const products = await prisma.product.findMany({
    take: 8,
    include: { category: true, variants: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductDisplay);
}
export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        variants: true,
        reviews: true,
      },
    });
    return product ? toProductDisplay(product) : null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}
