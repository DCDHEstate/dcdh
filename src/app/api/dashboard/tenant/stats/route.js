import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'tenant') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [savedCount, inquiryCount] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM saved_properties WHERE user_id = ${user.id}`,
      sql`SELECT COUNT(*)::int as count FROM leads WHERE tenant_id = ${user.id}`,
    ]);

    return NextResponse.json({
      savedProperties: savedCount[0].count,
      totalInquiries: inquiryCount[0].count,
    });
  } catch (err) {
    console.error('[tenant-stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
