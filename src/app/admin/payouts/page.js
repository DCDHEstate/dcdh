"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { WITHDRAWAL_STATUS_LABELS } from "@/lib/referralOptions";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const inputClass =
  "w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent";

const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function PayoutDestination({ r }) {
  if (r.payout_method === "upi") {
    return (
      <p className="text-sm text-body">
        UPI <span className="font-mono">{r.upi_id}</span>
      </p>
    );
  }
  return (
    <div className="text-sm text-body">
      <p>{r.bank_account_name}</p>
      <p className="font-mono text-xs">
        A/c {r.bank_account_number} · IFSC {r.bank_ifsc_code}
      </p>
      {r.bank_name && <p className="text-xs text-muted">{r.bank_name}</p>}
    </div>
  );
}

export default function AdminPayoutsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null); // { request, type: 'paid' | 'rejected' }
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(() => {
    const params = new URLSearchParams({ page });
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/withdrawals?${params}&_t=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startAction = (request, type) => {
    setAction({ request, type });
    setReference("");
    setNotes("");
    setError("");
  };

  const confirm = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: action.request.id,
          action: action.type,
          payoutReference: reference,
          adminNotes: notes,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error || "Could not update the request.");
        if (res.status === 409) fetchData();
        return;
      }
      setAction(null);
      fetchData();
    } catch {
      setError("Could not reach the server. Nothing was changed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Payouts</h1>
        <p className="mt-1 text-sm text-muted">
          Wallet withdrawal requests. The amount has already left the user&apos;s
          wallet — transfer it, then mark it paid. Rejecting returns it to their wallet.
        </p>
        {data?.pending > 0 && (
          <p className="mt-3 text-sm font-medium text-heading">
            {data.pending} pending · {rupees(data.pendingAmount)} to pay out
          </p>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["pending", "Pending"],
          ["paid", "Paid"],
          ["rejected", "Rejected"],
          ["", "All"],
        ].map(([value, label]) => (
          <button
            key={label}
            onClick={() => {
              setIsLoading(true);
              setStatusFilter(value);
              setPage(1);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              statusFilter === value
                ? "bg-accent-dark text-white"
                : "border border-border text-muted hover:bg-surface-subtle"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))
        ) : !data?.requests?.length ? (
          <div className="rounded-2xl border border-border bg-surface-white p-10 text-center text-sm text-muted">
            No {statusFilter || ""} payout requests.
          </div>
        ) : (
          data.requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface-white p-5 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-heading">{rupees(r.amount)}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                      {WITHDRAWAL_STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <p className="text-sm">
                    <Link href={`/admin/users/${r.user_id}`} className="font-medium text-accent-dark hover:underline">
                      {r.user_name || r.user_phone}
                    </Link>{" "}
                    <span className="text-xs capitalize text-muted">
                      {r.user_role} · {r.user_phone}
                    </span>
                  </p>
                  <PayoutDestination r={r} />
                  <p className="text-xs text-muted">
                    Requested {formatDate(r.created_at)}
                    {r.processed_at &&
                      ` · ${r.status} ${formatDate(r.processed_at)}${r.processed_by_name ? ` by ${r.processed_by_name}` : ""}`}
                  </p>
                  {r.payout_reference && (
                    <p className="text-xs text-muted">Reference: {r.payout_reference}</p>
                  )}
                  {r.admin_notes && <p className="text-xs text-muted">Note: {r.admin_notes}</p>}
                </div>

                {r.status === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startAction(r, "rejected")}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-body transition hover:bg-surface-subtle"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => startAction(r, "paid")}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                    >
                      Mark paid
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {data && data.total > data.limit && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted">
            Page {page} of {Math.ceil(data.total / data.limit)}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => { setIsLoading(true); setPage(page - 1); }}
              className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page * data.limit >= data.total}
              onClick={() => { setIsLoading(true); setPage(page + 1); }}
              className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {action && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => !saving && setAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-surface-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-heading">
              {action.type === "paid" ? "Mark as paid" : "Reject payout"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {rupees(action.request.amount)} for {action.request.user_name || action.request.user_phone}
            </p>
            <div className="mt-4">
              <PayoutDestination r={action.request} />
            </div>

            {action.type === "paid" ? (
              <div className="mt-5">
                <label className="mb-1 block text-xs font-medium text-muted">
                  UPI / bank transaction reference *
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. UTR 412345678901"
                  className={inputClass}
                />
              </div>
            ) : (
              <p className="mt-5 text-xs text-muted">
                {rupees(action.request.amount)} will be returned to the user&apos;s wallet.
              </p>
            )}

            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-muted">
                {action.type === "paid" ? "Note (optional)" : "Reason — shown to the user *"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={action.type === "paid" ? "" : "e.g. The UPI ID could not be verified"}
                className={`${inputClass} resize-y`}
              />
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAction(null)}
                disabled={saving}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                disabled={
                  saving ||
                  (action.type === "paid" ? !reference.trim() : !notes.trim())
                }
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${
                  action.type === "paid" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {saving ? "Saving..." : action.type === "paid" ? "Confirm paid" : "Reject & refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
