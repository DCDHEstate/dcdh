"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function OwnerProfilePage() {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsappNumber: "",
    companyName: "",
    address: "",
    pincode: "",
    preferredPayoutMethod: "upi",
    upiId: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
  });

  useEffect(() => {
    fetch("/api/auth/profile-setup/owner")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setFormData(data);
        }
      })
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/profile-setup/owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }

      await refreshUser();
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-surface-subtle" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-surface-subtle" />
        </div>
        <div className="space-y-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-surface-subtle" />
              <div className="h-12 animate-pulse rounded-xl bg-surface-subtle" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">Profile Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Update your personal and payout information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8"
      >
        {success && (
          <p className="rounded-xl border border-verified/30 bg-verified/10 p-3 text-sm text-verified">
            {success}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Phone (read-only) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
              +91
            </span>
            <input
              type="tel"
              value={formData.phone}
              readOnly
              className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-14 pr-4 text-sm text-muted"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Company / Business Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Payout */}
        <div className="border-t border-border-light pt-6">
          <h3 className="mb-4 text-sm font-semibold text-heading">
            Payout Details
          </h3>
          <div className="flex gap-3">
            {["upi", "bank_transfer"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, preferredPayoutMethod: method }))
                }
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  formData.preferredPayoutMethod === method
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted hover:border-primary/50"
                }`}
              >
                {method === "upi" ? "UPI" : "Bank Transfer"}
              </button>
            ))}
          </div>

          {formData.preferredPayoutMethod === "upi" && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-heading">
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="yourname@upi"
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {formData.preferredPayoutMethod === "bank_transfer" && (
            <div className="mt-4 space-y-4">
              {[
                { name: "bankAccountName", label: "Account Holder Name", placeholder: "As per bank records" },
                { name: "bankAccountNumber", label: "Account Number", placeholder: "Enter account number" },
                { name: "bankIfscCode", label: "IFSC Code", placeholder: "e.g., HDFC0001234" },
                { name: "bankName", label: "Bank Name", placeholder: "e.g., HDFC Bank" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-medium text-heading">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-premium w-full rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
