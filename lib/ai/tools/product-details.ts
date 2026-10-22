import { prisma } from "@/lib/prisma";
import type { ProductCard } from "@/lib/ai/product-card-types.ts";

export async function getProductDetails(
  productId: string,
): Promise<ProductCard | null> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },

    select: {
      id: true,
      name: true,
      description: true,
      image: true,

      category: {
        select: {
          title: true,
        },
      },

      variants: {
        select: {
          id: true,
          variant: true,
          size: true,
          price: true,
          stock: true,
        },

        orderBy: {
          price: "asc",
        },
      },

      variantImages: {
        select: {
          variant: true,
          image: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const imageMap = new Map(
    product.variantImages.map((item) => [
      item.variant.toLowerCase(),
      item.image,
    ]),
  );

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category.title,
    image: product.image,
    url: `/products/${product.id}`,

    variants: product.variants.map((item) => ({
      id: item.id,
      variant: item.variant,
      size: item.size,
      price: item.price.toString(),
      stock: item.stock,

      image: imageMap.get(item.variant.toLowerCase()) ?? product.image,
    })),
  };
}
