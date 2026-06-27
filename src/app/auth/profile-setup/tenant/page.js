"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TenantProfileSetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    if (!authLoading && user?.phone) {
      setFormData({
        fullName: user.full_name || "",
        whatsappNumber: user.whatsapp_number || user.phone,
      });
    }
  }, [authLoading, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/profile-setup/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          whatsappNumber: formData.whatsappNumber || user?.phone || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save profile. Please try again.");
        return;
      }

      await refreshUser();
      router.push(data.redirectTo || "/dashboard/tenant");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/50 px-4 py-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            2
          </span>
          <span className="text-xs font-medium tracking-elegant text-accent-muted">
            STEP 2 OF 2
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-heading sm:text-3xl">
          Finish signup
        </h1>
        <p className="text-sm text-muted">
          Add your name to continue to your dashboard.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8"
      >
        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-heading">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                setError("");
              }}
              placeholder="Enter your full name"
              required
              autoFocus
              className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-heading">
              Verified Phone Number
            </label>
            {authLoading ? (
              <div className="h-12 animate-pulse rounded-xl bg-surface-subtle" />
            ) : (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  readOnly
                  className="w-full rounded-xl border border-verified/40 bg-verified/5 py-3.5 pl-14 pr-12 text-sm text-body"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-verified">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || authLoading || !formData.fullName.trim()}
          className="btn-premium mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            "Continue to Dashboard"
          )}
        </button>
      </form>
    </div>
  );
}
