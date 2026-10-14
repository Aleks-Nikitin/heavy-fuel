import { prisma } from "@/lib/prisma";
import { searchProducts } from "@/lib/ai/search-products";

export async function retrieveProducts(query: string) {
  const matches = await searchProducts(query);

  if (matches.length === 0) {
    return [];
  }
  const productIds = matches.map((match) => match.product_id);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
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
      },

      variantImages: {
        select: {
          variant: true,
          image: true,
        },
      },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  return matches.flatMap((match) => {
    const product = productMap.get(match.product_id);

    if (!product) {
      return [];
    }

    const imageMap = new Map(
      product.variantImages.map((item) => [item.variant, item.image]),
    );

    const variants = product.variants.map((item) => ({
      id: item.id,
      variant: item.variant,
      size: item.size,
      price: item.price.toString(),
      stock: item.stock,
      image: imageMap.get(item.variant) ?? product.image,
    }));

    return [
      {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category.title,
        variants,
        similarity: Number(match.similarity),
      },
    ];
  });
}
