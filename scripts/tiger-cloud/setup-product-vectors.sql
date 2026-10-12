CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS product_embeddings (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    description TEXT,
    embedding vector(768),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX product_embeddings_vector_idx
ON product_embeddings
USING hnsw (embedding vector_cosine_ops);