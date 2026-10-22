import "dotenv/config";

import { searchProducts } from "../../lib/ai/search-products";
import { tigerDb } from "../../lib/db/tiger";

async function main() {
  const query = "I need something to help with muscle recovery";

  console.log(`Searching for: "${query}"`);

  const products = await searchProducts(query);

  console.table(products);
}

main()
  .catch(console.error)
  .finally(async () => {
    await tigerDb.end();
  });
