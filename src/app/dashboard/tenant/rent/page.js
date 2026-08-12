"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  partially_paid: "bg-orange-100 text-orange-700",
  waived: "bg-gray-100 text-gray-600",
};

export default function TenantRentPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rent-payments/tenant?limit=50")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const nextDue = data?.payments?.find((p) => p.status === "pending" || p.status === "overdue");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Rent</h1>
        <p className="mt-1 text-sm text-muted">Your rent payment history and upcoming dues.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-surface-white" />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface-white" />
        </div>
      ) : !data?.payments?.length ? (
        <div className="rounded-2xl border border-border bg-surface-white p-12 text-center shadow-soft">
          <svg className="mx-auto mb-3 h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          <p className="text-sm text-muted">No rent payments yet. Payments will appear once your tenancy is active.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <StatCard
              title="Total Paid"
              value={`₹${Number(data.summary.totalPaid).toLocaleString("en-IN")}`}
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Due Amount"
              value={`₹${Number(data.summary.totalDue).toLocaleString("en-IN")}`}
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Overdue"
              value={data.summary.overdueCount}
              subtitle={data.summary.overdueCount > 0 ? "Action needed" : undefined}
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
            />
          </div>

          {/* Next due highlight */}
          {nextDue && (
            <div className={`mb-6 rounded-2xl border p-5 ${nextDue.status === "overdue" ? "border-red-200 bg-red-50" : "border-accent/20 bg-accent-soft/30"}`}>
              <p className="text-xs font-medium text-muted">
                {nextDue.status === "overdue" ? "OVERDUE" : "NEXT DUE"}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-heading">
                    ₹{Number(nextDue.total_due).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-muted">
                    {nextDue.property_title} · {new Date(nextDue.payment_for_month).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <p className="text-sm font-medium text-muted">
                  Due: {new Date(nextDue.due_date).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          )}

          {/* Payment history */}
          <h2 className="mb-4 text-lg font-semibold text-heading">Payment History</h2>
          <div className="space-y-3">
            {data.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface-white p-4 shadow-soft">
                <div>
                  <p className="font-medium text-heading">
                    {new Date(p.payment_for_month).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </p>
                  <p className="text-xs text-muted">
                    {p.property_title} · Due: {new Date(p.due_date).toLocaleDateString("en-IN")}
                  </p>
                  {p.payment_date && (
                    <p className="text-xs text-green-600">
                      Paid: {new Date(p.payment_date).toLocaleDateString("en-IN")}
                      {p.payment_method && ` via ${p.payment_method.replace("_", " ")}`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-heading">₹{Number(p.total_due).toLocaleString("en-IN")}</p>
                  {Number(p.late_fee) > 0 && (
                    <p className="text-xs text-red-500">+₹{Number(p.late_fee).toLocaleString("en-IN")} late fee</p>
                  )}
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
