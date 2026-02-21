"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/dashboard/PropertyCard";

export default function TenantSavedPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchSaved = () => {
    setIsLoading(true);
    fetch("/api/properties/saved")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (propertyId) => {
    try {
      await fetch("/api/properties/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setTotal((prev) => prev - 1);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">Saved Properties</h1>
        <p className="mt-1 text-sm text-muted">
          {total} {total === 1 ? "property" : "properties"} saved
        </p>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-heading">No saved properties</h3>
          <p className="mb-6 max-w-sm text-sm text-muted">
            Browse properties and save the ones you like to view them here.
          </p>
          <Link
            href="/properties"
            className="btn-premium rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover"
          >
            Browse Properties
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
                    window.open(`/properties/${property.slug}`, "_blank"),
                },
                {
                  label: "Unsave",
                  variant: "danger",
                  onClick: () => handleUnsave(property.id),
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
