"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const propertyTypes = [
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "independent_house", label: "Independent House" },
  { id: "builder_floor", label: "Builder Floor" },
  { id: "studio", label: "Studio" },
];

const bhkOptions = [
  { id: 1, label: "1 BHK" },
  { id: 2, label: "2 BHK" },
  { id: 3, label: "3 BHK" },
  { id: 4, label: "4+ BHK" },
];

export default function TenantProfilePage() {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsappNumber: "",
    occupation: "",
    companyName: "",
    budgetMin: "",
    budgetMax: "",
    preferredPropertyType: "",
    preferredBhk: "",
    familySize: "",
    hasPets: false,
  });

  useEffect(() => {
    fetch("/api/auth/profile-setup/tenant")
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/profile-setup/tenant", {
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
          Update your personal info and property preferences.
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

        {/* Personal Info */}
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

        {/* Occupation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
            className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Company */}
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Company / Organization
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

        {/* Preferences */}
        <div className="border-t border-border-light pt-6">
          <h3 className="mb-4 text-sm font-semibold text-heading">
            Property Preferences
          </h3>

          {/* Budget Range */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-muted">
                Min Budget (₹)
              </label>
              <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                placeholder="e.g., 10000"
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-muted">
                Max Budget (₹)
              </label>
              <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                placeholder="e.g., 25000"
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-heading">
              Preferred Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      preferredPropertyType: prev.preferredPropertyType === type.id ? "" : type.id,
                    }))
                  }
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    formData.preferredPropertyType === type.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted hover:border-primary/50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* BHK */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-heading">
              Preferred BHK
            </label>
            <div className="flex flex-wrap gap-2">
              {bhkOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      preferredBhk: prev.preferredBhk === String(opt.id) ? "" : String(opt.id),
                    }))
                  }
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    formData.preferredBhk === String(opt.id)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Family & Pets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Family Size
              </label>
              <input
                type="number"
                name="familySize"
                value={formData.familySize}
                onChange={handleChange}
                min="1"
                max="20"
                placeholder="e.g., 4"
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3.5 transition-all hover:border-primary/50">
                <input
                  type="checkbox"
                  name="hasPets"
                  checked={formData.hasPets}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-heading">Has Pets</span>
              </label>
            </div>
          </div>
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
