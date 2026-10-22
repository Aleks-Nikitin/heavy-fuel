import { Pool } from "pg";

const globalForTiger = globalThis as unknown as {
  tigerPool?: Pool;
};

const connectionString = process.env.TIGER_DATABASE_URL;

if (!connectionString) {
  throw new Error("TIGER_DATABASE_URL is not configured");
}

const url = new URL(connectionString);

url.searchParams.set("sslmode", "require");
url.searchParams.set("uselibpqcompat", "true");

export const tigerDb =
  globalForTiger.tigerPool ??
  new Pool({
    connectionString: url.toString(),
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForTiger.tigerPool = tigerDb;
}
