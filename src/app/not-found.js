'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-dark">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,165,116,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,116,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-light/8 blur-[100px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
        />

        {/* Decorative elements */}
        <div className="absolute left-10 top-1/3 h-px w-32 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute bottom-1/3 right-10 h-px w-32 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute left-1/3 top-10 h-32 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-10 right-1/3 h-32 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      </div>

      <div className="relative z-10 px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium tracking-elegant text-accent-light">COMING SOON</span>
        </div>

        {/* Main content */}
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-heading-on-dark md:text-8xl">
          <span className="inline-block animate-pulse-slow">4</span>
          <span className="relative mx-2 inline-block">
            <span className="text-gradient-gold">0</span>
            <svg className="absolute -bottom-2 left-1/2 h-8 w-8 -translate-x-1/2 text-accent/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </span>
          <span className="inline-block animate-pulse-slow" style={{ animationDelay: '0.5s' }}>4</span>
        </h1>

        <h2 className="mb-4 text-2xl font-semibold text-heading-on-dark md:text-3xl">
          This Page is Under Construction
        </h2>

        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-body-on-dark">
          We're crafting something special for you. This section of DCDH Estate is currently being built with care.
        </p>

        {/* Progress indicator */}
        <div className="mx-auto mb-10 max-w-xs">
          <div className="mb-2 flex justify-between text-xs text-muted-on-dark">
            <span>Building in progress</span>
            <span className="text-accent-light">75%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-1000"
              style={{ width: '75%' }}
            />
          </div>
        </div>

        {/* Features coming */}
        <div className="mx-auto mb-12 grid max-w-lg grid-cols-3 gap-4">
          {[
            { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Portals' },
            { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Dashboard' },
            { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Wallet' },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border-dark bg-surface-dark-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-white/5"
            >
              <div className="mb-2 flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-medium text-muted-on-dark">{item.label}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-dark px-8 py-4 text-sm font-medium text-surface-dark shadow-lg transition-all duration-300 hover:shadow-accent/25"
          >
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <a
            href="https://wa.me/919257533440?text=Hi, I wanted to check on a page that says coming soon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-8 py-4 text-sm font-medium text-whatsapp backdrop-blur-sm transition-all duration-300 hover:bg-whatsapp/20"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Ask on WhatsApp
          </a>
        </div>

        {/* Bottom text */}
        <p className="mt-12 text-xs text-subtle-on-dark">
          Meanwhile, explore our <Link href="/search" className="text-accent-light underline-offset-2 hover:underline">available properties</Link> or <Link href="/contact" className="text-accent-light underline-offset-2 hover:underline">get in touch</Link>
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg border border-accent/20" />
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-accent/40 to-transparent" />
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <div className="h-1 w-12 rounded-full bg-gradient-to-l from-accent/40 to-transparent" />
        <div className="h-8 w-8 rounded-lg border border-accent/20" />
      </div>
    </main>
  );
}
