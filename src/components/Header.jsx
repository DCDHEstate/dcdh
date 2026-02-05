'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/search' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-surface-white/95 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.05)]' : 'bg-gradient-to-b from-black/40 to-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-light to-primary shadow-sm">
              <span className="text-lg font-semibold tracking-tight text-accent-light">D</span>
            </div>
          </div>
          <div>
            <div className={`text-lg font-semibold tracking-tight transition-colors duration-700 ${isScrolled ? 'text-heading' : 'text-white'}`}>DCDH Estate</div>
            <div className={`text-[10px] font-medium tracking-elegant transition-colors duration-700 ${isScrolled ? 'text-subtle' : 'text-faint'}`}>PREMIUM PROPERTIES</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map(l => (
            <Link
              key={l.name}
              href={l.href}
              className={`rounded-full px-5 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${isScrolled ? 'text-muted hover:bg-surface-subtle hover:text-heading' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/owner-portal"
            className={`text-[13px] font-medium tracking-wide transition-all duration-300 ${isScrolled ? 'text-muted hover:text-heading' : 'text-white/80 hover:text-white'}`}
          >
            List Property
          </Link>
          <Link
            href="/tenant-portal"
            className="btn-premium flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-light to-primary px-6 py-2.5 text-[13px] font-medium tracking-wide text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            Get Started
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className={`rounded-lg p-2.5 lg:hidden ${isScrolled ? 'hover:bg-surface-subtle' : 'hover:bg-white/10'}`}>
          <svg className={`h-5 w-5 transition-colors duration-300 ${isScrolled ? 'text-body' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-20 mx-4 rounded-2xl border border-border-light bg-surface-white/98 p-5 shadow-elevated backdrop-blur-2xl lg:hidden">
          {links.map(l => (
            <Link key={l.name} href={l.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-[15px] font-medium text-body transition hover:bg-surface-subtle hover:text-heading">{l.name}</Link>
          ))}
          <div className="mt-4 border-t border-border-light pt-4">
            <Link href="/tenant-portal" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
