import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      avatar_url: user.avatar_url,
    },
  });
}
