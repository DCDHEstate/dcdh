"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // TODO: Implement Google OAuth sign-in
    // This will redirect to Google OAuth flow
    try {
      // window.location.href = '/api/auth/google';
      console.log("Google Sign-In initiated");
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Auth Card */}
      <div className="rounded-2xl border border-border bg-surface-white p-8 shadow-soft">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/50 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-xs font-medium tracking-elegant text-accent-muted">
              WELCOME BACK
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-heading">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted">
            Access your personalized real estate dashboard
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-white px-6 py-4 text-base font-medium text-heading shadow-sm transition-all duration-300 hover:border-border hover:bg-surface-subtle hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-white px-4 text-subtle">
              Secure authentication
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-verified/10">
              <svg
                className="h-3.5 w-3.5 text-verified"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span>No passwords to remember</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-verified/10">
              <svg
                className="h-3.5 w-3.5 text-verified"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span>Verified email automatically</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-verified/10">
              <svg
                className="h-3.5 w-3.5 text-verified"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span>Industry-standard security</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-accent transition-colors hover:text-accent-dark"
          >
            Create one now
          </Link>
        </p>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-xs text-subtle">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>256-bit SSL</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs text-subtle">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}
