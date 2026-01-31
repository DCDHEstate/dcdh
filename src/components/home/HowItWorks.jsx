'use client';

import { useState } from 'react';

const content = {
  tenants: [
    { step: 1, title: 'Create account with WhatsApp OTP', desc: 'Login using your mobile number and secure WhatsApp OTP - no passwords needed.', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { step: 2, title: 'Search, shortlist and enquire', desc: 'Use filters and maps to explore properties, then raise enquiries directly.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { step: 3, title: 'Track in your Dashboard', desc: 'View enquiries, responses, and referral rewards from a single dashboard.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  ],
  owners: [
    { step: 1, title: 'Onboard and verify your profile', desc: 'Complete onboarding with basic details and upload verification documents.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { step: 2, title: 'Post properties with details', desc: 'Add property type, price, amenities and exact location using Google Maps.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { step: 3, title: 'Manage from Owner Portal', desc: 'See listing status, edit details and respond to tenant leads quickly.', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
  ],
  partners: [
    { step: 1, title: 'Refer a Friend (Tenant)', desc: "Enter your friend's WhatsApp number and send them an instant login link.", icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
    { step: 2, title: 'Refer a Property', desc: 'Share property details, photos/videos, owner contact and location.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { step: 3, title: 'Earn from successful deals', desc: 'Track referral performance and potential rewards in your dashboard.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ],
};

const tabs = [
  { id: 'tenants', label: 'For Tenants', color: 'red' },
  { id: 'owners', label: 'For Owners', color: 'blue' },
  { id: 'partners', label: 'For Partners', color: 'amber' },
];

export default function HowItWorks() {
  const [tab, setTab] = useState('tenants');

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-600">Simple & Transparent</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            How <span className="text-gradient">DCDH Estate</span> Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Whether you're searching for a home, listing your property, or referring friends - we've made it simple.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-100">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-red-200 via-red-300 to-red-200 md:block" />

            <div className="space-y-8">
              {content[tab].map((item, i) => (
                <div key={item.step} className="relative flex gap-6 md:gap-8">
                  {/* Step Number */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-2xl font-bold text-white shadow-xl shadow-red-500/30">
                    {item.step}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:border-red-100 hover:shadow-xl md:p-8">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                        <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="https://wa.me/918306034440"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
