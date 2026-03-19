"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/dashboard/StatCard";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  partially_paid: "bg-orange-100 text-orange-700",
  waived: "bg-gray-100 text-gray-600",
};

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "wallet", label: "Wallet" },
  { value: "other", label: "Other" },
];

function formatCurrency(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function formatMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export default function OwnerRentPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState("");
  const [actionPayment, setActionPayment] = useState(null); // payment being edited
  const [actionType, setActionType] = useState(null); // 'mark_paid' | 'electricity'
  const [actionForm, setActionForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = useCallback(() => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set("status", statusFilter);
    setIsLoading(true);
    fetch(`/api/rent-payments/owner?${params}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg("");
    try {
      const res = await fetch("/api/rent-payments/owner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const d = await res.json();
      if (res.ok) {
        const parts = [];
        if (d.activated > 0) parts.push(`${d.activated} tenancy${d.activated > 1 ? "ies" : ""} activated`);
        if (d.generated > 0) parts.push(`${d.generated} rent record${d.generated > 1 ? "s" : ""} generated`);
        if (d.overdueMarked > 0) parts.push(`${d.overdueMarked} marked overdue`);
        setGenMsg(parts.length ? parts.join(", ") : "All records are up to date.");
        fetchPayments();
      } else {
        setGenMsg(d.error || "Failed to generate.");
      }
    } catch {
      setGenMsg("Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const openAction = (payment, type) => {
    setActionPayment(payment);
    setActionType(type);
    if (type === "mark_paid") {
      setActionForm({
        amountPaid: Number(payment.total_due),
        paymentMethod: "upi",
        transactionReference: "",
        notes: "",
      });
    } else if (type === "electricity") {
      setActionForm({
        electricityCharge: Number(payment.electricity_charge || 0),
      });
    }
  };

  const closeAction = () => {
    setActionPayment(null);
    setActionType(null);
    setActionForm({});
  };

  const submitAction = async () => {
    if (!actionPayment) return;
    setActionLoading(true);
    try {
      let body = { paymentId: actionPayment.id };
      if (actionType === "mark_paid") {
        body.status = "paid";
        body.amountPaid = Number(actionForm.amountPaid);
        body.paymentMethod = actionForm.paymentMethod;
        if (actionForm.transactionReference) body.transactionReference = actionForm.transactionReference;
        if (actionForm.notes) body.notes = actionForm.notes;
      } else if (actionType === "electricity") {
        body.electricityCharge = Number(actionForm.electricityCharge);
      }

      const res = await fetch("/api/rent-payments/owner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        closeAction();
        fetchPayments();
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Rent Collection</h1>
          <p className="mt-1 text-sm text-muted">Generate records, track payments, and add charges.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-xl bg-accent-dark px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-dark/90 disabled:opacity-50"
        >
          {generating ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
          Generate Rent Records
        </button>
      </div>

      {genMsg && (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent-dark">
          {genMsg}
        </div>
      )}

      {/* Summary */}
      {data?.summary && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Collected"
            value={formatCurrency(data.summary.totalCollected)}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Pending"
            value={formatCurrency(data.summary.totalPending)}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Overdue"
            value={formatCurrency(data.summary.totalOverdue)}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          />
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="partially_paid">Partially Paid</option>
        </select>
      </div>

      {/* Payments list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))
        ) : !data?.payments?.length ? (
          <div className="rounded-2xl border border-border bg-surface-white p-12 text-center shadow-soft">
            <svg className="mx-auto mb-3 h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            <p className="text-sm text-muted">No rent payments found.</p>
            <p className="mt-1 text-xs text-muted">Click &quot;Generate Rent Records&quot; to create entries for active tenancies.</p>
          </div>
        ) : (
          data.payments.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-surface-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                {/* Left info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-heading">{p.property_title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {p.tenant_name} &middot; {formatMonth(p.payment_for_month)} &middot; Due {new Date(p.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>

                  {/* Breakdown */}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>Rent: {formatCurrency(p.amount_due)}</span>
                    {Number(p.electricity_charge) > 0 && <span>Electricity: {formatCurrency(p.electricity_charge)}</span>}
                    {Number(p.late_fee) > 0 && <span className="text-red-600">Late Fee: {formatCurrency(p.late_fee)}</span>}
                  </div>

                  {p.status === "paid" && (
                    <p className="mt-1 text-xs text-verified">
                      Paid {formatCurrency(p.amount_paid)} via {p.payment_method?.replace("_", " ") || "—"}
                      {p.transaction_reference ? ` (Ref: ${p.transaction_reference})` : ""}
                    </p>
                  )}
                </div>

                {/* Right — amount + actions */}
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-heading">{formatCurrency(p.total_due)}</p>
                  {p.status !== "paid" && p.status !== "waived" && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      <button
                        onClick={() => openAction(p, "mark_paid")}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => openAction(p, "electricity")}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-body transition hover:bg-surface-subtle"
                      >
                        + Electricity
                      </button>
                    </div>
                  )}
                  {p.status === "paid" && (
                    <button
                      onClick={() => openAction(p, "electricity")}
                      className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-body transition hover:bg-surface-subtle"
                    >
                      Edit Electricity
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.total > 20 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted">Page {page} of {Math.ceil(data.total / 20)}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40">Prev</button>
            <button disabled={page * 20 >= data.total} onClick={() => setPage(page + 1)} className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closeAction}>
          <div
            className="mx-4 w-full max-w-md rounded-2xl border border-border bg-surface-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {actionType === "mark_paid" && (
              <>
                <h3 className="text-lg font-semibold text-heading">Mark as Paid</h3>
                <p className="mt-1 text-xs text-muted">
                  {actionPayment.property_title} &middot; {actionPayment.tenant_name} &middot; {formatMonth(actionPayment.payment_for_month)}
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Amount Paid</label>
                    <input
                      type="number"
                      value={actionForm.amountPaid}
                      onChange={(e) => setActionForm({ ...actionForm, amountPaid: e.target.value })}
                      className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Payment Method</label>
                    <select
                      value={actionForm.paymentMethod}
                      onChange={(e) => setActionForm({ ...actionForm, paymentMethod: e.target.value })}
                      className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Transaction Reference</label>
                    <input
                      type="text"
                      value={actionForm.transactionReference}
                      onChange={(e) => setActionForm({ ...actionForm, transactionReference: e.target.value })}
                      placeholder="UPI ref / cheque no / bank ref"
                      className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">Notes (optional)</label>
                    <input
                      type="text"
                      value={actionForm.notes}
                      onChange={(e) => setActionForm({ ...actionForm, notes: e.target.value })}
                      className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </>
            )}

            {actionType === "electricity" && (
              <>
                <h3 className="text-lg font-semibold text-heading">Electricity Charge</h3>
                <p className="mt-1 text-xs text-muted">
                  {actionPayment.property_title} &middot; {actionPayment.tenant_name} &middot; {formatMonth(actionPayment.payment_for_month)}
                </p>
                <div className="mt-5">
                  <label className="mb-1 block text-xs font-medium text-muted">Amount (₹)</label>
                  <input
                    type="number"
                    value={actionForm.electricityCharge}
                    onChange={(e) => setActionForm({ ...actionForm, electricityCharge: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                  />
                  <p className="mt-2 text-xs text-muted">
                    This will update the total due to {formatCurrency(Number(actionPayment.amount_due) + Number(actionForm.electricityCharge || 0) + Number(actionPayment.late_fee || 0))}.
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeAction}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-accent-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark/90 disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : actionType === "mark_paid" ? "Confirm Payment" : "Save Charge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
