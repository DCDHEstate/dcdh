"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="flex items-start">
        <AdminSidebar />
        <main className="min-h-[calc(100vh-5rem)] flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>
      <AdminBottomNav />
    </div>
  );
}
