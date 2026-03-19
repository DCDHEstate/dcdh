"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "maintenance", "plumbing", "electrical", "pest_control", "noise",
  "security", "cleaning", "appliance", "structural", "other",
];

const PRIORITIES = ["low", "medium", "high", "urgent"];

export default function NewComplaintPage() {
  const router = useRouter();
  const [tenancies, setTenancies] = useState([]);
  const [form, setForm] = useState({
    tenancyId: "", category: "maintenance", priority: "medium", title: "", description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tenancies/mine?status=active")
      .then((r) => r.json())
      .then((data) => {
        const active = data.tenancies || [];
        setTenancies(active);
        if (active.length === 1) {
          setForm((f) => ({ ...f, tenancyId: active[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit complaint");
        return;
      }
      router.push(`/dashboard/tenant/complaints/${data.complaintId}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent";
  const labelClass = "block text-xs font-medium text-muted mb-1";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Raise a Complaint</h1>
        <p className="mt-1 text-sm text-muted">Describe the issue and we'll get it resolved.</p>
      </div>

      {tenancies.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-white p-12 text-center shadow-soft">
          <p className="text-sm text-muted">You need an active tenancy to raise a complaint.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="space-y-4">
            {tenancies.length > 1 && (
              <div>
                <label className={labelClass}>Tenancy *</label>
                <select
                  value={form.tenancyId}
                  onChange={(e) => setForm({ ...form, tenancyId: e.target.value })}
                  className={inputClass}
                  required
                >
                  <option value="">Select tenancy</option>
                  {tenancies.map((t) => (
                    <option key={t.id} value={t.id}>{t.property_title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className={inputClass}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="Brief summary of the issue"
                required
                maxLength={300}
              />
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder="Describe the issue in detail..."
                required
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting || !form.tenancyId}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-muted hover:bg-surface-subtle"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
