export const runtime = 'nodejs'; // postgres.js uses Node.js TCP sockets, not Edge

import { NextResponse } from 'next/server';
import { getSession, SESSION_COOKIE_NAME } from '@/lib/session';

// Routes that require authentication, with optional role enforcement
const PROTECTED_ROUTES = [
  { pattern: /^\/dashboard\/owner(\/.*)?$/, role: 'owner' },
  { pattern: /^\/dashboard\/tenant(\/.*)?$/, role: 'tenant' },
  { pattern: /^\/admin(\/.*)?$/, role: 'admin' },
  { pattern: /^\/auth\/role-select$/, role: null },        // any authenticated user
  { pattern: /^\/auth\/profile-setup(\/.*)?$/, role: null }, // any authenticated user
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Homepage: redirect logged-in users to their dashboard
  if (pathname === '/') {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME);
    const token = cookie?.value;
    const user = token ? await getSession(token) : null;
    if (user && user.status !== 'suspended' && user.role) {
      const dashboardMap = {
        owner: '/dashboard/owner',
        tenant: '/dashboard/tenant',
        admin: '/admin',
      };
      const dest = dashboardMap[user.role];
      if (dest) return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Find matching protected route — if none, allow through
  const protectedRoute = PROTECTED_ROUTES.find((r) => r.pattern.test(pathname));
  if (!protectedRoute) return NextResponse.next();

  // Validate session from cookie
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const token = cookie?.value;
  const user = token ? await getSession(token) : null;

  // Not authenticated → redirect to login, preserving intended destination
  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Suspended account → clear cookie and send to login
  if (user.status === 'suspended') {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // Wrong role → redirect to their correct dashboard
  if (protectedRoute.role && user.role !== protectedRoute.role) {
    const dashboardMap = {
      owner: '/dashboard/owner',
      tenant: '/dashboard/tenant',
      admin: '/admin',
    };
    return NextResponse.redirect(
      new URL(dashboardMap[user.role] ?? '/', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
