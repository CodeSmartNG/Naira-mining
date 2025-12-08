// src/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import bodyParser from "body-parser";
import crypto from "crypto";
import { query, getOrCreateWallet } from "./db.js";
import { toKobo, nowPlusDays } from "./utils.js";

const app = express();
const PORT = process.env.PORT || 5000;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize";

// Use json parser for normal endpoints
app.use(bodyParser.json());

// --- 1) Deposit initialization ---
app.post("/api/deposit/init", async (req, res) => {
  try {
    const { userId, amountNaira, lockDays = 30, ratePer30Days = 0.05 } = req.body;
    if (!userId || !amountNaira || Number(amountNaira) <= 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // create user if not exists (for demo only)
    await query(
      `INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [userId, `${userId}@example.com`]
    );

    const amountKobo = toKobo(amountNaira);

    // call paystack initialize
    const initResp = await fetch(PAYSTACK_INIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${userId}@example.com`,
        amount: amountKobo,
        metadata: { userId, lockDays, ratePer30Days },
        callback_url: `${process.env.BACKEND_URL || "http://localhost:" + PORT}/paystack/callback`
      }),
    });

    const body = await initResp.json();

    if (!body.status) {
      console.error("Paystack init error", body);
      return res.status(500).json({ error: "Payment provider error", details: body });
    }

    // store deposit record with provider_ref (initialized)
    await query(
      `INSERT INTO deposits (user_id, amount_kobo, payment_provider, provider_ref, status, lock_days, lock_until, rate_per_30days)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        amountKobo,
        "paystack",
        body.data.reference,
        "initialized",
        lockDays,
        nowPlusDays(lockDays),
        ratePer30Days,
      ]
    );

    res.json({ authorization_url: body.data.authorization_url, reference: body.data.reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- 2) Paystack webhook ---
// Paystack signs the raw request body using your secret as HMAC-SHA512.
// We need raw body to verify, so use express.raw for this route.
app.post(
  "/api/paystack/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["x-paystack-signature"];
      const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(req.body).digest("hex");

      if (signature !== hash) {
        console.warn("Invalid paystack signature");
        return res.status(401).send("Invalid signature");
      }

      const event = JSON.parse(req.body.toString());
      // handle charge.success
      if (event.event === "charge.success") {
        const data = event.data;
        const providerRef = data.reference;
        const metadata = data.metadata || {};
        const userId = metadata.userId || data.customer?.email?.split("@")[0];

        // mark deposit confirmed (idempotent)
        const depQ = await query("SELECT * FROM deposits WHERE provider_ref = $1", [providerRef]);
        if (depQ.rows.length === 0) {
          console.warn("No deposit found for provider ref", providerRef);
        } else {
          const dep = depQ.rows[0];
          if (dep.status !== "confirmed") {
            // update deposit
            await query(
              `UPDATE deposits SET status=$1, started_at=now(), amount_kobo=$2 WHERE provider_ref=$3`,
              ["confirmed", data.amount, providerRef]
            );

            // ensure wallet exists
            const wallet = await getOrCreateWallet(dep.user_id);

            // increase locked_balance by principal (since it's locked during mining)
            const newLocked = Number(wallet.locked_balance_kobo) + Number(data.amount);
            await query(
              `UPDATE wallets SET locked_balance_kobo = $1 WHERE id = $2`,
              [newLocked, wallet.id]
            );

            // Add ledger entry for deposit (locked)
            const ledgerBalanceAfter = null; // optional: compute from available + locked
            await query(
              `INSERT INTO ledger_entries (user_id, type, amount_kobo, balance_after_kobo, reference, metadata)
               VALUES ($1,$2,$3,$4,$5,$6)`,
              [dep.user_id, "deposit", data.amount, ledgerBalanceAfter, providerRef, JSON.stringify({ provider: "paystack", raw: data })]
            );
          } else {
            console.log("Deposit already confirmed: ", providerRef);
          }
        }
      }

      res.status(200).send("ok");
    } catch (err) {
      console.error("webhook error", err);
      res.status(500).send("error");
    }
  }
);

// Simple GET dashboard for demo
app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const w = await query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
    const wallet = w.rows[0] || { available_balance_kobo: 0, locked_balance_kobo: 0 };
    const deposits = await query("SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

    // total rewards earned (sum reward_accruals)
    const rewardsQ = await query("SELECT COALESCE(SUM(amount_kobo),0) as total FROM reward_accruals WHERE user_id = $1", [userId]);

    res.json({
      wallet: {
        available: Number(wallet.available_balance_kobo) / 100,
        locked: Number(wallet.locked_balance_kobo) / 100
      },
      totalRewards: Number(rewardsQ.rows[0].total) / 100,
      deposits: deposits.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});