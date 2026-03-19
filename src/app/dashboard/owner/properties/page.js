"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/dashboard/PropertyCard";

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/properties/mine")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">My Properties</h1>
          <p className="mt-1 text-sm text-muted">
            {total} {total === 1 ? "property" : "properties"} listed
          </p>
        </div>
        <Link
          href="/dashboard/owner/post-property"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Post Property</span>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-border bg-surface-white"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && properties.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-white py-16 text-center shadow-soft">
          <svg
            className="mb-4 h-16 w-16 text-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-heading">No properties yet</h3>
          <p className="mb-6 max-w-sm text-sm text-muted">
            Start by posting your first property. It only takes a few minutes.
          </p>
          <Link
            href="/dashboard/owner/post-property"
            className="btn-premium rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover"
          >
            Post Your First Property
          </Link>
        </div>
      )}

      {/* Properties Grid */}
      {!isLoading && properties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              actions={[
                {
                  label: "View",
                  onClick: () =>
                    (window.location.href = `/dashboard/owner/properties/${property.slug}`),
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
