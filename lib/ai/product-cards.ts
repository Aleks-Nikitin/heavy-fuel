import { prisma } from "@/lib/prisma";
import type { ProductCard } from "@/lib/ai/product-card-types";

export async function getProductCards(
  productIds: string[],
): Promise<ProductCard[]> {
  const uniqueIds = [...new Set(productIds)].slice(0, 5);

  if (uniqueIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: uniqueIds,
      },
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

  const cards = products.map((product): ProductCard => {
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
  });

  const cardMap = new Map(cards.map((card) => [card.id, card]));

  return uniqueIds.flatMap((id) => {
    const card = cardMap.get(id);
    return card ? [card] : [];
  });
}
