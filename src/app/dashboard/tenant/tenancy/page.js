"use client";

import { useState, useEffect } from "react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
  terminated: "bg-red-100 text-red-700",
  expired: "bg-yellow-100 text-yellow-700",
};

export default function TenantTenancyPage() {
  const [tenancies, setTenancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tenancies/mine")
      .then((r) => r.json())
      .then((data) => setTenancies(data.tenancies || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const activeTenancy = tenancies.find((t) => t.status === "active" || t.status === "upcoming");
  const pastTenancies = tenancies.filter((t) => t.status !== "active" && t.status !== "upcoming");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">My Tenancy</h1>
        </div>
        <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface-white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">My Tenancy</h1>
        <p className="mt-1 text-sm text-muted">View your current and past lease details.</p>
      </div>

      {/* Active / Upcoming tenancy */}
      {activeTenancy ? (
        <div className="mb-8 rounded-2xl border border-accent/20 bg-surface-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-heading">Current Tenancy</h2>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[activeTenancy.status]}`}>
              {activeTenancy.status}
            </span>
          </div>

          {/* Property info */}
          <div className="mb-4 flex gap-4">
            {activeTenancy.primary_image && (
              <img
                src={activeTenancy.primary_image}
                alt={activeTenancy.property_title}
                className="h-20 w-28 rounded-xl object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-heading">{activeTenancy.property_title}</h3>
              <p className="text-sm text-muted">
                {activeTenancy.locality_name}, {activeTenancy.city_name}
              </p>
              {activeTenancy.address_line1 && (
                <p className="text-xs text-muted">{activeTenancy.address_line1}</p>
              )}
            </div>
          </div>

          {/* Lease details grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted">Monthly Rent</p>
              <p className="text-lg font-semibold text-heading">₹{Number(activeTenancy.monthly_rent).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Security Deposit</p>
              <p className="font-medium text-body">₹{Number(activeTenancy.security_deposit || 0).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Lease Period</p>
              <p className="font-medium text-body">
                {new Date(activeTenancy.lease_start_date).toLocaleDateString("en-IN")} — {new Date(activeTenancy.lease_end_date).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Rent Due Day</p>
              <p className="font-medium text-body">{activeTenancy.rent_due_day}th of every month</p>
            </div>
            <div>
              <p className="text-xs text-muted">Maintenance</p>
              <p className="font-medium text-body">₹{Number(activeTenancy.maintenance_charge || 0).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Lock-in Period</p>
              <p className="font-medium text-body">{activeTenancy.lock_in_period_months ? `${activeTenancy.lock_in_period_months} months` : "None"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Notice Period</p>
              <p className="font-medium text-body">{activeTenancy.notice_period_days} days</p>
            </div>
            <div>
              <p className="text-xs text-muted">Annual Increment</p>
              <p className="font-medium text-body">{activeTenancy.annual_increment_percent ? `${activeTenancy.annual_increment_percent}%` : "N/A"}</p>
            </div>
          </div>

          {/* Owner contact & agreement */}
          <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted">Property Owner</p>
              <p className="text-sm font-medium text-body">{activeTenancy.owner_name} · {activeTenancy.owner_phone}</p>
            </div>
            {activeTenancy.agreement_document_url && (
              <a
                href={activeTenancy.agreement_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent-soft px-4 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Download Agreement
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-border bg-surface-white p-12 text-center shadow-soft">
          <svg className="mx-auto mb-3 h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
          </svg>
          <p className="text-sm text-muted">No active tenancy. Once a deal is closed, your tenancy details will appear here.</p>
        </div>
      )}

      {/* Past tenancies */}
      {pastTenancies.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-heading">Past Tenancies</h2>
          <div className="space-y-3">
            {pastTenancies.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-surface-white p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-heading">{t.property_title}</h3>
                    <p className="text-xs text-muted">
                      {t.locality_name}, {t.city_name} · {new Date(t.lease_start_date).toLocaleDateString("en-IN")} — {new Date(t.lease_end_date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[t.status] || "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                    <p className="mt-1 text-sm font-medium text-muted">₹{Number(t.monthly_rent).toLocaleString("en-IN")}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
