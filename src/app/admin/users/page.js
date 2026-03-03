"use client";

import { useState, useEffect, useCallback } from "react";

const ROLE_TABS = [
  { label: "All", value: "" },
  { label: "Owners", value: "owner" },
  { label: "Tenants", value: "tenant" },
];

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  pending_verification: "bg-yellow-100 text-yellow-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit });
    if (roleFilter) params.set("role", roleFilter);
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
  }, [page, roleFilter, search]);

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
      if (res.ok) {
        fetchUsers();
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const getInitials = (user) => {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.phone?.slice(-2) || "U";
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage platform users — owners and tenants.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          placeholder="Search name or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
        />
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
                    {u.full_name || "No name"}
                  </p>
                  <p className="text-xs text-muted">
                    +91 {u.phone}
                    {u.email && ` · ${u.email}`}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    Joined{" "}
                    {new Date(u.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {u.role === "owner" && u.property_count > 0 && (
                      <> · {u.property_count} properties</>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium capitalize text-accent-muted">
                  {u.role}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[u.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.status.replace("_", " ")}
                </span>
                <button
                  onClick={() => handleAction(u.id, u.status === "suspended" ? "activate" : "suspend")}
                  disabled={actionLoading === u.id}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                    u.status === "suspended"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {u.status === "suspended" ? "Activate" : "Suspend"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-surface-subtle disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-surface-subtle disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
