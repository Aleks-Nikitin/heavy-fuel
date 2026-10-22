import "dotenv/config";

import { prisma } from "../../lib/prisma";
import { getProductDetails } from "../../lib/ai/tools/product-details";
import { getProductCards } from "../../lib/ai/product-cards";

async function main() {
  const products = await prisma.product.findMany({
    take: 3,
    select: {
      id: true,
      name: true,
    },
  });

  if (products.length === 0) {
    throw new Error("No products found.");
  }

  console.log("\nTesting single product details:");

  const details = await getProductDetails(products[0].id);

  if (!details) {
    throw new Error("Product details not found.");
  }

  console.log(JSON.stringify(details, null, 2));

  console.log("\nTesting multiple product cards:");

  const cards = await getProductCards(products.map((product) => product.id));

  console.table(
    cards.map((card) => ({
      name: card.name,
      category: card.category,
      variants: card.variants.length,
      url: card.url,
    })),
  );

  if (cards.length !== products.length) {
    throw new Error("Product card count mismatch.");
  }

  for (const card of cards) {
    if (!card.id || !card.name || !card.url) {
      throw new Error("Invalid product card.");
    }

    for (const variant of card.variants) {
      if (!variant.id || !variant.price || !variant.image) {
        throw new Error("Invalid product variant.");
      }
    }
  }

  console.log("\nProduct card tests passed!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
