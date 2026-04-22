"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
  active: "border-green-200 bg-green-50 text-green-700",
  suspended: "border-red-200 bg-red-50 text-red-700",
  pending_verification: "border-yellow-200 bg-yellow-50 text-yellow-700",
};

const PROPERTY_STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  pending_approval: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-500",
  archived: "bg-gray-100 text-gray-500",
};

const TENANCY_STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-500",
  terminated: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

function formatPrice(price) {
  const n = Number(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

function EditUserModal({ user, ownerProfile, tenantProfile, onClose, onSaved }) {
  const [form, setForm] = useState({
    fullName: user.full_name || "",
    phone: user.phone || "",
    email: user.email || "",
    whatsappNumber: user.whatsapp_number || "",
    role: user.role || "tenant",
    status: user.status || "active",
    // owner
    companyName: ownerProfile?.company_name || "",
    address: ownerProfile?.address || "",
    pincode: ownerProfile?.pincode || "",
    // tenant
    occupation: tenantProfile?.occupation || "",
    tenantCompanyName: tenantProfile?.company_name || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      onSaved();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface-white shadow-premium">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-heading">Edit User</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-subtle">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">

            {/* Core fields */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Account</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted">Full Name</label>
                  <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Phone (10 digits)</label>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={10}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">WhatsApp</label>
                  <input value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} maxLength={10}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted">Email</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Role</label>
                  <select value={form.role} onChange={(e) => set("role", e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="tenant">Tenant</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="active">Active</option>
                    <option value="pending_verification">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Owner profile fields */}
            {form.role === "owner" && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Owner Profile</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-muted">Company / Business Name</label>
                    <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-muted">Address</label>
                    <input value={form.address} onChange={(e) => set("address", e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Pincode</label>
                    <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                </div>
              </div>
            )}

            {/* Tenant profile fields */}
            {form.role === "tenant" && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Tenant Profile</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Occupation</label>
                    <input value={form.occupation} onChange={(e) => set("occupation", e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Company Name</label>
                    <input value={form.tenantCompanyName} onChange={(e) => set("tenantCompanyName", e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-50">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h2 className="text-base font-semibold text-heading">{title}</h2>
      {count != null && (
        <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-medium text-muted">
          {count}
        </span>
      )}
    </div>
  );
}

export default function AdminUserDetailPage({ params }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    params.then((p) => setUserId(p.id));
  }, [params]);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) setData(await res.json());
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchUser();
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-subtle" />
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface-white" />
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface-white" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-surface-white p-12 text-center">
        <p className="text-sm text-muted">User not found.</p>
        <Link href="/admin/users" className="mt-4 inline-block text-sm font-medium text-accent-dark hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  const { user, properties, tenanciesAsTenant, tenanciesAsOwner, leads } = data;

  const getInitials = () => {
    if (user.full_name) {
      return user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user.phone?.slice(-2) || "U";
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
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
            <h1 className="text-xl font-semibold text-heading sm:text-2xl">User Details</h1>
            <p className="text-sm text-muted">Admin View</p>
          </div>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface-white px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-subtle hover:text-heading"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
          Edit User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">

          {/* Profile card */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dark text-lg font-bold text-white">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-heading">
                    {user.full_name || <span className="italic text-muted">No name set</span>}
                  </h2>
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium capitalize text-accent-muted">
                    {user.role}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[user.status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                    {user.status?.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="flex items-center gap-2 text-sm text-body">
                    <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    +91 {user.phone}
                    {user.is_phone_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </p>
                  {user.email && (
                    <p className="flex items-center gap-2 text-sm text-body">
                      <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {user.email}
                    </p>
                  )}
                  {(user.whatsapp_number || user.phone) && (
                    <a
                      href={`https://wa.me/91${user.whatsapp_number || user.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-body hover:text-green-600"
                    >
                      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Properties (owners) */}
          {user.role === "owner" && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <SectionHeader title="Properties" count={properties.length} />
              {properties.length === 0 ? (
                <p className="text-sm text-muted">No properties listed yet.</p>
              ) : (
                <div className="space-y-3">
                  {properties.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/properties/${p.slug}`}
                          className="text-sm font-medium text-heading hover:text-accent-dark truncate block"
                        >
                          {p.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {p.locality_name}, {p.city_name} · {formatPrice(p.price)}
                          {p.transaction_type === "rent" ? "/mo" : ""} · {p.lead_count} leads
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PROPERTY_STATUS_COLORS[p.status] || "bg-gray-100 text-gray-500"}`}>
                          {p.status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-subtle">{formatDate(p.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tenancies as tenant */}
          {user.role === "tenant" && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <SectionHeader title="Tenancies" count={tenanciesAsTenant.length} />
              {tenanciesAsTenant.length === 0 ? (
                <p className="text-sm text-muted">No tenancies found.</p>
              ) : (
                <div className="space-y-3">
                  {tenanciesAsTenant.map((t) => (
                    <div key={t.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-heading">{t.property_title}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            Owner: {t.owner_name || t.owner_phone} · {formatPrice(t.monthly_rent)}/mo
                          </p>
                          <p className="mt-0.5 text-xs text-subtle">
                            {formatDate(t.lease_start_date)} → {formatDate(t.lease_end_date)}
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${TENANCY_STATUS_COLORS[t.status] || "bg-gray-100 text-gray-500"}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tenancies as owner */}
          {user.role === "owner" && tenanciesAsOwner.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <SectionHeader title="Active Tenancies" count={tenanciesAsOwner.length} />
              <div className="space-y-3">
                {tenanciesAsOwner.map((t) => (
                  <div key={t.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-heading">{t.property_title}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          Tenant: {t.tenant_name || t.tenant_phone} · {formatPrice(t.monthly_rent)}/mo
                        </p>
                        <p className="mt-0.5 text-xs text-subtle">
                          {formatDate(t.lease_start_date)} → {formatDate(t.lease_end_date)}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${TENANCY_STATUS_COLORS[t.status] || "bg-gray-100 text-gray-500"}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads submitted */}
          {leads.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <SectionHeader title="Enquiries Submitted" count={leads.length} />
              <div className="space-y-3">
                {leads.map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-heading">{l.property_title}</p>
                      <p className="mt-0.5 text-xs text-muted">{formatDate(l.created_at)} · {l.source}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
                      l.status === "new" ? "bg-blue-50 text-blue-600" :
                      l.status === "contacted" ? "bg-yellow-50 text-yellow-600" :
                      l.status === "converted" ? "bg-green-50 text-green-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-1">

          {/* Account Info */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">User ID</span>
                <span className="font-mono text-xs text-body">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Role</span>
                <span className="font-medium capitalize text-body">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[user.status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                  {user.status?.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Joined</span>
                <span className="font-medium text-body">{formatDate(user.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Last login</span>
                <span className="font-medium text-body">{formatRelativeTime(user.last_login_at)}</span>
              </div>
              {user.role === "owner" && (
                <div className="flex justify-between">
                  <span className="text-muted">Properties</span>
                  <span className="font-medium text-body">{properties.length}</span>
                </div>
              )}
              {user.role === "tenant" && (
                <div className="flex justify-between">
                  <span className="text-muted">Tenancies</span>
                  <span className="font-medium text-body">{tenanciesAsTenant.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
            <h3 className="mb-4 text-base font-semibold text-heading">Actions</h3>
            <div className="space-y-2">
              {user.status !== "suspended" ? (
                <button
                  onClick={() => handleAction("suspend")}
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  {actionLoading ? "Suspending…" : "Suspend Account"}
                </button>
              ) : (
                <button
                  onClick={() => handleAction("activate")}
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-600 disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {actionLoading ? "Activating…" : "Activate Account"}
                </button>
              )}
              {user.role === "owner" && (
                <Link
                  href={`/admin/properties?ownerId=${user.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm font-medium text-body transition hover:bg-surface-subtle"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                  </svg>
                  View All Properties
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditUserModal
          user={user}
          ownerProfile={data.ownerProfile}
          tenantProfile={data.tenantProfile}
          onClose={() => setShowEdit(false)}
          onSaved={() => { setShowEdit(false); fetchUser(); }}
        />
      )}
    </div>
  );
}
