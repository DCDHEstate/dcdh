"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/owner/stats")
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
          Owner Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your properties, track leads, and grow your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface-white"
            />
          ))
        ) : (
          <>
            <StatCard
              title="Total Properties"
              value={stats?.totalProperties ?? 0}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              }
            />
            <StatCard
              title="Active Listings"
              value={stats?.activeListings ?? 0}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Leads"
              value={stats?.totalLeads ?? 0}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Views"
              value={stats?.totalViews ?? 0}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/owner/post-property"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-all hover:border-accent/30 hover:shadow-elevated"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">Post New Property</p>
            <p className="text-xs text-muted">List a property for rent or sale</p>
          </div>
        </Link>
        <Link
          href="/dashboard/owner/properties"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-all hover:border-accent/30 hover:shadow-elevated"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">View All Properties</p>
            <p className="text-xs text-muted">Manage your property listings</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold text-heading">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="mb-3 h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-muted">
            Activity feed will appear here as you get leads and inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
