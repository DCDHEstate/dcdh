"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Contact
    phone: "",
    whatsappSameAsPhone: true,
    whatsappNumber: "",
    // Business
    companyName: "",
    address: "",
    pincode: "",
    // Property categories they deal in
    propertyCategories: [],
    // Banking
    preferredPayoutMethod: "upi",
    upiId: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
  });

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

    try {
      // TODO: Save profile to database
      // await saveOwnerProfile(formData);

      console.log("Profile data:", formData);

      // Redirect to owner portal
      router.push("/owner-portal");
    } catch (error) {
      console.error("Failed to save profile:", error);
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
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="mb-4 text-lg font-semibold text-heading">
              Contact Information
            </h2>

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
                  className="w-full rounded-xl border border-border bg-surface-subtle py-3.5 pl-14 pr-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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

            {/* Next Button */}
            <button
              type="button"
              onClick={nextStep}
              disabled={!formData.phone}
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

            {/* Company Name */}
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

            {/* Address */}
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

            {/* Pincode */}
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

            {/* Property Categories */}
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

            {/* Navigation Buttons */}
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
              💡 This information is used to transfer rent payments from
              tenants. You can update it later.
            </p>

            {/* Payout Method */}
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

            {/* UPI Details */}
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

            {/* Bank Details */}
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

            {/* Navigation Buttons */}
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
            onClick={() => router.push("/owner-portal")}
            className="font-medium text-accent transition-colors hover:text-accent-dark"
          >
            Skip for now
          </button>
        </p>
      </form>
    </div>
  );
}
