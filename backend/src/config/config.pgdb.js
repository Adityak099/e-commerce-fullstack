import pg from "pg";

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
