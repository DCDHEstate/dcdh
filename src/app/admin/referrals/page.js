"use client";

import { useState, useEffect, useCallback } from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  registered: "bg-blue-100 text-blue-700",
  deal_closed: "bg-purple-100 text-purple-700",
  rewarded: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-600",
};

const STATUSES = ["pending", "registered", "deal_closed", "rewarded", "expired"];

export default function AdminReferralsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rewardModal, setRewardModal] = useState(null);
  const [rewardAmount, setRewardAmount] = useState("");
  const [rewardLoading, setRewardLoading] = useState(false);

  const fetchData = useCallback(() => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (search) params.set("q", search);
    setIsLoading(true);
    fetch(`/api/admin/referrals?${params}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page, statusFilter, typeFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (referralId, newStatus) => {
    await fetch("/api/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralId, status: newStatus }),
    });
    fetchData();
  };

  const submitReward = async () => {
    if (!rewardModal || !rewardAmount) return;
    setRewardLoading(true);
    try {
      await fetch("/api/admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralId: rewardModal.id,
          status: "rewarded",
          rewardAmount: Number(rewardAmount),
        }),
      });
      setRewardModal(null);
      setRewardAmount("");
      fetchData();
    } catch {
      // ignore
    } finally {
      setRewardLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Referrals</h1>
        <p className="mt-1 text-sm text-muted">Review and reward referrals from users.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, phone, location..."
          className="w-64 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
        >
          <option value="">All Types</option>
          <option value="friend">Friend</option>
          <option value="property">Property</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Referrer</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Type</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Details</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Date</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-5 animate-pulse rounded bg-surface-subtle" />
                  </td>
                </tr>
              ))
            ) : !data?.referrals?.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted">No referrals found.</td>
              </tr>
            ) : (
              data.referrals.map((r) => (
                <tr key={r.id} className="hover:bg-surface-subtle/50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-heading">{r.referrer_name}</p>
                    <p className="text-xs text-muted">{r.referrer_phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-medium capitalize text-body">
                      {r.referral_type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {r.referral_type === "friend" ? (
                      <div>
                        <p className="text-sm text-body">{r.referred_user_name || r.referred_phone}</p>
                        {r.referred_user_name && <p className="text-xs text-muted">{r.referred_phone}</p>}
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-body">{r.property_location}</p>
                        <p className="text-xs text-muted">
                          {r.property_category && <span className="capitalize">{r.property_category}</span>}
                          {r.owner_contact_number && <span> · {r.owner_contact_number}</span>}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {r.status === "rewarded" ? (
                      <div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS.rewarded}`}>
                          Rewarded
                        </span>
                        <p className="mt-0.5 text-xs font-medium text-green-600">₹{Number(r.reward_amount).toLocaleString("en-IN")}</p>
                      </div>
                    ) : (
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none ${STATUS_COLORS[r.status]}`}
                      >
                        {STATUSES.filter(s => s !== "rewarded").map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    {r.status !== "rewarded" && r.status !== "expired" && (
                      <button
                        onClick={() => { setRewardModal(r); setRewardAmount(""); }}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                      >
                        Reward
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      {/* Reward Modal */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setRewardModal(null)}>
          <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-surface-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-heading">Reward Referral</h3>
            <p className="mt-1 text-xs text-muted">
              {rewardModal.referrer_name} · {rewardModal.referral_type === "friend" ? (rewardModal.referred_user_name || rewardModal.referred_phone) : rewardModal.property_location}
            </p>

            <div className="mt-5">
              <label className="mb-1 block text-xs font-medium text-muted">Reward Amount (₹)</label>
              <input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
              />
              <p className="mt-2 text-xs text-muted">
                This will credit ₹{rewardAmount || 0} to {rewardModal.referrer_name}&apos;s wallet.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setRewardModal(null)}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                onClick={submitReward}
                disabled={rewardLoading || !rewardAmount}
                className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                {rewardLoading ? "Processing..." : "Confirm & Credit Wallet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
