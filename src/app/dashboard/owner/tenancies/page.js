"use client";

import { useState, useEffect } from "react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
  terminated: "bg-red-100 text-red-700",
  expired: "bg-yellow-100 text-yellow-700",
};

export default function OwnerTenanciesPage() {
  const [tenancies, setTenancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch("/api/tenancies/property")
      .then((r) => r.json())
      .then((data) => setTenancies(data.tenancies || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Tenancies</h1>
        <p className="mt-1 text-sm text-muted">Active and past tenancies on your properties.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))}
        </div>
      ) : tenancies.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-white p-12 text-center shadow-soft">
          <svg className="mx-auto mb-3 h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-muted">No tenancies yet. Tenancies will appear here when deals are closed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tenancies.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-all hover:shadow-elevated">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-heading">{t.property_title}</h3>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[t.status] || "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Tenant: <span className="font-medium text-body">{t.tenant_name}</span> · {t.tenant_phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-heading">₹{Number(t.monthly_rent).toLocaleString("en-IN")}<span className="text-xs font-normal text-muted">/mo</span></p>
                  <p className="text-xs text-muted">
                    {new Date(t.lease_start_date).toLocaleDateString("en-IN")} — {new Date(t.lease_end_date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                className="mt-3 text-xs font-medium text-accent hover:underline"
              >
                {expandedId === t.id ? "Hide details" : "View details"}
              </button>

              {expandedId === t.id && (
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted">Security Deposit</p>
                    <p className="font-medium text-body">₹{Number(t.security_deposit || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Maintenance</p>
                    <p className="font-medium text-body">₹{Number(t.maintenance_charge || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Rent Due Day</p>
                    <p className="font-medium text-body">{t.rent_due_day}th of month</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Lock-in</p>
                    <p className="font-medium text-body">{t.lock_in_period_months ? `${t.lock_in_period_months} months` : "None"}</p>
                  </div>
                  {t.agreement_document_url && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted">Agreement</p>
                      <a href={t.agreement_document_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent hover:underline">
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
