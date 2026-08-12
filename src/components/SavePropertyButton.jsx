'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SavePropertyButton({ propertyId, className = '' }) {
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed]   = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/properties/save?propertyId=${propertyId}`)
      .then(r => r.json())
      .then(data => {
        setSaved(data.saved);
        if (data.unauthenticated) setAuthed(false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propertyId]);

  const toggle = async () => {
    if (!authed) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/properties/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });
      if (res.status === 401) {
        setAuthed(false);
        router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Remove from saved' : 'Save property'}
      title={saved ? 'Remove from saved' : 'Save property'}
      className={`group flex items-center justify-center rounded-full transition-all disabled:opacity-60 ${className}`}
    >
      <svg
        className={`h-5 w-5 transition-all duration-200 ${
          saved
            ? 'fill-red-500 stroke-red-500'
            : 'fill-transparent stroke-current group-hover:stroke-red-400'
        } ${loading ? 'opacity-50' : ''}`}
        viewBox="0 0 24 24"
        strokeWidth={2}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
