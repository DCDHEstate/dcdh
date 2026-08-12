import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

// GET — wallet balance + recent transactions
export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure wallet exists
    let wallet = await sql`SELECT id, balance FROM wallets WHERE user_id = ${user.id}`;
    if (wallet.length === 0) {
      wallet = await sql`
        INSERT INTO wallets (user_id, balance) VALUES (${user.id}, 0)
        RETURNING id, balance
      `;
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const [transactions, countResult] = await Promise.all([
      sql`
        SELECT id, transaction_type, amount, reason, description, balance_after, created_at
        FROM wallet_transactions
        WHERE wallet_id = ${wallet[0].id}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*)::int as total
        FROM wallet_transactions
        WHERE wallet_id = ${wallet[0].id}
      `,
    ]);

    return NextResponse.json({
      balance: wallet[0].balance,
      transactions,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[wallet/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
