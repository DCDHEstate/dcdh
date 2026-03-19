"use client";

import { useState, useEffect, useCallback } from "react";

const STATUS_OPTIONS = ["", "active", "upcoming", "completed", "terminated", "expired"];
const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
  terminated: "bg-red-100 text-red-700",
  expired: "bg-yellow-100 text-yellow-700",
};

export default function AdminTenanciesPage() {
  const [tenancies, setTenancies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchTenancies = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("q", search);
    try {
      const res = await fetch(`/api/admin/tenancies?${params}`);
      const data = await res.json();
      setTenancies(data.tenancies || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchTenancies();
  }, [fetchTenancies]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Tenancies</h1>
          <p className="mt-1 text-sm text-muted">Manage lease agreements between tenants and properties.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Tenancy
        </button>
      </div>

      {showForm && (
        <CreateTenancyForm
          onSuccess={() => {
            setShowForm(false);
            fetchTenancies();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by property, tenant, or owner..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th className="px-4 py-3 font-medium text-muted">Property</th>
              <th className="px-4 py-3 font-medium text-muted">Tenant</th>
              <th className="px-4 py-3 font-medium text-muted">Rent</th>
              <th className="px-4 py-3 font-medium text-muted">Lease Period</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="h-5 w-full animate-pulse rounded bg-surface-subtle" />
                  </td>
                </tr>
              ))
            ) : tenancies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  No tenancies found.
                </td>
              </tr>
            ) : (
              tenancies.map((t) => (
                <tr key={t.id} className="border-b border-border hover:bg-surface-subtle/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-heading">{t.property_title}</p>
                    <p className="text-xs text-muted">{t.owner_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-body">{t.tenant_name}</p>
                    <p className="text-xs text-muted">{t.tenant_phone}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-heading">
                    ₹{Number(t.monthly_rent).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(t.lease_start_date).toLocaleDateString("en-IN")} —{" "}
                    {new Date(t.lease_end_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[t.status] || "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusUpdater tenancy={t} onUpdate={fetchTenancies} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted">Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40">Prev</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(page + 1)} className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusUpdater({ tenancy, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await fetch("/api/admin/tenancies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenancyId: tenancy.id, status: newStatus }),
      });
      onUpdate();
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  if (updating) return <span className="text-xs text-muted">Updating...</span>;

  return (
    <select
      defaultValue=""
      onChange={(e) => e.target.value && updateStatus(e.target.value)}
      className="rounded-lg border border-border bg-surface-white px-2 py-1 text-xs outline-none focus:border-accent"
    >
      <option value="" disabled>Change status</option>
      {STATUS_OPTIONS.filter((s) => s && s !== tenancy.status).map((s) => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  );
}

function CreateTenancyForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    propertyId: "", tenantId: "", leaseStartDate: "", leaseEndDate: "",
    monthlyRent: "", securityDeposit: "", maintenanceCharge: "", rentDueDay: "1",
    lockInPeriodMonths: "", noticePeriodDays: "30", annualIncrementPercent: "",
  });
  const [propertySearch, setPropertySearch] = useState("");
  const [tenantSearch, setTenantSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Search properties
  useEffect(() => {
    if (propertySearch.length < 2) return;
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/properties?q=${encodeURIComponent(propertySearch)}&limit=10`);
      const data = await res.json();
      setProperties(data.properties || []);
    }, 300);
    return () => clearTimeout(t);
  }, [propertySearch]);

  // Search tenants
  useEffect(() => {
    if (tenantSearch.length < 2) return;
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(tenantSearch)}&role=tenant&limit=10`);
      const data = await res.json();
      setTenants(data.users || []);
    }, 300);
    return () => clearTimeout(t);
  }, [tenantSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/tenancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlyRent: Number(form.monthlyRent),
          securityDeposit: form.securityDeposit ? Number(form.securityDeposit) : null,
          maintenanceCharge: form.maintenanceCharge ? Number(form.maintenanceCharge) : 0,
          rentDueDay: Number(form.rentDueDay),
          lockInPeriodMonths: form.lockInPeriodMonths ? Number(form.lockInPeriodMonths) : null,
          noticePeriodDays: Number(form.noticePeriodDays),
          annualIncrementPercent: form.annualIncrementPercent ? Number(form.annualIncrementPercent) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create tenancy");
        return;
      }
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent";
  const labelClass = "block text-xs font-medium text-muted mb-1";

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-heading">Create New Tenancy</h2>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Property selector */}
        <div>
          <label className={labelClass}>Property *</label>
          <input
            type="text"
            placeholder="Search properties..."
            value={propertySearch}
            onChange={(e) => setPropertySearch(e.target.value)}
            className={inputClass}
          />
          {properties.length > 0 && !form.propertyId && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-surface-white shadow-md">
              {properties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setForm({ ...form, propertyId: p.id }); setPropertySearch(p.title); setProperties([]); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface-subtle"
                >
                  <p className="font-medium text-heading">{p.title}</p>
                  <p className="text-xs text-muted">{p.owner_name} · {p.status}</p>
                </button>
              ))}
            </div>
          )}
          {form.propertyId && (
            <button type="button" onClick={() => { setForm({ ...form, propertyId: "" }); setPropertySearch(""); }} className="mt-1 text-xs text-accent hover:underline">
              Clear selection
            </button>
          )}
        </div>

        {/* Tenant selector */}
        <div>
          <label className={labelClass}>Tenant *</label>
          <input
            type="text"
            placeholder="Search tenants by name or phone..."
            value={tenantSearch}
            onChange={(e) => setTenantSearch(e.target.value)}
            className={inputClass}
          />
          {tenants.length > 0 && !form.tenantId && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-surface-white shadow-md">
              {tenants.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setForm({ ...form, tenantId: u.id }); setTenantSearch(u.full_name || u.phone); setTenants([]); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface-subtle"
                >
                  <p className="font-medium text-heading">{u.full_name || "Unnamed"}</p>
                  <p className="text-xs text-muted">{u.phone}</p>
                </button>
              ))}
            </div>
          )}
          {form.tenantId && (
            <button type="button" onClick={() => { setForm({ ...form, tenantId: "" }); setTenantSearch(""); }} className="mt-1 text-xs text-accent hover:underline">
              Clear selection
            </button>
          )}
        </div>

        <div>
          <label className={labelClass}>Lease Start Date *</label>
          <input type="date" value={form.leaseStartDate} onChange={(e) => setForm({ ...form, leaseStartDate: e.target.value })} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Lease End Date *</label>
          <input type="date" value={form.leaseEndDate} onChange={(e) => setForm({ ...form, leaseEndDate: e.target.value })} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Monthly Rent (₹) *</label>
          <input type="number" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} className={inputClass} required min="0" />
        </div>
        <div>
          <label className={labelClass}>Security Deposit (₹)</label>
          <input type="number" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} className={inputClass} min="0" />
        </div>
        <div>
          <label className={labelClass}>Maintenance Charge (₹)</label>
          <input type="number" value={form.maintenanceCharge} onChange={(e) => setForm({ ...form, maintenanceCharge: e.target.value })} className={inputClass} min="0" />
        </div>
        <div>
          <label className={labelClass}>Rent Due Day (1-28)</label>
          <input type="number" value={form.rentDueDay} onChange={(e) => setForm({ ...form, rentDueDay: e.target.value })} className={inputClass} min="1" max="28" />
        </div>
        <div>
          <label className={labelClass}>Lock-in Period (months)</label>
          <input type="number" value={form.lockInPeriodMonths} onChange={(e) => setForm({ ...form, lockInPeriodMonths: e.target.value })} className={inputClass} min="0" />
        </div>
        <div>
          <label className={labelClass}>Notice Period (days)</label>
          <input type="number" value={form.noticePeriodDays} onChange={(e) => setForm({ ...form, noticePeriodDays: e.target.value })} className={inputClass} min="0" />
        </div>
        <div>
          <label className={labelClass}>Annual Increment (%)</label>
          <input type="number" value={form.annualIncrementPercent} onChange={(e) => setForm({ ...form, annualIncrementPercent: e.target.value })} className={inputClass} min="0" max="100" step="0.5" />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={submitting || !form.propertyId || !form.tenantId}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Tenancy"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-muted hover:bg-surface-subtle">
          Cancel
        </button>
      </div>
    </form>
  );
}
