"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    whatsappSameAsPhone: true,
    whatsappNumber: "",
    occupation: "",
    companyName: "",
    preferredPropertyType: "",
    preferredBhk: "",
    budgetMin: "",
    budgetMax: "",
    familySize: "",
    hasPets: false,
  });

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

    try {
      // TODO: Save profile to database
      // await saveTenantProfile(formData);

      console.log("Profile data:", formData);

      // Redirect to tenant portal or home
      router.push("/tenant-portal");
    } catch (error) {
      console.error("Failed to save profile:", error);
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
        {/* Contact Section */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              1
            </span>
            Contact Information
          </h2>

          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Phone Number <span className="text-accent">*</span>
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
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-14 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
              </div>
            </div>

            {/* WhatsApp Same as Phone */}
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  name="whatsappSameAsPhone"
                  checked={formData.whatsappSameAsPhone}
                  onChange={handleChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-surface-subtle transition-all checked:border-whatsapp checked:bg-whatsapp focus:outline-none focus:ring-2 focus:ring-whatsapp/30 focus:ring-offset-1"
                />
                <svg
                  className="pointer-events-none absolute left-0.5 top-0.5 hidden h-4 w-4 text-white peer-checked:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-muted">
                WhatsApp number is same as phone
              </span>
            </label>

            {/* WhatsApp Number (if different) */}
            {!formData.whatsappSameAsPhone && (
              <div>
                <label className="mb-2 block text-sm font-medium text-heading">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="Enter WhatsApp number"
                    className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-14 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-whatsapp focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-whatsapp/30"
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
            {/* Property Type */}
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

            {/* BHK */}
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

            {/* Budget Range */}
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

            {/* Family Details */}
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
          disabled={isLoading || !formData.phone}
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
            onClick={() => router.push("/")}
            className="font-medium text-accent transition-colors hover:text-accent-dark"
          >
            Skip for now
          </button>
        </p>
      </form>
    </div>
  );
}
