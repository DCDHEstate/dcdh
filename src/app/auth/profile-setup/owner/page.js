"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const propertyCategories = [
  { id: "residential", label: "Residential", icon: "🏠" },
  { id: "commercial", label: "Commercial", icon: "🏢" },
  { id: "land", label: "Land/Plot", icon: "🌳" },
];

const payoutMethods = [
  { id: "upi", label: "UPI" },
  { id: "bank_transfer", label: "Bank Transfer" },
];

export default function OwnerProfileSetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    phoneSameAsWhatsapp: true,
    phone: "",
    companyName: "",
    address: "",
    pincode: "",
    propertyCategories: [],
    preferredPayoutMethod: "upi",
    upiId: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
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

  const toggleCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      propertyCategories: prev.propertyCategories.includes(categoryId)
        ? prev.propertyCategories.filter((id) => id !== categoryId)
        : [...prev.propertyCategories, categoryId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/profile-setup/owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          whatsappNumber: formData.whatsappNumber,
          companyName: formData.companyName,
          address: formData.address,
          pincode: formData.pincode,
          propertyCategories: formData.propertyCategories,
          preferredPayoutMethod: formData.preferredPayoutMethod,
          upiId: formData.upiId,
          bankAccountName: formData.bankAccountName,
          bankAccountNumber: formData.bankAccountNumber,
          bankIfscCode: formData.bankIfscCode,
          bankName: formData.bankName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save profile. Please try again.");
        return;
      }

      await refreshUser();
      router.push(data.redirectTo || "/dashboard/owner");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            2
          </span>
          <span className="text-xs font-medium tracking-elegant text-primary-soft">
            STEP 2 OF 2
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-heading sm:text-3xl">
          Set up your owner profile
        </h1>
        <p className="text-muted">
          Start listing properties and managing your portfolio
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {["Contact", "Business", "Payout"].map((label, index) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    step > index + 1
                      ? "bg-verified text-white"
                      : step === index + 1
                        ? "bg-primary text-white"
                        : "bg-surface-subtle text-muted"
                  }`}
                >
                  {step > index + 1 ? (
                    <svg
                      className="h-4 w-4"
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
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    step >= index + 1 ? "text-heading" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all ${
                    step > index + 1 ? "bg-verified" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
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

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="mb-4 text-lg font-semibold text-heading">
              Contact Information
            </h2>

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
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-surface-subtle transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
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
                    className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-14 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={nextStep}
              disabled={!formData.fullName.trim()}
              className="w-full rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Business Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="mb-4 text-lg font-semibold text-heading">
              Business Details
            </h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Company / Business Name{" "}
                <span className="text-muted">(Optional)</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Leave blank if individual owner"
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Business Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your office or residential address"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                What type of properties do you deal in?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {propertyCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      formData.propertyCategories.includes(category.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="mb-1 block text-2xl">{category.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        formData.propertyCategories.includes(category.id)
                          ? "text-primary"
                          : "text-muted"
                      }`}
                    >
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-border bg-surface-white px-8 py-4 text-base font-medium text-muted transition-all duration-300 hover:bg-surface-subtle"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payout Details */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="mb-4 text-lg font-semibold text-heading">
              Payout Details
            </h2>
            <p className="mb-6 rounded-xl border border-accent/20 bg-accent-soft/50 p-4 text-sm text-muted">
              This information is used to transfer rent payments from tenants.
              You can update it later.
            </p>

            <div>
              <label className="mb-2 block text-sm font-medium text-heading">
                Preferred Payout Method
              </label>
              <div className="flex gap-3">
                {payoutMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preferredPayoutMethod: method.id,
                      }))
                    }
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      formData.preferredPayoutMethod === method.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted hover:border-primary/50"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.preferredPayoutMethod === "upi" && (
              <div>
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
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-heading">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData.bankAccountName}
                    onChange={handleChange}
                    placeholder="As per bank records"
                    className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-heading">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-heading">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="bankIfscCode"
                      value={formData.bankIfscCode}
                      onChange={handleChange}
                      placeholder="e.g., HDFC0001234"
                      className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-heading">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g., HDFC Bank"
                      className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-border bg-surface-white px-8 py-4 text-base font-medium text-muted transition-all duration-300 hover:bg-surface-subtle"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-premium flex-1 rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>
          </div>
        )}

        {/* Skip Link */}
        <p className="mt-4 text-center text-sm text-muted">
          Want to add details later?{" "}
          <button
            type="button"
            onClick={() => router.push("/dashboard/owner")}
            className="font-medium text-accent transition-colors hover:text-accent-dark"
          >
            Skip for now
          </button>
        </p>
      </form>
    </div>
  );
}
