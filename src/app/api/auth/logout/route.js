import { NextResponse } from 'next/server';
import { deleteSession, clearSessionCookie, SESSION_COOKIE_NAME } from '@/lib/session';

export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const token = cookie?.value;

  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  clearSessionCookie(response);

  return response;
}
