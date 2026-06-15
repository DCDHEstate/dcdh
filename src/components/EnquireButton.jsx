"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function EnquireButton({ whatsappLink, redirectPath, className, children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleClick = (e) => {
    if (isLoading) { e.preventDefault(); return; }
    if (!isAuthenticated) {
      e.preventDefault();
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath || "/")}`);
    }
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
