"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const STATUS_TABS = [
  { label: "All",      value: "" },
  { label: "Pending",  value: "pending_approval" },
  { label: "Active",   value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Sold Out", value: "sold_out" },
  { label: "Rejected", value: "rejected" },
  { label: "Archived", value: "archived" },
];

const STATUS_COLORS = {
  pending_approval: "bg-yellow-100 text-yellow-700",
  active:           "bg-green-100 text-green-700",
  inactive:         "bg-orange-100 text-orange-700",
  sold_out:         "bg-purple-100 text-purple-700",
  rejected:         "bg-red-100 text-red-700",
  draft:            "bg-gray-100 text-gray-600",
  archived:         "bg-gray-100 text-gray-500",
};

const STATUS_LABELS = {
  pending_approval: "Pending",
  active:           "Active",
  inactive:         "Inactive",
  sold_out:         "Sold Out",
  rejected:         "Rejected",
  draft:            "Draft",
  archived:         "Archived",
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [isLoading, setIsLoading]   = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]         = useState("");
  const limit = 20;

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit });
    if (statusFilter) params.set("status", statusFilter);
    if (search)       params.set("q", search);
    try {
      const res  = await fetch(`/api/admin/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Properties</h1>
        <p className="mt-1 text-sm text-muted">Browse and manage all property listings. Click Review to take action.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                statusFilter === tab.value
                  ? "bg-accent-soft text-accent-dark"
                  : "text-muted hover:bg-surface-subtle hover:text-heading"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-border bg-surface-white px-4 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-white p-12 text-center">
          <p className="text-sm text-muted">No properties found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map(p => (
            <Link key={p.id} href={`/admin/properties/${p.slug}`} className="block rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition hover:border-accent/30 hover:shadow-elevated">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Thumbnail + info */}
                <div className="flex items-start gap-4">
                  {p.primary_image ? (
                    <img src={p.primary_image} alt={p.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
                      <svg className="h-6 w-6 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-heading">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {p.locality_name}, {p.city_name} · {p.category} · {p.transaction_type}
                    </p>
                    <p className="mt-0.5 text-xs text-subtle">
                      Owner: {p.owner_name || p.owner_phone} · Listed{" "}
                      {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {p.status === "sold_out" && p.sold_out_date && (
                      <p className="mt-0.5 text-xs text-purple-600">
                        Sold {new Date(p.sold_out_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {(p.buyer_name || p.buyer_phone) ? ` · Buyer: ${p.buyer_name || p.buyer_phone}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price + status */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="whitespace-nowrap text-sm font-semibold text-heading">
                    {Number(p.price).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[p.status] || p.status}
                  </span>
                </div>
              </div>

              {p.status === "rejected" && p.rejection_reason && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  Rejection reason: {p.rejection_reason}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-surface-subtle disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-surface-subtle disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
