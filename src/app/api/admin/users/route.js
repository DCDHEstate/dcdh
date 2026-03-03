import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`u.role IN ('owner', 'tenant')`];

    if (role) conditions.push(sql`u.role = ${role}`);
    if (status) conditions.push(sql`u.status = ${status}`);
    if (q) conditions.push(sql`(u.full_name ILIKE ${'%' + q + '%'} OR u.phone ILIKE ${'%' + q + '%'})`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const users = await sql`
      SELECT
        u.id, u.phone, u.email, u.full_name, u.role, u.status,
        u.is_phone_verified, u.created_at, u.last_login_at,
        (SELECT COUNT(*)::int FROM properties WHERE owner_id = u.id) as property_count
      FROM users u
      WHERE ${where}
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total FROM users u WHERE ${where}
    `;

    return NextResponse.json({
      users,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-users/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required' }, { status: 400 });
    }

    if (!['suspend', 'activate'].includes(action)) {
      return NextResponse.json({ error: 'action must be suspend or activate' }, { status: 400 });
    }

    // Verify user exists and is not an admin
    const targetUser = await sql`SELECT id, role FROM users WHERE id = ${userId}`;
    if (targetUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (targetUser[0].role === 'admin') {
      return NextResponse.json({ error: 'Cannot modify admin accounts' }, { status: 400 });
    }

    const newStatus = action === 'suspend' ? 'suspended' : 'active';

    await sql`UPDATE users SET status = ${newStatus} WHERE id = ${userId}`;

    // Log admin activity
    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (${user.id}, ${action === 'suspend' ? 'suspend_user' : 'activate_user'}, 'user', ${userId}, '{}')
    `;

    return NextResponse.json({ success: true, action, newStatus });
  } catch (err) {
    console.error('[admin-users/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
