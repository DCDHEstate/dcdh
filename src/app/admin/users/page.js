"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLE_TABS = [
  { label: "All", value: "" },
  { label: "Owners", value: "owner" },
  { label: "Tenants", value: "tenant" },
];

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Pending", value: "pending_verification" },
];

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  pending_verification: "bg-yellow-100 text-yellow-700",
};

const EMPTY_FORM = {
  fullName: "", phone: "", email: "", whatsappNumber: "", role: "tenant", status: "active",
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function AddUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      onCreated(data.user);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface-white p-6 shadow-premium">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-heading">Add User</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-subtle">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Full Name *</label>
              <input
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Ravi Kumar"
                required
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Phone * (10 digits)</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="9876543210"
                required
                maxLength={10}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">WhatsApp</label>
              <input
                value={form.whatsappNumber}
                onChange={(e) => set("whatsappNumber", e.target.value)}
                placeholder="Same as phone"
                maxLength={10}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="ravi@example.com"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Role *</label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="tenant">Tenant</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="active">Active</option>
                <option value="pending_verification">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit });
    if (roleFilter) params.set("role", roleFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("q", search);

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [page, roleFilter, statusFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (userId, action) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) fetchUsers();
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreated = (newUser) => {
    setShowAddModal(false);
    router.push(`/admin/users/${newUser.id}`);
  };

  const totalPages = Math.ceil(total / limit);

  const getInitials = (user) => {
    if (user.full_name) {
      return user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user.phone?.slice(-2) || "U";
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted">
            Manage platform users — owners and tenants.
            {total > 0 && <span className="ml-2 font-medium text-body">{total} total</span>}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setRoleFilter(tab.value); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  roleFilter === tab.value
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
            placeholder="Search name, phone or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-border bg-surface-white px-4 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-72"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-subtle hover:text-heading"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-white p-12 text-center">
          <p className="text-sm text-muted">No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dark text-sm font-semibold text-white">
                  {getInitials(u)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {u.full_name || <span className="italic text-muted">No name</span>}
                  </p>
                  <p className="text-xs text-muted">
                    +91 {u.phone}
                    {u.email && ` · ${u.email}`}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    Joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {u.role === "owner" && u.property_count > 0 && (
                      <> · {u.property_count} {u.property_count === 1 ? "property" : "properties"}</>
                    )}
                    <> · Last login: {formatRelativeTime(u.last_login_at)}</>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium capitalize text-accent-muted">
                  {u.role}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[u.status] || "bg-gray-100 text-gray-600"}`}>
                  {u.status.replace("_", " ")}
                </span>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="rounded-lg border border-border bg-surface-white px-3 py-1.5 text-xs font-medium text-body transition hover:bg-surface-subtle hover:text-heading"
                >
                  View
                </Link>
                <button
                  onClick={() => handleAction(u.id, u.status === "suspended" ? "activate" : "suspend")}
                  disabled={actionLoading === u.id}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                    u.status === "suspended"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {actionLoading === u.id ? "…" : u.status === "suspended" ? "Activate" : "Suspend"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-surface-subtle disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-surface-subtle disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
