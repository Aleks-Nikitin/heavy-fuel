import "dotenv/config";

import { retrieveProducts } from "@/lib/ai/product-retrieval";
import { tigerDb } from "../../lib/db/tiger";
import { prisma } from "../../lib/prisma";

async function main() {
  const query = "I want something to help build muscle";

  const products = await retrieveProducts(query);

  console.dir(products, { depth: null });
}

main()
  .catch(console.error)
  .finally(async () => {
    await tigerDb.end();
    await prisma.$disconnect();
  });
