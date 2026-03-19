"use client";

import { useState, useEffect, useCallback } from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  partially_paid: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
  waived: "bg-gray-100 text-gray-600",
};

const PAYMENT_METHODS = ["upi", "bank_transfer", "cash", "cheque", "wallet", "other"];

export default function AdminRentPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/admin/rent-payments?${params}`);
      const data = await res.json();
      setPayments(data.payments || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const generateRent = async () => {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch("/api/admin/tenancies/generate-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setGenResult(data);
      fetchPayments();
    } catch {
      setGenResult({ error: "Failed to generate" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Rent Payments</h1>
          <p className="mt-1 text-sm text-muted">Track and manage rent payments across all tenancies.</p>
        </div>
        <button
          onClick={generateRent}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate This Month's Rent"}
        </button>
      </div>

      {genResult && (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${genResult.error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
          {genResult.error || `Generated ${genResult.generated} payment records. Marked ${genResult.overdueMarked} as overdue.`}
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
          <option value="waived">Waived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th className="px-4 py-3 font-medium text-muted">Property</th>
              <th className="px-4 py-3 font-medium text-muted">Tenant</th>
              <th className="px-4 py-3 font-medium text-muted">Month</th>
              <th className="px-4 py-3 font-medium text-muted">Amount</th>
              <th className="px-4 py-3 font-medium text-muted">Due Date</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="h-5 w-full animate-pulse rounded bg-surface-subtle" />
                  </td>
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">No rent payments found.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-surface-subtle/50">
                  <td className="px-4 py-3 font-medium text-heading">{p.property_title}</td>
                  <td className="px-4 py-3">
                    <p className="text-body">{p.tenant_name}</p>
                    <p className="text-xs text-muted">{p.tenant_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(p.payment_for_month).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-heading">₹{Number(p.total_due).toLocaleString("en-IN")}</p>
                    {Number(p.late_fee) > 0 && (
                      <p className="text-xs text-red-500">+₹{Number(p.late_fee).toLocaleString("en-IN")} late fee</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(p.due_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PaymentActions payment={p} onUpdate={fetchPayments} />
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

function PaymentActions({ payment, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ status: "paid", amountPaid: payment.total_due, paymentMethod: "upi", transactionReference: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/admin/rent-payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.id,
          status: form.status,
          amountPaid: Number(form.amountPaid),
          paymentMethod: form.paymentMethod,
          transactionReference: form.transactionReference || null,
        }),
      });
      setShowForm(false);
      onUpdate();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (payment.status === "paid" || payment.status === "waived") return null;

  if (!showForm) {
    return (
      <div className="flex gap-1">
        <button onClick={() => setShowForm(true)} className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
          Mark Paid
        </button>
        <button
          onClick={async () => {
            await fetch("/api/admin/rent-payments", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: payment.id, status: "waived" }),
            });
            onUpdate();
          }}
          className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          Waive
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="w-full rounded-lg border border-border px-2 py-1 text-xs">
        {PAYMENT_METHODS.map((m) => (
          <option key={m} value={m}>{m.replace("_", " ")}</option>
        ))}
      </select>
      <input type="number" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} className="w-full rounded-lg border border-border px-2 py-1 text-xs" placeholder="Amount" />
      <input type="text" value={form.transactionReference} onChange={(e) => setForm({ ...form, transactionReference: e.target.value })} className="w-full rounded-lg border border-border px-2 py-1 text-xs" placeholder="Txn reference" />
      <div className="flex gap-1">
        <button onClick={handleSubmit} disabled={submitting} className="rounded-lg bg-green-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-50">
          {submitting ? "..." : "Confirm"}
        </button>
        <button onClick={() => setShowForm(false)} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Cancel</button>
      </div>
    </div>
  );
}
