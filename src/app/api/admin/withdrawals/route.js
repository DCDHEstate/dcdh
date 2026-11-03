// Admin processing of wallet payout requests.
//
// The money has already left the user's wallet when they requested it. Marking
// a request paid just records the payout; rejecting it credits the amount back.

import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import { creditWallet } from '@/lib/wallet';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ['pending', 'paid', 'rejected'];

// GET — list requests, pending first
export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = 20;
    const offset = (page - 1) * limit;

    if (status && !STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
    }
    const where = status ? sql`w.status = ${status}` : sql`1=1`;

    const [requests, [counts]] = await Promise.all([
      sql`
        SELECT w.*, u.full_name AS user_name, u.phone AS user_phone, u.role AS user_role,
               pu.full_name AS processed_by_name
        FROM wallet_withdrawals w
        JOIN users u ON u.id = w.user_id
        LEFT JOIN users pu ON pu.id = w.processed_by
        WHERE ${where}
        ORDER BY CASE w.status WHEN 'pending' THEN 0 ELSE 1 END, w.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT
          COUNT(*) FILTER (WHERE ${where})::int AS total,
          COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0)::text AS pending_amount
        FROM wallet_withdrawals w
      `,
    ]);

    return NextResponse.json({
      requests,
      total: counts.total,
      pending: counts.pending,
      pendingAmount: counts.pending_amount,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-withdrawals GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — { id, action: 'paid' | 'rejected', payoutReference?, adminNotes? }
export async function PATCH(request) {
  try {
    const admin = await getSessionFromRequest(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const { id, action } = body ?? {};
    const payoutReference = String(body?.payoutReference ?? '').trim().slice(0, 100) || null;
    const adminNotes = String(body?.adminNotes ?? '').trim().slice(0, 2000) || null;

    if (!UUID_RE.test(id ?? '')) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    if (!['paid', 'rejected'].includes(action)) {
      return NextResponse.json({ error: 'action must be paid or rejected' }, { status: 400 });
    }
    if (action === 'paid' && !payoutReference) {
      return NextResponse.json(
        { error: 'Enter the UPI / bank transaction reference for this payout' },
        { status: 400 },
      );
    }
    if (action === 'rejected' && !adminNotes) {
      return NextResponse.json({ error: 'Add a reason — the user will see it' }, { status: 400 });
    }

    const outcome = await sql.begin(async (tx) => {
      const [w] = await tx`SELECT * FROM wallet_withdrawals WHERE id = ${id} FOR UPDATE`;
      if (!w) return { status: 404, error: 'Request not found' };
      if (w.status !== 'pending') {
        return { status: 409, error: `This request was already marked ${w.status}.` };
      }

      if (action === 'rejected') {
        await creditWallet(tx, {
          userId: w.user_id,
          amount: w.amount,
          reason: 'adjustment',
          description: 'Payout request rejected — amount returned',
          referenceId: w.id,
        });
      }

      await tx`
        UPDATE wallet_withdrawals
        SET status = ${action},
            payout_reference = ${payoutReference},
            admin_notes = ${adminNotes},
            processed_by = ${admin.id},
            processed_at = NOW(),
            updated_at = NOW()
        WHERE id = ${id}
      `;
      return { status: 200 };
    });

    if (outcome.error) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-withdrawals PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
