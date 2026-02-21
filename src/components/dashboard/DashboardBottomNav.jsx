"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const ownerNav = [
  { name: "Home", href: "/dashboard/owner", icon: GridIcon },
  { name: "Properties", href: "/dashboard/owner/properties", icon: BuildingIcon },
  { name: "Post", href: "/dashboard/owner/post-property", icon: PlusCircleIcon, accent: true },
  { name: "Leads", href: "/dashboard/owner/leads", icon: InboxIcon },
  { name: "Profile", href: "/dashboard/owner/profile", icon: UserIcon },
];

const tenantNav = [
  { name: "Home", href: "/dashboard/tenant", icon: GridIcon },
  { name: "Browse", href: "/search", icon: SearchIcon },
  { name: "Saved", href: "/dashboard/tenant/saved", icon: HeartIcon },
  { name: "Profile", href: "/dashboard/tenant/profile", icon: UserIcon },
];

export default function DashboardBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user?.role === "owner" ? ownerNav : tenantNav;

  const isActive = (href) => {
    if (href === "/dashboard/owner" || href === "/dashboard/tenant") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border-light bg-surface-white/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all ${
              item.accent
                ? "text-accent"
                : isActive(item.href)
                  ? "text-accent-dark"
                  : "text-muted"
            }`}
          >
            <item.icon
              className={`h-6 w-6 ${
                item.accent
                  ? "text-accent"
                  : isActive(item.href)
                    ? "text-accent-dark"
                    : ""
              }`}
            />
            <span
              className={`text-[10px] font-medium ${
                isActive(item.href) ? "text-accent-dark" : ""
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// ── Icons ──

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

function PlusCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function InboxIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0V6.75A2.25 2.25 0 014.5 4.5h15A2.25 2.25 0 0121.75 6.75v6.75m-17.5 0v4.5A2.25 2.25 0 006.75 19.5h10.5a2.25 2.25 0 002.25-2.25v-4.5" />
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
