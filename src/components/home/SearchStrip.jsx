'use client';

import { useState } from 'react';

export default function SearchStrip() {
  const [searchType, setSearchType] = useState('rent');

  return (
    <section className="relative z-10 -mt-2 pb-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="reveal-scale relative overflow-hidden rounded-2xl border border-border-soft bg-surface-white p-8 shadow-premium md:p-10">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent rounded-full" />

          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-full bg-surface-subtle p-1">
              {[
                { id: 'rent', label: 'Rent' },
                { id: 'buy', label: 'Buy' },
                { id: 'commercial', label: 'Commercial' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSearchType(tab.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    searchType === tab.id
                      ? 'bg-primary text-white shadow-sm ring-2 ring-accent/20 ring-offset-2 ring-offset-surface-white'
                      : 'text-muted hover:text-body'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Fields */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">CITY</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle">
                  <option>Jaipur</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">LOCALITY</label>
              <input
                type="text"
                placeholder="e.g. Malviya Nagar"
                className="w-full rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">PROPERTY TYPE</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle">
                  <option>All Types</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>House</option>
                  <option>Office</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">BUDGET</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle">
                  <option>Any Budget</option>
                  <option>5K - 10K</option>
                  <option>10K - 20K</option>
                  <option>20K - 50K</option>
                  <option>50K+</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="flex items-end">
              <button className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-premium transition-all duration-300 hover:bg-primary-hover">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-border-light pt-6">
            <span className="text-xs font-medium text-subtle">Popular:</span>
            {['2 BHK', '3 BHK', 'Villa', 'Furnished', 'Near Metro'].map(tag => (
              <button
                key={tag}
                className="rounded-full border border-border bg-surface-white px-4 py-1.5 text-xs font-medium text-muted transition-all duration-300 hover:border-accent/30 hover:bg-accent-soft/30 hover:text-body"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
