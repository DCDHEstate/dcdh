"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.phone?.slice(-2) || "A";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-heading sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Admin profile and account settings.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-lg font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-heading">
              {user?.full_name || "Admin User"}
            </p>
            <p className="text-sm text-muted">+91 {user?.phone}</p>
            {user?.email && (
              <p className="text-sm text-muted">{user.email}</p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-surface-subtle px-4 py-3">
            <div>
              <p className="text-sm font-medium text-heading">Role</p>
              <p className="text-xs text-muted">Your platform role</p>
            </div>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium capitalize text-accent-muted">
              {user?.role}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-surface-subtle px-4 py-3">
            <div>
              <p className="text-sm font-medium text-heading">Phone Verified</p>
              <p className="text-xs text-muted">WhatsApp OTP verification status</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${user?.is_phone_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {user?.is_phone_verified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
