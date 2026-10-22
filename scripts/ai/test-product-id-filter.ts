import "dotenv/config";

import { prisma } from "../../lib/prisma";
import { searchCatalog } from "../../lib/ai/tools/catalog-search";

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      name: {
        contains: "Whey Protein",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!product) {
    throw new Error("Whey Protein product not found.");
  }

  console.log(`Testing product filtering for ${product.name}`);

  const results = await searchCatalog({
    productIds: [product.id],
    maxPrice: 60,
    inStockOnly: true,
    sortBy: "price_asc",
  });

  console.table(
    results.map((item) => ({
      name: item.productName,
      variant: item.variant,
      size: item.size,
      price: item.price,
      stock: item.stock,
    })),
  );

  if (results.length === 0) {
    throw new Error("Expected at least one matching variant.");
  }

  const invalidResult = results.find(
    (item) =>
      item.productId !== product.id ||
      Number(item.price) > 60 ||
      item.stock <= 0,
  );

  if (invalidResult) {
    throw new Error("Product ID or price filtering failed.");
  }

  console.log("Product ID filtering test passed!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
