"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";

function formatPrice(price) {
  const n = Number(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const STATUS_COLORS = {
  pending_approval: "border-yellow-200 bg-yellow-50 text-yellow-700",
  active:           "border-green-200 bg-green-50 text-green-700",
  inactive:         "border-orange-200 bg-orange-50 text-orange-700",
  sold_out:         "border-purple-200 bg-purple-50 text-purple-700",
  rejected:         "border-red-200 bg-red-50 text-red-700",
  draft:            "border-gray-200 bg-gray-50 text-gray-600",
  archived:         "border-gray-200 bg-gray-50 text-gray-500",
};

const STATUS_LABELS = {
  pending_approval: "Pending Approval",
  active:           "Active",
  inactive:         "Inactive",
  sold_out:         "Sold Out",
  rejected:         "Rejected",
  draft:            "Draft",
  archived:         "Archived",
};

const AMENITY_LABELS = {
  power_backup: "Power Backup", lift: "Lift / Elevator", gym: "Gym",
  swimming_pool: "Swimming Pool", security: "24x7 Security", cctv: "CCTV",
  garden: "Garden", club_house: "Club House", parking: "Parking",
  visitor_parking: "Visitor Parking", intercom: "Intercom",
  fire_safety: "Fire Safety", rainwater_harvesting: "Rainwater Harvesting",
  solar_panels: "Solar Panels", gated_society: "Gated Society",
};

export default function AdminPropertyDetailPage({ params }) {
  const router = useRouter();
  const [property, setProperty]         = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [slug, setSlug]                 = useState(null);

  // Reject modal
  const [rejectModal, setRejectModal]         = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Sold Out modal
  const [soldOutModal, setSoldOutModal]     = useState(false);
  const [soldOutDate, setSoldOutDate]       = useState("");
  const [buyerPhone, setBuyerPhone]         = useState("");
  const [buyerLookup, setBuyerLookup]       = useState(null);
  const [buyerLookupLoading, setBuyerLookupLoading] = useState(false);

  useEffect(() => { params.then((p) => setSlug(p.slug)); }, [params]);

  const fetchProperty = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${slug}`);
      if (res.ok) setProperty((await res.json()).property);
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  }, [slug]);

  useEffect(() => { fetchProperty(); }, [fetchProperty]);

  const handleAction = async (action, extra = {}) => {
    if (!property) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/properties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id, action, ...extra }),
      });
      if (res.ok) {
        closeAllModals();
        fetchProperty();
      } else {
        const data = await res.json();
        alert(data.error || "Action failed");
      }
    } catch { /* ignore */ }
    finally { setActionLoading(false); }
  };

  const closeAllModals = () => {
    setRejectModal(false);   setRejectionReason("");
    setSoldOutModal(false);  setSoldOutDate(""); setBuyerPhone(""); setBuyerLookup(null);
  };

  const lookupBuyer = async (phone) => {
    if (!phone.trim()) { setBuyerLookup(null); return; }
    setBuyerLookupLoading(true);
    try {
      const res  = await fetch(`/api/admin/users?q=${encodeURIComponent(phone.trim())}&limit=1`);
      const data = await res.json();
      const match = (data.users || []).find(u => u.phone === phone.trim());
      setBuyerLookup(match ? { found: true, name: match.full_name, phone: match.phone } : { found: false });
    } catch { setBuyerLookup(null); }
    finally { setBuyerLookupLoading(false); }
  };

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
        <Link href="/admin/properties" className="mt-4 inline-block text-sm font-medium text-accent-dark hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : JSON.parse(property.amenities || "[]");

  const media = [...(property.media || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

  const status = property.status;

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
            <h1 className="text-xl font-semibold text-heading sm:text-2xl">Property Details</h1>
            <p className="text-sm text-muted">Admin Review</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
            {STATUS_LABELS[status] || status}
          </span>
          <Link
            href={`/properties/${property.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-white px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle hover:text-heading"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Public View
          </Link>
        </div>
      </div>

      {/* Pending banner */}
      {status === "pending_approval" && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-sm font-medium text-amber-800">This property is awaiting your review</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAction("approve")} disabled={actionLoading}
              className="rounded-xl bg-green-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-600 disabled:opacity-50">
              Approve
            </button>
            <button onClick={() => setRejectModal(true)} disabled={actionLoading}
              className="rounded-xl bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Rejection reason banner */}
      {status === "rejected" && property.rejection_reason && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="text-sm font-medium text-red-700">Rejected</p>
          <p className="mt-1 text-sm text-red-600">Reason: {property.rejection_reason}</p>
        </div>
      )}

      {/* Sold out banner */}
      {status === "sold_out" && (
        <div className="mb-6 rounded-2xl border border-purple-200 bg-purple-50 px-6 py-4">
          <p className="text-sm font-medium text-purple-700">Sold Out</p>
          {property.sold_out_date && (
            <p className="mt-0.5 text-sm text-purple-600">
              Date: {new Date(property.sold_out_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              {(property.buyer_name || property.buyer_phone) && ` · Buyer: ${property.buyer_name || property.buyer_phone}`}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — property content */}
        <div className="space-y-6 lg:col-span-2">
          <PropertyGallery media={media} title={property.title} />

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
                { label: "Bedrooms",     value: property.bedrooms      ? `${property.bedrooms} BHK`                 : null },
                { label: "Bathrooms",    value: property.bathrooms },
                { label: "Balconies",    value: property.balconies },
                { label: "Built-up Area",value: property.area_sqft     ? `${property.area_sqft} sq.ft`              : null },
                { label: "Carpet Area",  value: property.carpet_area_sqft ? `${property.carpet_area_sqft} sq.ft`   : null },
                { label: "Floor",        value: property.floor_number != null ? `${property.floor_number} / ${property.total_floors || "?"}` : null },
                { label: "Parking",      value: property.parking_slots != null ? `${property.parking_slots} slots` : null },
                { label: "Facing",       value: property.facing },
                { label: "Age",          value: property.age_of_property },
              ].filter(s => s.value != null).map(s => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted">{s.label}</span>
                  <span className="text-sm font-medium text-body">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

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
                {amenities.map(a => (
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

        {/* Right — owner + meta + actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Owner Info */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Owner Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {property.owner_name?.[0]?.toUpperCase() || "O"}
                </div>
                <div>
                  <p className="text-sm font-medium text-heading">{property.owner_name || "—"}</p>
                  <p className="text-xs text-muted">Property Owner</p>
                </div>
              </div>
              {property.owner_phone && (
                <a href={`tel:+91${property.owner_phone}`} className="flex items-center gap-2 text-sm text-body hover:text-accent-dark">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  +91 {property.owner_phone}
                </a>
              )}
              {(property.whatsapp_number || property.owner_phone) && (
                <a href={`https://wa.me/91${property.whatsapp_number || property.owner_phone}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-body hover:text-green-600">
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Listing Meta */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Listing Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || ""}`}>
                  {STATUS_LABELS[status] || status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Listed</span>
                <span className="font-medium text-body">
                  {new Date(property.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              {property.sold_out_date && (
                <div className="flex justify-between">
                  <span className="text-muted">Sold On</span>
                  <span className="font-medium text-body">
                    {new Date(property.sold_out_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
              {(property.buyer_name || property.buyer_phone) && (
                <div className="flex justify-between">
                  <span className="text-muted">Buyer</span>
                  <span className="font-medium text-body">{property.buyer_name || property.buyer_phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Category</span>
                <span className="font-medium capitalize text-body">{property.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Transaction</span>
                <span className="font-medium capitalize text-body">{property.transaction_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Views</span>
                <span className="font-medium text-body">{property.view_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Inquiries</span>
                <span className="font-medium text-body">{property.inquiry_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Actions</h3>
            <div className="space-y-2">

              {/* pending_approval */}
              {status === "pending_approval" && (
                <>
                  <ActionBtn color="green" icon="check" onClick={() => handleAction("approve")} loading={actionLoading}>
                    Approve Listing
                  </ActionBtn>
                  <ActionBtn color="red" icon="x" onClick={() => setRejectModal(true)} loading={actionLoading}>
                    Reject Listing
                  </ActionBtn>
                </>
              )}

              {/* active */}
              {status === "active" && (
                <>
                  <ActionBtn color="orange" icon="pause" onClick={() => handleAction("deactivate")} loading={actionLoading}>
                    Deactivate
                  </ActionBtn>
                  <ActionBtn color="purple" icon="tag" onClick={() => setSoldOutModal(true)} loading={actionLoading}>
                    Mark as Sold Out
                  </ActionBtn>
                  <ActionBtn color="gray" icon="archive" onClick={() => handleAction("archive")} loading={actionLoading}>
                    Archive
                  </ActionBtn>
                </>
              )}

              {/* inactive */}
              {status === "inactive" && (
                <>
                  <ActionBtn color="green" icon="check" onClick={() => handleAction("reactivate")} loading={actionLoading}>
                    Reactivate
                  </ActionBtn>
                  <ActionBtn color="purple" icon="tag" onClick={() => setSoldOutModal(true)} loading={actionLoading}>
                    Mark as Sold Out
                  </ActionBtn>
                  <ActionBtn color="gray" icon="archive" onClick={() => handleAction("archive")} loading={actionLoading}>
                    Archive
                  </ActionBtn>
                </>
              )}

              {/* rejected */}
              {status === "rejected" && (
                <>
                  <ActionBtn color="green" icon="check" onClick={() => handleAction("approve")} loading={actionLoading}>
                    Re-approve
                  </ActionBtn>
                  <ActionBtn color="gray" icon="archive" onClick={() => handleAction("archive")} loading={actionLoading}>
                    Archive
                  </ActionBtn>
                </>
              )}

              {/* sold_out */}
              {status === "sold_out" && (
                <ActionBtn color="gray" icon="archive" onClick={() => handleAction("archive")} loading={actionLoading}>
                  Archive
                </ActionBtn>
              )}

              {/* always — public view */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <Modal onClose={() => { setRejectModal(false); setRejectionReason(""); }}>
          <h3 className="text-lg font-semibold text-heading">Reject Property</h3>
          <p className="mt-1 text-sm text-muted">Provide a reason for rejection. The owner will see this.</p>
          <textarea
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={3}
            className="mt-4 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setRejectModal(false); setRejectionReason(""); }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle">
              Cancel
            </button>
            <button
              onClick={() => handleAction("reject", { rejectionReason })}
              disabled={!rejectionReason.trim() || actionLoading}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </Modal>
      )}

      {/* Sold Out Modal */}
      {soldOutModal && (
        <Modal onClose={closeAllModals}>
          <h3 className="text-lg font-semibold text-heading">Mark as Sold Out</h3>
          <p className="mt-1 text-sm text-muted">Record the sale date and optionally link the buyer.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-subtle">
                SOLD OUT DATE <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={soldOutDate}
                onChange={e => setSoldOutDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-subtle">BUYER PHONE (optional)</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={e => { setBuyerPhone(e.target.value); setBuyerLookup(null); }}
                  onBlur={() => lookupBuyer(buyerPhone)}
                  placeholder="e.g. 9876543210"
                  className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => lookupBuyer(buyerPhone)}
                  disabled={buyerLookupLoading || !buyerPhone.trim()}
                  className="rounded-xl border border-border bg-surface-subtle px-4 py-2.5 text-sm font-medium text-body transition hover:bg-surface-white disabled:opacity-50"
                >
                  {buyerLookupLoading ? "..." : "Look up"}
                </button>
              </div>
              {buyerLookup && (
                <p className={`mt-1.5 text-xs ${buyerLookup.found ? "text-green-600" : "text-red-500"}`}>
                  {buyerLookup.found
                    ? `Found: ${buyerLookup.name || "Unnamed user"} (${buyerLookup.phone})`
                    : "No user found with this phone number"}
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={closeAllModals}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle">
              Cancel
            </button>
            <button
              onClick={() => handleAction("mark_sold_out", {
                soldOutDate,
                buyerPhone: buyerLookup?.found ? buyerPhone.trim() : undefined,
              })}
              disabled={!soldOutDate || actionLoading || (buyerPhone.trim() && !buyerLookup?.found)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
              Confirm Sold Out
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface-white p-6 shadow-premium">{children}</div>
    </div>
  );
}

const ACTION_ICONS = {
  check:   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
  x:       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  pause:   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />,
  tag:     <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" />,
  archive: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />,
};

const ACTION_COLORS = {
  green:  "bg-green-500 hover:bg-green-600 text-white",
  red:    "bg-red-500 hover:bg-red-600 text-white",
  orange: "bg-orange-500 hover:bg-orange-600 text-white",
  purple: "bg-purple-600 hover:bg-purple-700 text-white",
  gray:   "border border-border bg-surface-white hover:bg-surface-subtle text-body",
};

function ActionBtn({ color, icon, onClick, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${ACTION_COLORS[color]}`}
    >
      {icon && (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {ACTION_ICONS[icon]}
        </svg>
      )}
      {children}
    </button>
  );
}
