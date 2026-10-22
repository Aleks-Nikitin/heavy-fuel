import "dotenv/config";

import { prisma } from "../../lib/prisma";
import { tigerDb } from "../../lib/db/tiger";
import { generateEmbedding } from "../../lib/ai/embeddings";

async function main() {
  console.log("Fetching products from HeavyFuel...");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      category: {
        select: {
          title: true,
        },
      },
      variants: {
        select: {
          variant: true,
          size: true,
        },
      },
    },
  });

  console.log(`Found ${products.length} products`);

  for (const product of products) {
    const flavors = [...new Set(product.variants.map((v) => v.variant))];
    const sizes = [...new Set(product.variants.map((v) => v.size))];

    const productText = `
Product: ${product.name}
Category: ${product.category.title}
Description: ${product.description}
Available variants: ${flavors.join(", ")}
Available sizes: ${sizes.join(", ")}
    `.trim();

    console.log(`Generating embedding for ${product.name}...`);

    const embedding = await generateEmbedding(
      productText,
      "RETRIEVAL_DOCUMENT",
    );

    await tigerDb.query(
      `
      INSERT INTO product_embeddings (
        product_id,
        product_name,
        description,
        embedding,
        updated_at
      )
      VALUES ($1, $2, $3, $4::vector, NOW())
      ON CONFLICT (product_id)
      DO UPDATE SET
        product_name = EXCLUDED.product_name,
        description = EXCLUDED.description,
        embedding = EXCLUDED.embedding,
        updated_at = NOW()
      `,
      [
        product.id,
        product.name,
        product.description,
        JSON.stringify(embedding),
      ],
    );

    console.log(`Saved embedding for ${product.name}`);
  }

  console.log("Successfully generated all product embeddings!");
}

main()
  .catch((error) => {
    console.error("Embedding generation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await tigerDb.end();
    await prisma.$disconnect();
  });
