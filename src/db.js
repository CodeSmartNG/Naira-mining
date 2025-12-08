// src/db.js
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// helper: get user's wallet (create if not exist)
export async function getOrCreateWallet(userId) {
  const r = await query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
  if (r.rows.length) return r.rows[0];
  const insert = await query(
    `INSERT INTO wallets (user_id, currency, available_balance_kobo, locked_balance_kobo)
     VALUES ($1,'NGN',0,0) RETURNING *`,
    [userId]
  );
  return insert.rows[0];
}