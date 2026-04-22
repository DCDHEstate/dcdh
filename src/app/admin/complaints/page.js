"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const STATUS_COLORS = {
  open: "bg-red-100 text-red-700",
  acknowledged: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
  reopened: "bg-orange-100 text-orange-700",
};

const PRIORITY_COLORS = {
  low: "text-gray-500",
  medium: "text-yellow-600",
  high: "text-orange-600",
  urgent: "text-red-600",
};

const STATUS_OPTIONS = ["open", "acknowledged", "in_progress", "resolved", "closed"];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    try {
      const res = await fetch(`/api/complaints?${params}`);
      const data = await res.json();
      setComplaints(data.complaints || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (complaintId, newStatus) => {
    try {
      await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchComplaints();
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">Complaints</h1>
        <p className="mt-1 text-sm text-muted">Manage maintenance requests and tenant complaints.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-surface-white" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface-white p-10 text-center text-sm text-muted">No complaints found.</div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-surface-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/admin/complaints/${c.id}`} className="block truncate font-medium text-accent hover:underline">
                      {c.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{c.category.replace("_", " ")} · {new Date(c.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-600"}`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-subtle">Property</p>
                    <p className="truncate text-body">{c.property_title}</p>
                  </div>
                  <div>
                    <p className="text-subtle">Priority</p>
                    <span className={`font-semibold capitalize ${PRIORITY_COLORS[c.priority]}`}>{c.priority}</span>
                  </div>
                  <div>
                    <p className="text-subtle">Tenant</p>
                    <p className="text-body">{c.tenant_name}</p>
                    <p className="text-muted">{c.tenant_phone}</p>
                  </div>
                </div>
                <div className="mt-3 border-t border-border-light pt-3">
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && updateStatus(c.id, e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-white px-3 py-2 text-xs outline-none focus:border-accent"
                  >
                    <option value="" disabled>Update status…</option>
                    {STATUS_OPTIONS.filter((s) => s !== c.status).map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-surface-white shadow-soft sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th className="px-4 py-3 font-medium text-muted">Title</th>
              <th className="px-4 py-3 font-medium text-muted">Property</th>
              <th className="px-4 py-3 font-medium text-muted">Tenant</th>
              <th className="px-4 py-3 font-medium text-muted">Priority</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={6} className="px-4 py-4"><div className="h-5 w-full animate-pulse rounded bg-surface-subtle" /></td>
                </tr>
              ))
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">No complaints found.</td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-surface-subtle/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/complaints/${c.id}`} className="font-medium text-accent hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-xs text-muted">{c.category.replace("_", " ")} · {new Date(c.created_at).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3 text-body">{c.property_title}</td>
                  <td className="px-4 py-3">
                    <p className="text-body">{c.tenant_name}</p>
                    <p className="text-xs text-muted">{c.tenant_phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold capitalize ${PRIORITY_COLORS[c.priority]}`}>{c.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-600"}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue=""
                      onChange={(e) => e.target.value && updateStatus(c.id, e.target.value)}
                      className="rounded-lg border border-border bg-surface-white px-2 py-1 text-xs outline-none focus:border-accent"
                    >
                      <option value="" disabled>Update</option>
                      {STATUS_OPTIONS.filter((s) => s !== c.status).map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
