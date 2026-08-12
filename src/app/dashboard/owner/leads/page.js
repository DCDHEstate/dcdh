"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusColors = {
  new: "bg-blue-50 text-blue-600",
  contacted: "bg-accent-soft text-accent-muted",
  interested: "bg-green-50 text-green-600",
  visit_scheduled: "bg-purple-50 text-purple-600",
  visited: "bg-indigo-50 text-indigo-600",
  negotiation: "bg-orange-50 text-orange-600",
  closed_won: "bg-verified/10 text-verified",
  closed_lost: "bg-red-50 text-red-500",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OwnerLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">Leads</h1>
        <p className="mt-1 text-sm text-muted">
          {total} {total === 1 ? "inquiry" : "inquiries"} on your properties
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-border bg-surface-white"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-white py-16 text-center shadow-soft">
          <svg
            className="mb-4 h-16 w-16 text-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-heading">No leads yet</h3>
          <p className="max-w-sm text-sm text-muted">
            Leads will appear here when tenants inquire about your properties.
          </p>
        </div>
      )}

      {/* Leads List */}
      {!isLoading && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-border bg-surface-white p-4 shadow-soft transition-all hover:shadow-elevated sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-heading">
                      {lead.name}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                        statusColors[lead.status] || "bg-surface-subtle text-muted"
                      }`}
                    >
                      {lead.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    For:{" "}
                    <Link
                      href={`/properties/${lead.property_slug}`}
                      className="text-accent hover:text-accent-dark"
                    >
                      {lead.property_title}
                    </Link>
                  </p>
                  {lead.message && (
                    <p className="mt-1 line-clamp-1 text-xs text-subtle">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-subtle">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={`tel:+91${lead.phone}`}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition-all hover:bg-surface-subtle hover:text-heading"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${lead.phone}?text=Hi%2C%20I%20saw%20your%20inquiry%20on%20DCDH%20Estate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-whatsapp/10 px-3 py-2 text-xs font-medium text-whatsapp-dark transition-all hover:bg-whatsapp/20"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
