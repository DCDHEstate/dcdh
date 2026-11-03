// Payout requests from a user's wallet.
//
// The amount leaves the wallet the moment it's requested, as a 'withdrawal'
// debit — that is what stops the same balance being requested twice. An admin
// then pays it out and marks it paid, or rejects it and the amount is credited
// back (see /api/admin/withdrawals).

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import { debitWallet, getOrCreateWallet, parseAmount } from '@/lib/wallet';
import { MIN_WITHDRAWAL_AMOUNT } from '@/lib/referralOptions';

const UPI_RE = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,64}$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_RE = /^\d{9,18}$/;

// GET — my payout requests, plus saved payout details to prefill the form
export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wallet = await getOrCreateWallet(sql, user.id);

    const [requests, saved] = await Promise.all([
      sql`
        SELECT id, amount, payout_method, upi_id, bank_account_number, bank_name,
               status, payout_reference, admin_notes, created_at, processed_at
        FROM wallet_withdrawals
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT 20
      `,
      // Owners keep payout details on their profile; tenants enter them here.
      sql`
        SELECT preferred_payout_method, upi_id, bank_account_name, bank_account_number,
               bank_ifsc_code, bank_name
        FROM owner_profiles WHERE user_id = ${user.id}
      `,
    ]);

    return NextResponse.json({
      balance: wallet.balance,
      minAmount: MIN_WITHDRAWAL_AMOUNT,
      hasPending: requests.some((r) => r.status === 'pending'),
      requests: requests.map((r) => ({
        ...r,
        // Only the tail of an account number is ever sent back to the browser.
        bank_account_number: r.bank_account_number ? `••••${r.bank_account_number.slice(-4)}` : null,
      })),
      savedPayout: saved[0]
        ? {
            method: saved[0].preferred_payout_method === 'bank_transfer' ? 'bank_transfer' : 'upi',
            upiId: saved[0].upi_id || '',
            bankAccountName: saved[0].bank_account_name || '',
            bankAccountNumber: saved[0].bank_account_number || '',
            bankIfscCode: saved[0].bank_ifsc_code || '',
            bankName: saved[0].bank_name || '',
          }
        : null,
    });
  } catch (err) {
    console.error('[wallet/withdrawals GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — request a payout
export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const amount = parseAmount(body.amount, { max: 10_000_000 });
    if (!amount || Number(amount) < MIN_WITHDRAWAL_AMOUNT) {
      return NextResponse.json(
        { error: `The minimum withdrawal is ₹${MIN_WITHDRAWAL_AMOUNT}` },
        { status: 400 },
      );
    }

    const method = body.method === 'bank_transfer' ? 'bank_transfer' : body.method === 'upi' ? 'upi' : null;
    if (!method) {
      return NextResponse.json({ error: 'Choose UPI or bank transfer' }, { status: 400 });
    }

    const payout = { upi: null, accountName: null, accountNumber: null, ifsc: null, bankName: null };
    if (method === 'upi') {
      payout.upi = String(body.upiId ?? '').trim();
      if (!UPI_RE.test(payout.upi)) {
        return NextResponse.json({ error: 'Enter a valid UPI ID, e.g. name@okaxis' }, { status: 400 });
      }
    } else {
      payout.accountName = String(body.bankAccountName ?? '').trim().slice(0, 255);
      payout.accountNumber = String(body.bankAccountNumber ?? '').replace(/\s/g, '');
      payout.ifsc = String(body.bankIfscCode ?? '').trim().toUpperCase();
      payout.bankName = String(body.bankName ?? '').trim().slice(0, 255) || null;
      if (!payout.accountName) {
        return NextResponse.json({ error: 'Enter the account holder name' }, { status: 400 });
      }
      if (!ACCOUNT_RE.test(payout.accountNumber)) {
        return NextResponse.json({ error: 'Enter a valid account number' }, { status: 400 });
      }
      if (!IFSC_RE.test(payout.ifsc)) {
        return NextResponse.json({ error: 'Enter a valid IFSC code' }, { status: 400 });
      }
    }

    const withdrawalId = randomUUID();

    const outcome = await sql.begin(async (tx) => {
      const [open] = await tx`
        SELECT 1 FROM wallet_withdrawals WHERE user_id = ${user.id} AND status = 'pending'
      `;
      if (open) {
        return { status: 409, error: 'You already have a payout being processed.' };
      }

      const wallet = await debitWallet(tx, {
        userId: user.id,
        amount,
        reason: 'withdrawal',
        description: method === 'upi' ? `Payout to UPI ${payout.upi}` : `Payout to bank a/c ••••${payout.accountNumber.slice(-4)}`,
        referenceId: withdrawalId,
      });
      if (!wallet) {
        return { status: 400, error: 'Your wallet balance is lower than that amount.' };
      }

      await tx`
        INSERT INTO wallet_withdrawals (
          id, user_id, wallet_id, amount, payout_method,
          upi_id, bank_account_name, bank_account_number, bank_ifsc_code, bank_name
        ) VALUES (
          ${withdrawalId}, ${user.id}, ${wallet.id}, ${amount}, ${method},
          ${payout.upi}, ${payout.accountName}, ${payout.accountNumber}, ${payout.ifsc}, ${payout.bankName}
        )
      `;
      return { status: 201, balance: wallet.balance };
    });

    if (outcome.error) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    }
    return NextResponse.json({ id: withdrawalId, balance: outcome.balance }, { status: 201 });
  } catch (err) {
    // uq_wallet_withdrawals_one_pending: a double-submitted form.
    if (err?.code === '23505') {
      return NextResponse.json({ error: 'You already have a payout being processed.' }, { status: 409 });
    }
    console.error('[wallet/withdrawals POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
