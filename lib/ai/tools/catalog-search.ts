import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type CatalogSearchArgs = {
  category?: string;
  productName?: string;
  variant?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "price_asc" | "price_desc";
  limit?: number;
};

export async function searchCatalog(args: CatalogSearchArgs) {
  const {
    category,
    productName,
    variant,
    size,
    minPrice,
    maxPrice,
    inStockOnly = true,
    sortBy = "price_asc",
    limit = 10,
  } = args;

  const where: Prisma.ProductVariantWhereInput = {
    ...(variant && {
      variant: {
        contains: variant,
        mode: "insensitive",
      },
    }),

    ...(size && {
      size: {
        contains: size,
        mode: "insensitive",
      },
    }),

    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }
      : {}),

    ...(inStockOnly && {
      stock: { gt: 0 },
    }),

    product: {
      ...(productName && {
        name: {
          contains: productName,
          mode: "insensitive",
        },
      }),

      ...(category && {
        category: {
          title: {
            contains: category,
            mode: "insensitive",
          },
        },
      }),
    },
  };

  const variants = await prisma.productVariant.findMany({
    where,

    orderBy: {
      price: sortBy === "price_desc" ? "desc" : "asc",
    },

    take: Math.min(Math.max(limit, 1), 20),

    select: {
      id: true,
      variant: true,
      size: true,
      price: true,
      stock: true,

      product: {
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

          variantImages: {
            select: {
              variant: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return variants.map((item) => {
    const variantImage = item.product.variantImages.find(
      (image) => image.variant.toLowerCase() === item.variant.toLowerCase(),
    );

    return {
      productId: item.product.id,
      productName: item.product.name,
      description: item.product.description,
      category: item.product.category.title,

      variantId: item.id,
      variant: item.variant,
      size: item.size,
      price: item.price.toString(),
      stock: item.stock,

      image: variantImage?.image ?? item.product.image,
    };
  });
}
