'use client';

import { useState } from 'react';

export default function SearchStrip() {
  const [searchType, setSearchType] = useState('rent');

  return (
    <section className="relative z-10 -mt-8 pb-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 md:p-10">
          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-2xl bg-gray-100 p-1.5">
              {[
                { id: 'rent', label: 'Rent', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { id: 'buy', label: 'Buy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { id: 'commercial', label: 'Commercial', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSearchType(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    searchType === tab.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Fields */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="group">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">City</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-10 text-gray-700 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100">
                  <option>Jaipur</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Locality</label>
              <input
                type="text"
                placeholder="e.g. Malviya Nagar"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div className="group">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Property Type</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-10 text-gray-700 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100">
                  <option>All Types</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>House</option>
                  <option>Office</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Budget</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-10 text-gray-700 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100">
                  <option>Any Budget</option>
                  <option>5K - 10K</option>
                  <option>10K - 20K</option>
                  <option>20K - 50K</option>
                  <option>50K+</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="flex items-end">
              <button className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 pt-6">
            <span className="text-sm font-medium text-gray-400">Popular:</span>
            {['2 BHK', '3 BHK', 'Villa', 'Furnished', 'Near Metro'].map(tag => (
              <button
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
