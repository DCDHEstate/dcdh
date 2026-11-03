export const runtime = 'nodejs'; // postgres.js uses Node.js TCP sockets, not Edge

import { NextResponse } from 'next/server';
import { getSession, SESSION_COOKIE_NAME } from '@/lib/session';

// A shared referral link (`/?ref=CODE`) has to survive the whole OTP round
// trip — page load, phone entry, WhatsApp, coming back to type the code — so
// the code is parked in a cookie the moment it is seen, on whatever page it
// lands on. verify-otp reads it back and clears it.
const REF_COOKIE_NAME = 'dcdh_ref';
const REF_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function readReferralCode(request) {
  const raw = request.nextUrl.searchParams.get('ref') ?? '';
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}

function captureReferralCode(request, response) {
  const code = readReferralCode(request);
  if (!code) return response;

  response.cookies.set(REF_COOKIE_NAME, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REF_COOKIE_MAX_AGE,
    path: '/',
  });
  return response;
}

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
      // An already-signed-in visitor following someone's link keeps the code in
      // the cookie — they can still apply it from their profile page.
      if (dest) {
        return captureReferralCode(
          request,
          NextResponse.redirect(new URL(dest, request.url)),
        );
      }
    }

    // A logged-out visitor on a referral link is there to sign up, so skip the
    // home page and open the OTP form. New links already point at /auth/login;
    // this keeps the `/?ref=CODE` links shared before that change working.
    // The whole query string is carried over so utm_* tags survive.
    if (readReferralCode(request)) {
      const signupUrl = new URL(`/auth/login${request.nextUrl.search}`, request.url);
      return captureReferralCode(request, NextResponse.redirect(signupUrl));
    }

    return NextResponse.next();
  }

  // The public "Refer & Earn" entry point (home page buttons link here). The
  // program lives in each dashboard, so send members straight to theirs — with
  // the right form open when a button asked for one — and everyone else to
  // sign in first, returning here afterwards.
  if (pathname === '/referral') {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME);
    const user = cookie?.value ? await getSession(cookie.value) : null;
    const type = request.nextUrl.searchParams.get('type');
    const formType = type === 'friend' || type === 'property' ? type : null;

    if (user && user.status !== 'suspended' && user.role) {
      const dest =
        user.role === 'admin'
          ? new URL('/admin/referrals', request.url)
          : new URL(`/dashboard/${user.role === 'owner' ? 'owner' : 'tenant'}/referrals`, request.url);
      if (formType && user.role !== 'admin') dest.searchParams.set('new', formType);
      return NextResponse.redirect(dest);
    }

    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', formType ? `/referral?type=${formType}` : '/referral');
    return NextResponse.redirect(loginUrl);
  }

  // Find matching protected route — if none, allow through
  const protectedRoute = PROTECTED_ROUTES.find((r) => r.pattern.test(pathname));
  if (!protectedRoute) return captureReferralCode(request, NextResponse.next());

  // Validate session from cookie
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const token = cookie?.value;
  const user = token ? await getSession(token) : null;

  // Not authenticated → redirect to login, preserving intended destination
  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return captureReferralCode(request, NextResponse.redirect(loginUrl));
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

  return captureReferralCode(request, NextResponse.next());
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
