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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5' : 'bg-gradient-to-b from-black/50 to-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
              <span className="text-xl font-bold text-white">D</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div>
            <div className={`text-xl font-bold tracking-tight transition-colors duration-500 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>DCDH Estate</div>
            <div className={`text-[11px] font-medium tracking-wider transition-colors duration-500 ${isScrolled ? 'text-gray-400' : 'text-gray-300'}`}>PREMIUM PROPERTIES</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(l => (
            <Link
              key={l.name}
              href={l.href}
              className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${isScrolled ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/owner-portal"
            className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
          >
            List Property
          </Link>
          <Link
            href="/tenant-portal"
            className="btn-premium flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-[13px] font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className={`rounded-xl p-2.5 lg:hidden ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}>
          <svg className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-20 mx-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl lg:hidden">
          {links.map(l => (
            <Link key={l.name} href={l.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-gray-600 transition hover:bg-gray-50">{l.name}</Link>
          ))}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <Link href="/tenant-portal" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
