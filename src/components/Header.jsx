"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function UserAvatar({ user, size = "h-9 w-9", textSize = "text-sm" }) {
  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.phone?.slice(-2) || "U";

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dark ${textSize} font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const links = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/search" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const dashboardHref =
    user?.role === "owner"
      ? "/dashboard/owner"
      : user?.role === "admin"
        ? "/admin"
        : "/dashboard/tenant";

  const ownerLinks = [
    { name: "Dashboard", href: "/dashboard/owner", icon: GridIcon },
    { name: "My Properties", href: "/dashboard/owner/properties", icon: BuildingIcon },
    { name: "Post Property", href: "/dashboard/owner/post-property", icon: PlusIcon },
    { name: "Leads", href: "/dashboard/owner/leads", icon: UsersIcon },
    { name: "Profile", href: "/dashboard/owner/profile", icon: UserIcon },
  ];

  const tenantLinks = [
    { name: "Dashboard", href: "/dashboard/tenant", icon: GridIcon },
    { name: "Browse Properties", href: "/search", icon: SearchIcon },
    { name: "Saved", href: "/dashboard/tenant/saved", icon: HeartIcon },
    { name: "Profile", href: "/dashboard/tenant/profile", icon: UserIcon },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: GridIcon },
    { name: "Properties", href: "/admin/properties", icon: BuildingIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
    { name: "Leads", href: "/admin/leads", icon: UsersIcon },
    { name: "Settings", href: "/admin/settings", icon: UserIcon },
  ];

  const roleLinks =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "owner"
        ? ownerLinks
        : tenantLinks;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        isScrolled || isDashboard
          ? "bg-surface-white/95 backdrop-blur-2xl shadow-soft"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5">
          <div className="relative">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-light to-primary shadow-sm transition-all duration-500 ${isScrolled || isDashboard ? "ring-1 ring-accent/10" : ""}`}
            >
              <span className="text-lg font-semibold tracking-tight text-accent-light">
                D
              </span>
            </div>
          </div>
          <div>
            <div
              className={`text-lg font-semibold tracking-tight transition-colors duration-700 ${isScrolled || isDashboard ? "text-heading" : "text-white"}`}
            >
              DCDH Empire
            </div>
            <div
              className={`text-[10px] font-medium tracking-elegant transition-colors duration-700 ${isScrolled || isDashboard ? "text-subtle" : "text-faint"}`}
            >
              PREMIUM PROPERTIES
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className={`border-gradient-hover rounded-full px-5 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${
                isActive(l.href)
                  ? isScrolled || isDashboard
                    ? "bg-accent-soft text-accent-dark"
                    : "bg-white/15 text-white"
                  : isScrolled || isDashboard
                    ? "text-muted hover:bg-surface-subtle hover:text-heading"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.name}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href={dashboardHref}
              className={`border-gradient-hover rounded-full px-5 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${
                isDashboard
                  ? "bg-accent-soft text-accent-dark"
                  : isScrolled
                    ? "text-muted hover:bg-surface-subtle hover:text-heading"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side: Auth CTA or User Menu */}
        <div className="hidden items-center gap-4 lg:flex">
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-subtle" />
          ) : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-border-light bg-surface-white px-3 py-1.5 transition-all hover:shadow-soft"
              >
                <UserAvatar user={user} size="h-8 w-8" textSize="text-xs" />
                <span className="max-w-[120px] truncate text-sm font-medium text-heading">
                  {user.full_name || `+91${user.phone?.slice(-4)}`}
                </span>
                <svg
                  className={`h-4 w-4 text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border-light bg-surface-white p-2 shadow-premium">
                  {/* User info */}
                  <div className="mb-2 rounded-xl bg-surface-subtle px-4 py-3">
                    <p className="text-sm font-semibold text-heading">
                      {user.full_name || "Welcome!"}
                    </p>
                    <p className="text-xs text-muted">+91 {user.phone}</p>
                    <span className="mt-1 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium capitalize text-accent-muted">
                      {user.role}
                    </span>
                  </div>

                  {/* Role links */}
                  {roleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
                        isActive(link.href)
                          ? "bg-accent-soft text-accent-dark"
                          : "text-body hover:bg-surface-subtle hover:text-heading"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  ))}

                  {/* Divider + Logout */}
                  <div className="my-2 h-px bg-border-light" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-500 transition-all hover:bg-red-50"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`text-[13px] font-medium tracking-wide transition-all duration-300 ${isScrolled ? "text-muted hover:text-heading" : "text-white/80 hover:text-white"}`}
              >
                Sign In
              </Link>
              <Link
                href="/auth/login"
                className="btn-premium flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-light to-primary px-6 py-2.5 text-[13px] font-medium tracking-wide text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              >
                Get Started
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`rounded-lg p-2.5 lg:hidden ${isScrolled || isDashboard ? "hover:bg-surface-subtle" : "hover:bg-white/10"}`}
        >
          <svg
            className={`h-5 w-5 transition-colors duration-300 ${isScrolled || isDashboard ? "text-body" : "text-white"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-20 mx-4 glass rounded-2xl p-5 shadow-premium lg:hidden">
          {/* User info (if authenticated) */}
          {isAuthenticated && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3">
              <UserAvatar user={user} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-heading">
                  {user.full_name || "Welcome!"}
                </p>
                <p className="text-xs text-muted">+91 {user.phone}</p>
              </div>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium capitalize text-accent-muted">
                {user.role}
              </span>
            </div>
          )}

          {/* Main nav links */}
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                isActive(l.href)
                  ? "bg-accent-soft text-accent-dark"
                  : "text-body hover:bg-surface-subtle hover:text-heading"
              }`}
            >
              {l.name}
            </Link>
          ))}

          {/* Role-specific links (if authenticated) */}
          {isAuthenticated && (
            <>
              <div className="my-3 h-px bg-border-light" />
              <p className="mb-2 px-4 text-[10px] font-medium uppercase tracking-elegant text-subtle">
                {user.role === "admin" ? "Admin Panel" : user.role === "owner" ? "Owner Portal" : "Tenant Portal"}
              </p>
              {roleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                    isActive(link.href)
                      ? "bg-accent-soft text-accent-dark"
                      : "text-body hover:bg-surface-subtle hover:text-heading"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </>
          )}

          {/* Auth actions */}
          <div className="mt-4 space-y-2 border-t border-border-light pt-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-body transition hover:bg-surface-subtle"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function GridIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}
