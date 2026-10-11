CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS product_embeddings (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    description TEXT,
    embedding vector(1536),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);