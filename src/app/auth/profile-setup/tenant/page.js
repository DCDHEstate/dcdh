"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function TenantProfileSetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    phoneSameAsWhatsapp: true,
    phone: "",
    occupation: "",
    companyName: "",
    preferredPropertyType: "",
    preferredBhk: "",
    budgetMin: "",
    budgetMax: "",
    familySize: "",
    hasPets: false,
  });

  // Pre-populate from auth once loaded
  useEffect(() => {
    if (!authLoading && user?.phone) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: user.phone,
        phone: user.phone,
        fullName: user.full_name || "",
      }));
    }
  }, [authLoading, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/profile-setup/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          whatsappNumber: formData.whatsappNumber,
          occupation: formData.occupation,
          companyName: formData.companyName,
          preferredPropertyType: formData.preferredPropertyType,
          preferredBhk: formData.preferredBhk,
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          familySize: formData.familySize,
          hasPets: formData.hasPets,
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
    <div className="w-full max-w-2xl">
      {/* Header */}
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
          Complete your profile
        </h1>
        <p className="text-muted">
          Help us find your perfect property match
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8"
      >
        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Contact Section */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              1
            </span>
            Contact Information
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoFocus
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </div>

            {/* WhatsApp Number — verified via OTP */}
            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                WhatsApp Number <span className="text-accent">*</span>
              </label>
              {authLoading ? (
                <div className="h-12 animate-pulse rounded-xl bg-surface-subtle" />
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      readOnly
                      className="w-full rounded-xl border border-verified/40 bg-verified/5 py-3.5 pl-14 pr-12 text-sm text-body"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-verified">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-verified">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Verified via WhatsApp OTP
                  </p>
                </>
              )}
            </div>

            {/* Phone same as WhatsApp */}
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  name="phoneSameAsWhatsapp"
                  checked={formData.phoneSameAsWhatsapp}
                  onChange={handleChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-surface-subtle transition-all checked:border-accent checked:bg-accent focus:outline-none focus:ring-2 focus:ring-accent-soft focus:ring-offset-1"
                />
                <svg
                  className="pointer-events-none absolute left-0.5 top-0.5 hidden h-4 w-4 text-white peer-checked:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-muted">
                Phone number is same as WhatsApp
              </span>
            </label>

            {/* Phone Number (if different) */}
            {!formData.phoneSameAsWhatsapp && (
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-14 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Section */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              2
            </span>
            Professional Details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
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
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Company / Organization
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Where do you work?"
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              3
            </span>
            Property Preferences
          </h2>

          <div className="space-y-4">
            <div>
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
                        preferredPropertyType: type.id,
                      }))
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      formData.preferredPropertyType === type.id
                        ? "border-accent bg-accent-soft text-accent-muted"
                        : "border-border text-muted hover:border-accent/50 hover:bg-accent-soft/30"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Preferred Configuration
              </label>
              <div className="flex flex-wrap gap-2">
                {bhkOptions.map((bhk) => (
                  <button
                    key={bhk.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preferredBhk: bhk.id,
                      }))
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      formData.preferredBhk === bhk.id
                        ? "border-accent bg-accent-soft text-accent-muted"
                        : "border-border text-muted hover:border-accent/50 hover:bg-accent-soft/30"
                    }`}
                  >
                    {bhk.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Monthly Budget Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    placeholder="Min"
                    className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-10 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    placeholder="Max"
                    className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-10 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-heading">
                  Family Size
                </label>
                <select
                  name="familySize"
                  value={formData.familySize}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                >
                  <option value="">Select</option>
                  <option value="1">Just me</option>
                  <option value="2">2 members</option>
                  <option value="3">3 members</option>
                  <option value="4">4 members</option>
                  <option value="5">5+ members</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-heading">
                  Do you have pets?
                </label>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, hasPets: true }))
                    }
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      formData.hasPets === true
                        ? "border-accent bg-accent-soft text-accent-muted"
                        : "border-border text-muted hover:border-accent/50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, hasPets: false }))
                    }
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      formData.hasPets === false
                        ? "border-accent bg-accent-soft text-accent-muted"
                        : "border-border text-muted hover:border-accent/50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.fullName.trim()}
          className="btn-premium w-full rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </span>
          ) : (
            "Complete Setup"
          )}
        </button>

        {/* Skip Link */}
        <p className="mt-4 text-center text-sm text-muted">
          Want to explore first?{" "}
          <button
            type="button"
            onClick={() => router.push("/dashboard/tenant")}
            className="font-medium text-accent transition-colors hover:text-accent-dark"
          >
            Skip for now
          </button>
        </p>
      </form>
    </div>
  );
}
