"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_COLORS = {
  open: "bg-red-100 text-red-700",
  acknowledged: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
  reopened: "bg-orange-100 text-orange-700",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-50 text-yellow-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
};

const STATUS_STEPS = ["open", "acknowledged", "in_progress", "resolved", "closed"];

function getStepIndex(status) {
  if (status === "reopened") return 0;
  return STATUS_STEPS.indexOf(status);
}

function timeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const ROLE_AVATAR_COLORS = {
  admin: "bg-blue-600 text-white",
  tenant: "bg-accent text-white",
  owner: "bg-purple-600 text-white",
};

function StatusTracker({ status }) {
  const currentStep = getStepIndex(status);
  const isReopened = status === "reopened";

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface-white p-5 shadow-soft">
      {isReopened && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
          </svg>
          This complaint was reopened by the tenant
        </div>
      )}
      <div className="flex items-center justify-between">
        {STATUS_STEPS.map((step, i) => {
          const isCompleted = i <= currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    isCurrent
                      ? "bg-accent text-white ring-4 ring-accent/20"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-surface-subtle text-muted"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`mt-1.5 text-[10px] capitalize ${isCurrent ? "font-semibold text-accent" : isCompleted ? "text-green-600 font-medium" : "text-muted"}`}>
                  {step.replace("_", " ")}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 rounded ${i < currentStep ? "bg-green-400" : "bg-surface-subtle"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OwnerComplaintDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = () => {
    fetch(`/api/complaints/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setComplaint(data.complaint);
        setComments(data.comments || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const submitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/complaints/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchData();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchData();
    } catch {} finally { setUpdatingStatus(false); }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-16 animate-pulse rounded-2xl border border-border bg-surface-white" />
        <div className="h-20 animate-pulse rounded-2xl border border-border bg-surface-white" />
        <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface-white" />
      </div>
    );
  }

  if (!complaint) {
    return <div className="mx-auto max-w-3xl py-12 text-center"><p className="text-muted">Complaint not found.</p></div>;
  }

  const mediaUrls = Array.isArray(complaint.media_urls)
    ? complaint.media_urls
    : (() => { try { return JSON.parse(complaint.media_urls || '[]'); } catch { return []; } })();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-heading sm:text-2xl">{complaint.title}</h1>
          <span className={`shrink-0 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_COLORS[complaint.status] || "bg-gray-100 text-gray-600"}`}>
            {complaint.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Status Tracker */}
      <StatusTracker status={complaint.status} />

      {/* Info Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface-white p-3.5 shadow-soft">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Property</p>
          <p className="mt-1 text-sm font-medium text-heading truncate">{complaint.property_title}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-white p-3.5 shadow-soft">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Tenant</p>
          <p className="mt-1 text-sm font-medium text-heading truncate">{complaint.tenant_name}</p>
          {complaint.tenant_phone && (
            <p className="text-[10px] text-muted">{complaint.tenant_phone}</p>
          )}
        </div>
        <div className="rounded-xl border border-border bg-surface-white p-3.5 shadow-soft">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Category</p>
          <p className="mt-1 text-sm font-medium text-heading capitalize">{complaint.category.replace("_", " ")}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-white p-3.5 shadow-soft">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Priority</p>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${PRIORITY_STYLES[complaint.priority]}`}>
            {complaint.priority}
          </span>
        </div>
      </div>

      {/* Complaint details */}
      <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-heading uppercase tracking-wider">Description</h2>
          <span className="text-xs text-muted">
            {timeAgo(complaint.created_at)} &middot; {new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">{complaint.description}</p>
        {mediaUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {mediaUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-body transition-colors hover:bg-surface-white hover:text-accent"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                Attachment {i + 1}
              </a>
            ))}
          </div>
        )}
        {complaint.resolution_notes && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">Resolution Notes</p>
            <p className="text-sm text-green-800">{complaint.resolution_notes}</p>
          </div>
        )}
      </div>

      {/* Owner Actions */}
      {!["resolved", "closed"].includes(complaint.status) && (
        <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
          <h2 className="mb-3 text-sm font-semibold text-heading uppercase tracking-wider">Actions</h2>
          <div className="flex flex-wrap gap-2">
            {complaint.status !== "acknowledged" && (
              <button
                disabled={updatingStatus}
                onClick={() => updateStatus("acknowledged")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Acknowledge
              </button>
            )}
            {complaint.status !== "in_progress" && (
              <button
                disabled={updatingStatus}
                onClick={() => updateStatus("in_progress")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700 transition-all hover:bg-yellow-100 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.194-.14 1.743" />
                </svg>
                Mark In Progress
              </button>
            )}
          </div>
        </div>
      )}

      {/* Satisfaction rating (shown if tenant rated) */}
      {complaint.satisfaction_rating && (
        <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
          <p className="mb-2 text-sm font-semibold text-heading">Tenant Satisfaction</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-2xl ${star <= complaint.satisfaction_rating ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-heading uppercase tracking-wider">
            Comments
          </h2>
          <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-medium text-muted">
            {comments.length}
          </span>
        </div>

        {comments.length === 0 ? (
          <div className="mb-4 rounded-xl bg-surface-subtle py-8 text-center">
            <svg className="mx-auto mb-2 h-8 w-8 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <p className="text-xs text-muted">No comments yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="mb-4 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                {/* Avatar */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${ROLE_AVATAR_COLORS[c.user_role] || "bg-gray-500 text-white"}`}>
                  {getInitials(c.user_name)}
                </div>
                {/* Bubble */}
                <div className={`flex-1 rounded-xl px-4 py-3 ${c.user_role === "admin" ? "bg-blue-50 border border-blue-100" : c.user_name === user?.full_name ? "bg-accent-soft/20 border border-accent/10" : "bg-surface-subtle"}`}>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-xs font-semibold text-heading">{c.user_name}</p>
                    {c.user_role === "admin" && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-700">Admin</span>
                    )}
                    {c.user_role === "tenant" && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-green-700">Tenant</span>
                    )}
                    <span className="text-[10px] text-muted">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-body">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {complaint.status !== "closed" && (
          <div className="flex gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${ROLE_AVATAR_COLORS.owner}`}>
              {getInitials(user?.full_name)}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 min-h-[80px] resize-y"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={submitComment}
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-dark disabled:opacity-50"
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
