"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatPrice(price) {
  const n = Number(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const STATUS_CONFIG = {
  pending_approval: { label: "Under Review", color: "border-yellow-200 bg-yellow-50 text-yellow-700", description: "Your listing is being reviewed by the DCDH team and will go live within 24 hours." },
  active: { label: "Active", color: "border-green-200 bg-green-50 text-green-700", description: "Your property is live and visible to everyone." },
  rejected: { label: "Rejected", color: "border-red-200 bg-red-50 text-red-700", description: null },
  draft: { label: "Draft", color: "border-gray-200 bg-gray-50 text-gray-600", description: "This listing is not yet published." },
  archived: { label: "Archived", color: "border-gray-200 bg-gray-50 text-gray-600", description: "This listing has been archived and is no longer visible." },
};

const AMENITY_LABELS = {
  power_backup: "Power Backup", lift: "Lift / Elevator", gym: "Gym", swimming_pool: "Swimming Pool",
  security: "24x7 Security", cctv: "CCTV", garden: "Garden", club_house: "Club House",
  parking: "Parking", visitor_parking: "Visitor Parking", intercom: "Intercom", fire_safety: "Fire Safety",
  rainwater_harvesting: "Rainwater Harvesting", solar_panels: "Solar Panels", gated_society: "Gated Society",
};

export default function OwnerPropertyDetailPage({ params }) {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const fetchProperty = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/properties/mine/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data.property);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-surface-subtle" />
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface-white" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-surface-white p-12 text-center">
        <p className="text-sm text-muted">Property not found.</p>
        <Link href="/dashboard/owner/properties" className="mt-4 inline-block text-sm font-medium text-accent-dark hover:underline">
          Back to My Properties
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[property.status] || STATUS_CONFIG.draft;
  const amenities = Array.isArray(property.amenities) ? property.amenities : JSON.parse(property.amenities || "[]");
  const media = property.media || [];
  const primaryMedia = media.find((m) => m.is_primary) || media[0];
  const otherMedia = media.filter((m) => !m.is_primary).slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-white text-muted transition hover:bg-surface-subtle hover:text-heading"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-heading sm:text-2xl">My Property</h1>
            <p className="text-sm text-muted">Manage your listing</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {property.status === "active" && (
            <Link
              href={`/properties/${property.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-white px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle hover:text-heading"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Public Page
            </Link>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {property.status === "pending_approval" && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-4">
          <svg className="h-5 w-5 shrink-0 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm text-yellow-800">{statusInfo.description}</span>
        </div>
      )}
      {property.status === "rejected" && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="text-sm font-medium text-red-700">Listing Rejected</p>
          {property.rejection_reason && (
            <p className="mt-1 text-sm text-red-600">Reason: {property.rejection_reason}</p>
          )}
          <p className="mt-2 text-sm text-red-600">
            Please contact support or edit and resubmit your listing.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — property content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Gallery */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-subtle">
            {primaryMedia ? (
              <div className="relative aspect-video w-full overflow-hidden">
                <img src={primaryMedia.media_url} alt={property.title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-surface-subtle">
                <svg className="h-16 w-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {otherMedia.length > 0 && (
              <div className="grid grid-cols-5 gap-1 p-1">
                {otherMedia.map((m, i) => (
                  <img key={i} src={m.media_url} alt={`Photo ${i + 2}`} className="aspect-square w-full rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>

          {/* Title + Price */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-heading">{property.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {property.locality_name}, {property.city_name}, {property.state_name}
                  {property.pincode ? ` – ${property.pincode}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
                {property.transaction_type === "rent" && <p className="text-xs text-muted">/month</p>}
                {property.price_negotiable && (
                  <span className="mt-1 inline-block rounded-full bg-verified/10 px-2 py-0.5 text-xs font-medium text-verified">Negotiable</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs capitalize text-body">
                {property.transaction_type === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs capitalize text-body">
                {property.property_type?.replace("_", " ")}
              </span>
              {property.furnishing && (
                <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs capitalize text-body">
                  {property.furnishing.replace("_", " ")}
                </span>
              )}
            </div>
          </div>

          {/* Specs */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Property Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {[
                { label: "Bedrooms", value: property.bedrooms ? `${property.bedrooms} BHK` : null },
                { label: "Bathrooms", value: property.bathrooms },
                { label: "Balconies", value: property.balconies },
                { label: "Built-up Area", value: property.area_sqft ? `${property.area_sqft} sq.ft` : null },
                { label: "Carpet Area", value: property.carpet_area_sqft ? `${property.carpet_area_sqft} sq.ft` : null },
                { label: "Floor", value: property.floor_number != null ? `${property.floor_number} / ${property.total_floors || "?"}` : null },
                { label: "Parking", value: property.parking_slots != null ? `${property.parking_slots} slots` : null },
                { label: "Facing", value: property.facing },
                { label: "Age", value: property.age_of_property },
              ].filter((s) => s.value != null).map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted">{s.label}</span>
                  <span className="text-sm font-medium text-body">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing breakdown — rent only */}
          {property.transaction_type === "rent" && (property.security_deposit || property.maintenance_charge) && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <h3 className="mb-4 text-base font-semibold text-heading">Pricing Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Monthly Rent</span>
                  <span className="font-medium text-body">{formatPrice(property.price)}</span>
                </div>
                {property.maintenance_charge && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Maintenance</span>
                    <span className="font-medium text-body">{formatPrice(property.maintenance_charge)}/mo</span>
                  </div>
                )}
                {property.security_deposit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Security Deposit</span>
                    <span className="font-medium text-body">{formatPrice(property.security_deposit)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <h3 className="mb-3 text-base font-semibold text-heading">About this Property</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-body">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <h3 className="mb-4 text-base font-semibold text-heading">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-body">
                    <svg className="h-3.5 w-3.5 text-verified" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {AMENITY_LABELS[a] || a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — listing info + actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Listing Info */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Listing Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Listed</span>
                <span className="font-medium text-body">
                  {new Date(property.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Category</span>
                <span className="font-medium capitalize text-body">{property.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Transaction</span>
                <span className="font-medium capitalize text-body">{property.transaction_type}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Actions</h3>
            <div className="space-y-2">
              {property.status === "active" && (
                <Link
                  href={`/properties/${property.slug}`}
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm font-medium text-body transition hover:bg-surface-subtle"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  View Public Page
                </Link>
              )}
              <Link
                href="/dashboard/owner/properties"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm font-medium text-body transition hover:bg-surface-subtle"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                All My Properties
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-3 text-base font-semibold text-heading">Need Help?</h3>
            <p className="mb-4 text-xs text-muted">
              Contact us for any questions about your listing.
            </p>
            <a
              href="https://wa.me/919257533440"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
