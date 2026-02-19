import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

const VALID_ROLES = ['owner', 'tenant'];

export async function PATCH(request) {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { role } = body;

  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: 'Invalid role. Must be "owner" or "tenant".' },
      { status: 400 }
    );
  }

  await sql`UPDATE users SET role = ${role} WHERE id = ${user.id}`;

  return NextResponse.json({ message: 'Role updated', role });
}
