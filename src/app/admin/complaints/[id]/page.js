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

const STATUS_OPTIONS = ["open", "acknowledged", "in_progress", "resolved", "closed"];

export default function AdminComplaintDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const fetchData = () => {
    fetch(`/api/complaints/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setComplaint(data.complaint);
        setComments(data.comments || []);
        if (data.complaint?.resolution_notes) setResolutionNotes(data.complaint.resolution_notes);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateStatus = async (newStatus) => {
    const body = { status: newStatus };
    if (newStatus === "resolved" && resolutionNotes) {
      body.resolutionNotes = resolutionNotes;
    }
    try {
      await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      fetchData();
    } catch {
      // ignore
    }
  };

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

  if (isLoading) {
    return <div className="mx-auto max-w-3xl"><div className="h-48 animate-pulse rounded-2xl border border-border bg-surface-white" /></div>;
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
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-heading sm:text-2xl">{complaint.title}</h1>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[complaint.status] || "bg-gray-100 text-gray-600"}`}>
            {complaint.status.replace("_", " ")}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {complaint.property_title} · {complaint.tenant_name} ({complaint.tenant_phone}) · {complaint.category.replace("_", " ")} · {complaint.priority} priority
        </p>
      </div>

      {/* Complaint description */}
      <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <p className="whitespace-pre-wrap text-sm text-body">{complaint.description}</p>
        {mediaUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {mediaUrls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                Attachment {i + 1}
              </a>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <p>Raised: {new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p>Owner: {complaint.owner_name} ({complaint.owner_phone})</p>
          {complaint.satisfaction_rating && <p>Satisfaction: {complaint.satisfaction_rating}/5 stars</p>}
        </div>
      </div>

      {/* Admin actions */}
      <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <h2 className="mb-3 text-sm font-semibold text-heading">Admin Actions</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.filter((s) => s !== complaint.status).map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                s === "resolved" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                s === "closed" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" :
                "bg-surface-subtle text-body hover:bg-surface-white border border-border"
              }`}
            >
              Mark as {s.replace("_", " ")}
            </button>
          ))}
        </div>
        {complaint.status !== "resolved" && complaint.status !== "closed" && (
          <div className="mt-3">
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Resolution notes (optional, added when resolving)..."
              className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent min-h-[60px] resize-y"
            />
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold text-heading">Comments</h2>

        {comments.length === 0 ? (
          <p className="mb-4 text-sm text-muted">No comments yet.</p>
        ) : (
          <div className="mb-4 space-y-4">
            {comments.map((c) => (
              <div key={c.id} className={`rounded-xl p-4 ${c.user_role === "admin" ? "bg-blue-50" : "bg-surface-subtle"}`}>
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-medium text-heading">{c.user_name}</p>
                  <span className="text-xs capitalize text-muted">{c.user_role}</span>
                  <span className="text-xs text-muted">· {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-body">{c.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body outline-none focus:border-accent min-h-[80px] resize-y"
          />
          <button
            onClick={submitComment}
            disabled={submitting || !newComment.trim()}
            className="self-end rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-dark disabled:opacity-50"
          >
            {submitting ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
