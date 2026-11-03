// Wallet ledger operations. Every balance change goes through here so the
// balance and its transaction history can't drift apart.
//
// All functions take a transaction handle (`tx` from sql.begin) — a credit or
// debit is only ever half of an operation (the referral being marked rewarded,
// the payout request being created), and both halves must commit together.
//
// Balances are adjusted in SQL (`balance = balance + x`), never read into JS,
// changed and written back: two concurrent credits would otherwise both read
// the same starting balance and one of them would vanish.

import { MAX_REWARD_AMOUNT } from '@/lib/referralOptions';

/**
 * Parses a rupee amount from user input into a "123.45" string, or null.
 * Kept as a string end to end so no float rounding touches money.
 */
export function parseAmount(input, { max = MAX_REWARD_AMOUNT } = {}) {
  const text = String(input ?? '').trim();
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(text)) return null;
  const value = Number(text);
  if (!(value > 0) || value > max) return null;
  return value.toFixed(2);
}

export async function creditWallet(tx, { userId, amount, reason, description, referenceId = null }) {
  const [wallet] = await tx`
    INSERT INTO wallets (user_id, balance)
    VALUES (${userId}, ${amount})
    ON CONFLICT (user_id) DO UPDATE
      SET balance = wallets.balance + EXCLUDED.balance,
          updated_at = NOW()
    RETURNING id, balance
  `;

  await tx`
    INSERT INTO wallet_transactions
      (wallet_id, transaction_type, amount, reason, description, reference_id, balance_after)
    VALUES
      (${wallet.id}, 'credit', ${amount}, ${reason}, ${description}, ${referenceId}, ${wallet.balance})
  `;

  return wallet;
}

/**
 * Debits the wallet only if it holds at least `amount`. Returns the updated
 * wallet, or null when the balance is insufficient (nothing is written then).
 */
export async function debitWallet(tx, { userId, amount, reason, description, referenceId = null }) {
  const [wallet] = await tx`
    UPDATE wallets
    SET balance = balance - ${amount}, updated_at = NOW()
    WHERE user_id = ${userId} AND balance >= ${amount}
    RETURNING id, balance
  `;
  if (!wallet) return null;

  await tx`
    INSERT INTO wallet_transactions
      (wallet_id, transaction_type, amount, reason, description, reference_id, balance_after)
    VALUES
      (${wallet.id}, 'debit', ${amount}, ${reason}, ${description}, ${referenceId}, ${wallet.balance})
  `;

  return wallet;
}

/** Returns the user's wallet, creating an empty one if needed (race-safe). */
export async function getOrCreateWallet(db, userId) {
  await db`INSERT INTO wallets (user_id, balance) VALUES (${userId}, 0) ON CONFLICT (user_id) DO NOTHING`;
  const [wallet] = await db`SELECT id, balance FROM wallets WHERE user_id = ${userId}`;
  return wallet;
}
