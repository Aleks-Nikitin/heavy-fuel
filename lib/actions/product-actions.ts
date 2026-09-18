"use server";

import { prisma } from "@/lib/prisma";
import type { ProductDisplay } from "@/lib/product-types";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations/product";

import { revalidatePath } from "next/cache";

function toProductDisplay(product: {
  id: string;
  name: string;
  image: string;
  description: string;
  category: { title: string; slug: string };
  variants: {
    id: string;
    size: string;
    variant: string;
    price: unknown;
    stock: number;
  }[];
  reviews: {
    id: string;
    rating: number;
    title: string;
    body: string;
    userId: string;
    createdAt: Date;
  }[];
  variantImages: {
    id: string;
    variant: string;
    image: string;
    imagePublicId: string | null;
  }[];
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
          title: categorySlug,
        },
      },
      include: {
        category: true,
        variants: true,
        variantImages: true,
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
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
    include: {
      category: true,
      variants: true,
      reviews: true,
      variantImages: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductDisplay);
}
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
      reviews: true,
      variantImages: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductDisplay);
}
export async function createReviewByProductId(
  productId: string,
  reviewData: { rating: number; title: string; body: string; userId: string },
) {
  try {
    const review = await prisma.review.create({
      data: {
        rating: reviewData.rating,
        title: reviewData.title,
        body: reviewData.body,
        userId: reviewData.userId,
        productId: productId,
      },
    });
    revalidatePath(`/products/${productId}`);
    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
}
export async function getValidVariantIds(variantIds: string[]) {
  const validVariants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true },
  });
  return validVariants.map((v) => v.id);
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
        variantImages: true,
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return product ? toProductDisplay(product) : null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function createProduct(input: CreateProductInput) {
  const result = createProductSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid product data");
  }
  const data = result.data;
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        imagePublicId: data.imagePublicId,
        categoryId: data.categoryId,
        variants: {
          create: data.variants.map((item) => ({
            variant: item.flavor,
            size: item.size,
            price: Number(item.price),
            stock: Number(item.stock),
            sku: item.sku || null,
          })),
        },

        variantImages: {
          create: data.variantImages.map((item) => ({
            variant: item.variant,
            image: item.image,
            imagePublicId: item.imagePublicId,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
        variantImages: true,
      },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/shop");
    return {
      success: true,
      productId: product.id,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create product");
  }
}
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
