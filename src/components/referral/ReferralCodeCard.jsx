"use client";

import { useState, useEffect } from "react";
import { ATTACH_WINDOW_DAYS, copyText } from "@/lib/referralOptions";

/**
 * Profile-page card for the link-based referral flow.
 *
 * Someone who signed up without following a referral link can still enter the
 * code afterwards, within ATTACH_WINDOW_DAYS of signing up. Once a referral is
 * attached it becomes read-only; attribution is single-use by design, so there
 * is nothing to edit.
 */
export default function ReferralCodeCard() {
  const [state, setState] = useState(null);
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/referrals/attach-code")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setState(d);
      })
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/referrals/attach-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Could not apply that code.");
        return;
      }
      setSuccess(
        d.referrerName
          ? `Referral linked — thanks to ${d.referrerName}!`
          : "Referral linked!",
      );
      setState((s) => ({
        ...s,
        canAttach: false,
        referredBy: { code: code.toUpperCase(), name: d.referrerName },
      }));
      setCode("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!state) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
      <h3 className="mb-4 text-sm font-semibold text-heading">Referrals</h3>

      <div className="mb-5">
        <label className="mb-1 block text-xs font-medium text-muted">
          Your referral link
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={state.myLink}
            onFocus={(e) => e.target.select()}
            className="w-full min-w-0 rounded-xl border border-border bg-surface-subtle px-4 py-2.5 font-mono text-sm text-body outline-none"
          />
          <button
            type="button"
            onClick={async () => {
              setCopied((await copyText(state.myLink)) ? "Copied!" : "Copy failed");
              setTimeout(() => setCopied(""), 2000);
            }}
            className="shrink-0 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-body transition hover:bg-surface-subtle"
          >
            {copied || "Copy"}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">
          Code: <span className="font-semibold">{state.myCode}</span>
        </p>
      </div>

      <div className="border-t border-border pt-5">
        {state.referredBy ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Referred by
            </label>
            <p className="text-sm text-body">
              {state.referredBy.name || "A DCDH member"}{" "}
              <span className="text-muted">({state.referredBy.code})</span>
            </p>
          </div>
        ) : !state.canAttach ? (
          <p className="text-xs text-muted">
            Referral codes can be added within {ATTACH_WINDOW_DAYS} days of
            signing up, so one can no longer be added to this account.
          </p>
        ) : (
          <form onSubmit={submit}>
            <label className="mb-1 block text-xs font-medium text-muted">
              Were you referred by someone?
            </label>
            <p className="mb-2 text-xs text-muted">
              Enter their referral code to link your account. This can only be
              set once, and only until{" "}
              {new Date(state.attachWindowEndsAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              .
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 10),
                  );
                  setError("");
                }}
                placeholder="e.g. K7P2XM"
                className="w-full min-w-0 rounded-xl border border-border bg-surface-white px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-body outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={saving || code.length < 4}
                className="shrink-0 rounded-xl bg-accent-dark px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark/90 disabled:opacity-50"
              >
                {saving ? "Applying..." : "Apply"}
              </button>
            </div>
          </form>
        )}

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        {success && <p className="mt-2 text-xs text-green-600">{success}</p>}
      </div>
    </div>
  );
}
