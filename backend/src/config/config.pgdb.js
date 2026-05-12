import dotenv from "dotenv";
import pg from "pg";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Add it to backend/.env");
}

// Create connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

// Test connection
pool.on("connect", () => {
  console.log("✓ Connected to Supabase PostgreSQL");
});

pool.on("error", (err) => {
  console.error("✗ Unexpected error on idle client", err);
});

export default pool;
