"use client";

import { useCallback, useEffect, useState } from "react";
import { WITHDRAWAL_STATUS_LABELS } from "@/lib/referralOptions";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const inputClass =
  "w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent";
const labelClass = "mb-1 block text-xs font-medium text-muted";

const EMPTY = {
  amount: "",
  method: "upi",
  upiId: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankIfscCode: "",
  bankName: "",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/**
 * Payout requests for the wallet page. The requested amount leaves the balance
 * straight away and an admin pays it out; a rejected request returns it.
 */
export default function WithdrawalPanel({ onBalanceChange }) {
  const [info, setInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(() => {
    fetch(`/api/wallet/withdrawals?_t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setInfo(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = () => {
    const saved = info?.savedPayout;
    setForm({
      ...EMPTY,
      amount: String(Math.floor(Number(info?.balance || 0))),
      ...(saved || {}),
    });
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error || "Could not request the payout.");
        return;
      }
      setOpen(false);
      setSuccess("Payout requested. Our team will transfer it within a few working days.");
      load();
      onBalanceChange?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!info) return null;

  const balance = Number(info.balance || 0);
  const canRequest = !info.hasPending && balance >= info.minAmount;

  return (
    <div className="mb-8 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-heading">Withdraw to UPI or bank</h3>
          <p className="mt-1 text-xs text-muted">
            {info.hasPending
              ? "Your payout request is being processed."
              : balance >= info.minAmount
                ? `Withdraw any amount from ₹${info.minAmount}.`
                : `You can withdraw once your balance reaches ₹${info.minAmount}.`}
          </p>
        </div>
        {!open && (
          <button
            onClick={openForm}
            disabled={!canRequest}
            className="rounded-xl bg-accent-dark px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark/90 disabled:opacity-50"
          >
            Request payout
          </button>
        )}
      </div>

      {success && (
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-4 border-t border-border pt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                type="number"
                min={info.minAmount}
                max={Math.floor(balance)}
                step="1"
                inputMode="numeric"
                value={form.amount}
                onChange={set("amount")}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pay to</label>
              <select value={form.method} onChange={set("method")} className={inputClass}>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank account</option>
              </select>
            </div>
          </div>

          {form.method === "upi" ? (
            <div>
              <label className={labelClass}>UPI ID</label>
              <input
                type="text"
                value={form.upiId}
                onChange={set("upiId")}
                placeholder="name@okaxis"
                autoCapitalize="none"
                className={inputClass}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Account holder name</label>
                <input type="text" value={form.bankAccountName} onChange={set("bankAccountName")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.bankAccountNumber}
                  onChange={set("bankAccountNumber")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>IFSC code</label>
                <input
                  type="text"
                  value={form.bankIfscCode}
                  onChange={(e) => setForm((f) => ({ ...f, bankIfscCode: e.target.value.toUpperCase() }))}
                  placeholder="HDFC0001234"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Bank name (optional)</label>
                <input type="text" value={form.bankName} onChange={set("bankName")} className={inputClass} />
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-accent-dark px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark/90 disabled:opacity-50"
            >
              {submitting ? "Requesting..." : "Request payout"}
            </button>
          </div>
        </form>
      )}

      {info.requests.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Payout requests</p>
          <ul className="divide-y divide-border">
            {info.requests.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-heading">
                    ₹{Number(r.amount).toLocaleString("en-IN")}{" "}
                    <span className="font-normal text-muted">
                      to {r.payout_method === "upi" ? r.upi_id : `bank a/c ${r.bank_account_number}`}
                    </span>
                  </p>
                  <p className="text-xs text-muted">
                    Requested {formatDate(r.created_at)}
                    {r.processed_at && ` · ${r.status === "paid" ? "paid" : "updated"} ${formatDate(r.processed_at)}`}
                    {r.status === "paid" && r.payout_reference && ` · Ref ${r.payout_reference}`}
                  </p>
                  {r.status === "rejected" && r.admin_notes && (
                    <p className="mt-1 text-xs text-red-700">
                      {r.admin_notes} — the amount was returned to your wallet.
                    </p>
                  )}
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                  {WITHDRAWAL_STATUS_LABELS[r.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
