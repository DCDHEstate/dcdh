"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";

export default function TenantDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/tenant/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">
          Tenant Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Find your perfect home and manage your property journey.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface-white"
            />
          ))
        ) : (
          <>
            <StatCard
              title="Saved Properties"
              value={stats?.savedProperties ?? 0}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              }
            />
            <StatCard
              title="My Inquiries"
              value={stats?.totalInquiries ?? 0}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/properties"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-all hover:border-accent/30 hover:shadow-elevated"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">Browse Properties</p>
            <p className="text-xs text-muted">Find homes for rent or purchase</p>
          </div>
        </Link>
        <Link
          href="/dashboard/tenant/saved"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-all hover:border-accent/30 hover:shadow-elevated"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">Saved Properties</p>
            <p className="text-xs text-muted">View your wishlist</p>
          </div>
        </Link>
      </div>

      {/* Recommendations Placeholder */}
      <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold text-heading">Recommended for You</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="mb-3 h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
          </svg>
          <p className="text-sm text-muted">
            Property recommendations will appear here based on your preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
