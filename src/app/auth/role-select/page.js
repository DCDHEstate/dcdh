"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const roles = [
  {
    id: "tenant",
    title: "I'm Looking for Property",
    subtitle: "Find your perfect home",
    description:
      "Browse verified listings, save favorites, schedule visits, and connect directly with property owners.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
    features: [
      "Zero brokerage guarantee",
      "Verified property listings",
      "WhatsApp connect with owners",
      "Referral rewards",
    ],
    gradient: "from-accent/10 to-accent-soft/50",
    borderActive: "border-accent",
    iconBg: "bg-accent-soft",
    iconColor: "text-accent",
  },
  {
    id: "owner",
    title: "I Want to List Property",
    subtitle: "Rent or sell with zero commission",
    description:
      "List your properties for free, manage leads, track tenant payments, and grow your portfolio.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
        />
      </svg>
    ),
    features: [
      "Free property listings",
      "Lead management dashboard",
      "Tenant payment tracking",
      "Document management",
    ],
    gradient: "from-primary/5 to-primary/10",
    borderActive: "border-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.full_name) {
      setFullName(user.full_name);
    }
  }, [authLoading, user]);

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!selectedRole) {
      setError("Please select how you want to use DCDH Empire");
      return;
    }

    setIsLoading(true);
    try {
      const roleRes = await fetch("/api/auth/role-select", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!roleRes.ok) {
        const data = await roleRes.json();
        console.error("Failed to save role:", data.error);
        setError(data.error || "Failed to save role. Please try again.");
        return;
      }

      const profileRes = await fetch(`/api/auth/profile-setup/${selectedRole}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          whatsappNumber: user?.whatsapp_number || user?.phone || "",
        }),
      });
      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        setError(profileData.error || "Failed to save profile. Please try again.");
        return;
      }

      await refreshUser();
      router.push(profileData.redirectTo || `/dashboard/${selectedRole}`);
    } catch (error) {
      console.error("Failed to save role:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleContinue} className="w-full max-w-2xl">
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
          Finish signup
        </h1>
        <p className="text-sm text-muted">
          Tell us your name and choose how you want to use DCDH Empire.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-heading">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError("");
              }}
              placeholder="Enter your full name"
              required
              autoFocus
              className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  value={user?.whatsapp_number || user?.phone || ""}
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
      </div>

      {/* Role Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => {
              setSelectedRole(role.id);
              setError("");
            }}
            className={`group relative overflow-hidden rounded-2xl border-2 bg-surface-white p-6 text-left transition-all duration-300 ${
              selectedRole === role.id
                ? `${role.borderActive} shadow-elevated`
                : "border-border hover:border-border hover:shadow-soft"
            }`}
          >
            {/* Selection Indicator */}
            <div
              className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                selectedRole === role.id
                  ? `${role.borderActive} bg-current`
                  : "border-border"
              }`}
            >
              {selectedRole === role.id && (
                <svg
                  className="h-3.5 w-3.5 text-white"
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
              )}
            </div>

            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                selectedRole === role.id ? "opacity-100" : ""
              }`}
            />

            {/* Content */}
            <div className="relative">
              {/* Icon */}
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${role.iconBg} ${role.iconColor}`}
              >
                {role.icon}
              </div>

              {/* Title */}
              <h3 className="mb-1 text-lg font-semibold text-heading">
                {role.title}
              </h3>
              <p className="mb-3 text-sm text-accent">{role.subtitle}</p>
              <p className="mb-4 text-sm text-muted">{role.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <svg
                      className={`h-4 w-4 flex-shrink-0 ${role.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        disabled={!selectedRole || !fullName.trim() || authLoading || isLoading}
        className="btn-premium w-full rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Setting up...
          </span>
        ) : (
          "Continue to Dashboard"
        )}
      </button>
    </form>
  );
}
