import { tigerDb } from "../db/tiger";
import { generateEmbedding } from "./embeddings";

export async function searchProducts(query: string) {
  const embedding = await generateEmbedding(query, "RETRIEVAL_QUERY");

  const result = await tigerDb.query(
    `
    SELECT
      product_id,
      product_name,
      description,
      1 - (embedding <=> $1::vector) AS similarity
    FROM product_embeddings
    ORDER BY embedding <=> $1::vector
    LIMIT 5
    `,
    [JSON.stringify(embedding)],
  );

  return result.rows;
}
