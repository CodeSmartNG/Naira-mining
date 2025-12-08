// src/worker.js
import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import { query, getOrCreateWallet } from "./db.js";

// Run daily at 00:05 UTC (adjust as desired)
const schedule = process.env.CRON_SCHEDULE || "5 0 * * *"; // every day at 00:05

console.log("Starting accrual worker with schedule:", schedule);

cron.schedule(schedule, async () => {
  console.log(`Accrual job start at ${new Date().toISOString()}`);
  try {
    // fetch confirmed deposits that still within lock (day_count < lock_days)
    const res = await query(
      `SELECT * FROM deposits WHERE status = 'confirmed' AND (day_count < lock_days)`,
      []
    );
    for (const d of res.rows) {
      const dailyRate = Number(d.rate_per_30days) / 30;
      const rewardKobo = Math.round(Number(d.amount_kobo) * dailyRate);

      // insert reward_accrual
      await query(
        `INSERT INTO reward_accruals (deposit_id, user_id, day_number, amount_kobo)
         VALUES ($1,$2,$3,$4)`,
        [d.id, d.user_id, Number(d.day_count) + 1, rewardKobo]
      );

      // ledger entry for reward accrual (pending)
      await query(
        `INSERT INTO ledger_entries (user_id,type,amount_kobo,reference,metadata)
         VALUES ($1,$2,$3,$4,$5)`,
        [d.user_id, "reward_accrual", rewardKobo, `reward:${d.id}`, JSON.stringify({ deposit_id: d.id })]
      );

      // increment day_count
      await query(`UPDATE deposits SET day_count = day_count + 1 WHERE id = $1`, [d.id]);

      console.log(`Rewarded ${rewardKobo} kobo to user ${d.user_id} for deposit ${d.id}`);
    }

    // handle deposits whose lock ended today (day_count >= lock_days)
    const ended = await query(
      `SELECT * FROM deposits WHERE status = 'confirmed' AND day_count >= lock_days AND lock_until <= now()`
    );
    for (const d of ended.rows) {
      // sum rewards for this deposit
      const rewardsSumQ = await query(`SELECT COALESCE(SUM(amount_kobo),0) as total FROM reward_accruals WHERE deposit_id = $1`, [d.id]);
      const totalRewards = Number(rewardsSumQ.rows[0].total);

      // move principal from locked_balance to available_balance + also move rewards into available
      const walletQ = await query("SELECT * FROM wallets WHERE user_id = $1", [d.user_id]);
      if (walletQ.rows.length === 0) {
        console.warn("No wallet for user when releasing deposit", d.user_id);
        continue;
      }
      const wallet = walletQ.rows[0];
      const newLocked = Number(wallet.locked_balance_kobo) - Number(d.amount_kobo);
      const newAvailable = Number(wallet.available_balance_kobo) + Number(d.amount_kobo) + totalRewards;

      await query(`UPDATE wallets SET locked_balance_kobo=$1, available_balance_kobo=$2 WHERE id=$3`, [
        newLocked,
        newAvailable,
        wallet.id,
      ]);

      // ledger entries
      await query(`INSERT INTO ledger_entries (user_id,type,amount_kobo,reference,metadata) VALUES ($1,$2,$3,$4,$5)`, [
        d.user_id,
        "release_locked",
        d.amount_kobo,
        `release:${d.id}`,
        JSON.stringify({ deposit_id: d.id }),
      ]);
      if (totalRewards > 0) {
        await query(`INSERT INTO ledger_entries (user_id,type,amount_kobo,reference,metadata) VALUES ($1,$2,$3,$4,$5)`, [
          d.user_id,
          "reward_release",
          totalRewards,
          `reward_release:${d.id}`,
          JSON.stringify({ deposit_id: d.id }),
        ]);
      }

      // finalize deposit (optional: set status to completed)
      await query(`UPDATE deposits SET status = 'completed' WHERE id = $1`, [d.id]);

      console.log(`Released deposit ${d.id} for user ${d.user_id}: principal ${d.amount_kobo}, rewards ${totalRewards}`);
    }

    console.log("Accrual job completed");
  } catch (err) {
    console.error("Accrual job error", err);
  }
});