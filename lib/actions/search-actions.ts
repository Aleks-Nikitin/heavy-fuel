"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  slug: string;
  category: string;
  name: string;
  price: number;
  image: string;
};

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: trimmed, mode: "insensitive" } },
        { category: { title: { contains: trimmed, mode: "insensitive" } } },
      ],
    },
    take: 8,
    select: {
      id: true,
      name: true,
      image: true,
      category: {
        select: { title: true },
      },
      variants: {
        where: { stock: { gt: 0 } },
        take: 1,
        select: { price: true },
      },
    },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.id,
    category: p.category.title,
    name: p.name,
    price: p.variants[0] ? Number(p.variants[0].price) : 0,
    image: p.image,
  }));
}
