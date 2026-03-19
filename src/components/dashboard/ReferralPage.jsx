"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  registered: "bg-blue-100 text-blue-700",
  deal_closed: "bg-purple-100 text-purple-700",
  rewarded: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-600",
};

const PROPERTY_CATEGORIES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "pg", label: "PG / Hostel" },
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "independent_house", label: "Independent House" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "shop", label: "Shop" },
  { value: "office", label: "Office" },
  { value: "warehouse", label: "Warehouse" },
  { value: "pg", label: "PG" },
];

export default function ReferralPage({ walletHref }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [referralType, setReferralType] = useState("friend");
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/referrals/mine?_t=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyCode = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(
        `Hey! I use DCDH Estate for zero-brokerage property search in Jaipur. Use my referral code *${data.referralCode}* when you sign up and we both earn rewards! https://dcdhempire.com`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const body = { referralType };
      if (referralType === "friend") {
        body.referredPhone = form.referredPhone;
      } else {
        body.propertyCategory = form.propertyCategory;
        body.propertyType = form.propertyType;
        body.ownerContactNumber = form.ownerContactNumber;
        body.propertyLocation = form.propertyLocation;
        body.propertyNotes = form.propertyNotes;
      }

      const res = await fetch("/api/referrals/mine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (res.ok) {
        setSubmitMsg("Referral submitted successfully!");
        setForm({});
        setShowForm(false);
        fetchData();
      } else {
        setSubmitMsg(d.error || "Failed to submit.");
      }
    } catch {
      setSubmitMsg("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Refer & Earn</h1>
          <p className="mt-1 text-sm text-muted">
            Earn rewards by referring friends or property owners to DCDH Estate.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSubmitMsg(""); }}
          className="flex items-center gap-2 rounded-xl bg-accent-dark px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-dark/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Referral
        </button>
      </div>

      {submitMsg && (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${submitMsg.includes("success") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {submitMsg}
        </div>
      )}

      {/* Referral Code Card */}
      {data?.referralCode && (
        <div className="mb-6 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 to-accent-dark/5 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Your Referral Code</p>
              <p className="mt-1 text-3xl font-bold tracking-widest text-accent-dark">{data.referralCode}</p>
              <p className="mt-1 text-xs text-muted">Share this code with friends for rewards</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-xl border border-accent/30 bg-white px-4 py-2.5 text-sm font-medium text-accent-dark transition hover:bg-accent/5"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  )}
                </svg>
                {copied ? "Copied!" : "Copy Message"}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey! I use DCDH Estate for zero-brokerage property search in Jaipur. Use my referral code *${data.referralCode}* when you sign up and we both earn rewards! https://dcdhempire.com`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {data?.summary && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Total Referrals"
            value={data.summary.totalReferrals}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}
          />
          <StatCard
            title="Rewarded"
            value={data.summary.rewardedCount}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Total Earned"
            value={`₹${Number(data.summary.totalEarned).toLocaleString("en-IN")}`}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <Link href={walletHref} className="block">
            <StatCard
              title="Wallet Balance"
              value={`₹${Number(data.summary.walletBalance).toLocaleString("en-IN")}`}
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v6z" /></svg>}
            />
          </Link>
        </div>
      )}

      {/* New Referral Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
          <h3 className="mb-4 text-base font-semibold text-heading">Submit a Referral</h3>

          {/* Type toggle */}
          <div className="mb-5 flex gap-2">
            <button
              onClick={() => { setReferralType("friend"); setForm({}); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${referralType === "friend" ? "bg-accent-dark text-white" : "border border-border text-muted hover:bg-surface-subtle"}`}
            >
              Refer a Friend
            </button>
            <button
              onClick={() => { setReferralType("property"); setForm({}); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${referralType === "property" ? "bg-accent-dark text-white" : "border border-border text-muted hover:bg-surface-subtle"}`}
            >
              Refer a Property
            </button>
          </div>

          {referralType === "friend" ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Friend&apos;s Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  value={form.referredPhone || ""}
                  onChange={(e) => setForm({ ...form, referredPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                />
              </div>
              <p className="text-xs text-muted">
                We&apos;ll track when they sign up and close a deal. You earn rewards on each milestone!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Property Category</label>
                  <select
                    value={form.propertyCategory || ""}
                    onChange={(e) => setForm({ ...form, propertyCategory: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                  >
                    <option value="">Select</option>
                    {PROPERTY_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Property Type</label>
                  <select
                    value={form.propertyType || ""}
                    onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                  >
                    <option value="">Select</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Owner&apos;s Contact Number *</label>
                <input
                  type="tel"
                  value={form.ownerContactNumber || ""}
                  onChange={(e) => setForm({ ...form, ownerContactNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Property Location / Address *</label>
                <input
                  type="text"
                  value={form.propertyLocation || ""}
                  onChange={(e) => setForm({ ...form, propertyLocation: e.target.value })}
                  placeholder="e.g. Malviya Nagar, Jaipur"
                  className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Additional Notes</label>
                <textarea
                  value={form.propertyNotes || ""}
                  onChange={(e) => setForm({ ...form, propertyNotes: e.target.value })}
                  placeholder="Any details about the property..."
                  rows={2}
                  className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent resize-y"
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-accent-dark px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark/90 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Referral"}
            </button>
          </div>
        </div>
      )}

      {/* Referrals List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-surface-white" />
          ))
        ) : !data?.referrals?.length ? (
          <div className="rounded-2xl border border-border bg-surface-white p-12 text-center shadow-soft">
            <svg className="mx-auto mb-3 h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-sm text-muted">No referrals yet.</p>
            <p className="mt-1 text-xs text-muted">Click &quot;New Referral&quot; to get started!</p>
          </div>
        ) : (
          data.referrals.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-medium capitalize text-body">
                      {r.referral_type === "friend" ? "Friend Referral" : "Property Referral"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                      {r.status.replace("_", " ")}
                    </span>
                  </div>

                  {r.referral_type === "friend" ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-heading">
                        {r.referred_user_name || r.referred_phone}
                      </p>
                      {r.referred_user_name && (
                        <p className="text-xs text-muted">{r.referred_phone}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-heading">{r.property_location}</p>
                      <p className="text-xs text-muted">
                        {r.property_category && <span className="capitalize">{r.property_category}</span>}
                        {r.property_type && <span> &middot; {r.property_type.replace("_", " ")}</span>}
                        {r.owner_contact_number && <span> &middot; Owner: {r.owner_contact_number}</span>}
                      </p>
                    </div>
                  )}

                  <p className="mt-1 text-[10px] text-muted">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                {r.status === "rewarded" && r.reward_amount && (
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-green-600">+₹{Number(r.reward_amount).toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-muted">Rewarded</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
