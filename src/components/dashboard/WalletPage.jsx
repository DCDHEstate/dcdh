"use client";

import { useState, useEffect, useCallback } from "react";

const REASON_LABELS = {
  referral_reward: "Referral Reward",
  signup_bonus: "Signup Bonus",
  withdrawal: "Withdrawal",
  adjustment: "Adjustment",
};

export default function WalletPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/wallet?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">My Wallet</h1>
        <p className="mt-1 text-sm text-muted">Your earnings from referrals and bonuses.</p>
      </div>

      {/* Balance Card */}
      <div className="mb-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-dark to-accent p-8 text-white shadow-lg">
        <p className="text-sm font-medium text-white/70">Available Balance</p>
        <p className="mt-2 text-4xl font-bold">
          ₹{data ? Number(data.balance).toLocaleString("en-IN") : "—"}
        </p>
        <p className="mt-3 text-xs text-white/60">
          Earned from referral rewards and bonuses
        </p>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-border bg-surface-white shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-heading">Transaction History</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-subtle" />
            ))}
          </div>
        ) : !data?.transactions?.length ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-3 h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v6z" />
            </svg>
            <p className="text-sm text-muted">No transactions yet.</p>
            <p className="mt-1 text-xs text-muted">Your referral rewards will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.transaction_type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                    <svg className={`h-4 w-4 ${t.transaction_type === "credit" ? "text-green-600" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {t.transaction_type === "credit" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5V4.5m0 0L5.25 11.25M12 4.5l6.75 6.75" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">
                      {REASON_LABELS[t.reason] || t.reason}
                    </p>
                    {t.description && <p className="text-xs text-muted">{t.description}</p>}
                    <p className="text-[10px] text-muted">
                      {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${t.transaction_type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {t.transaction_type === "credit" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted">Bal: ₹{Number(t.balance_after).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.total > 20 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-3 text-sm">
            <p className="text-muted">Page {page} of {Math.ceil(data.total / 20)}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40">Prev</button>
              <button disabled={page * 20 >= data.total} onClick={() => setPage(page + 1)} className="rounded-lg border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
