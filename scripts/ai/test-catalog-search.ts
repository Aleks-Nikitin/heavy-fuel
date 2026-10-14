import "dotenv/config";

import { searchCatalog } from "../../lib/ai/tools/catalog-search";
import { prisma } from "../../lib/prisma";

async function main() {
  console.log("\nCheapest protein products:");

  const cheapest = await searchCatalog({
    category: "supplements",
    sortBy: "price_asc",
    inStockOnly: true,
  });

  console.table(
    cheapest.map((item) => ({
      name: item.productName,
      variant: item.variant,
      size: item.size,
      price: item.price,
      stock: item.stock,
    })),
  );

  console.log("\nVanilla products under $50:");

  const vanilla = await searchCatalog({
    variant: "Vanilla",
    maxPrice: 50,
    inStockOnly: true,
  });

  console.table(vanilla);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
