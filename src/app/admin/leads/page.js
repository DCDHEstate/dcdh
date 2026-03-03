"use client";

import { useState, useEffect, useCallback } from "react";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Interested", value: "interested" },
  { label: "Visited", value: "visited" },
  { label: "Closed Won", value: "closed_won" },
  { label: "Closed Lost", value: "closed_lost" },
];

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  interested: "bg-purple-100 text-purple-700",
  visit_scheduled: "bg-indigo-100 text-indigo-700",
  visited: "bg-cyan-100 text-cyan-700",
  negotiation: "bg-orange-100 text-orange-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
};

const LEAD_STATUSES = [
  "new",
  "contacted",
  "interested",
  "visit_scheduled",
  "visited",
  "negotiation",
  "closed_won",
  "closed_lost",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expandedLead, setExpandedLead] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const limit = 20;

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit });
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("q", search);

    try {
      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId, newStatus) => {
    setActionLoading(leadId);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">
          Leads
        </h1>
        <p className="mt-1 text-sm text-muted">
          All property inquiries across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
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
          placeholder="Search name, phone, or property..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-72"
        />
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-white p-12 text-center">
          <p className="text-sm text-muted">No leads found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-border bg-surface-white shadow-soft"
            >
              {/* Lead Row */}
              <div
                className="flex cursor-pointer flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
              >
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {lead.name}
                    <span className="ml-2 text-xs font-normal text-muted">
                      +91 {lead.phone}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Property: {lead.property_title || "N/A"}
                    {lead.owner_name && ` · Owner: ${lead.owner_name}`}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {new Date(lead.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lead.status.replace("_", " ")}
                  </span>
                  <svg
                    className={`h-4 w-4 text-muted transition-transform ${expandedLead === lead.id ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedLead === lead.id && (
                <div className="border-t border-border-light px-5 pb-5 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-subtle">Email</p>
                      <p className="text-sm text-body">{lead.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-subtle">Source</p>
                      <p className="text-sm capitalize text-body">{lead.source?.replace("_", " ") || "—"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium text-subtle">Message</p>
                      <p className="text-sm text-body">{lead.message || "No message"}</p>
                    </div>
                    {lead.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-subtle">Admin Notes</p>
                        <p className="text-sm text-body">{lead.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Update */}
                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-xs font-medium text-subtle">Update Status:</label>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      disabled={actionLoading === lead.id}
                      className="rounded-lg border border-border bg-surface-white px-3 py-1.5 text-xs text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
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
