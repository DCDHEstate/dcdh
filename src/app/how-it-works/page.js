'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Custom hook for scroll reveal
function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = ref.current?.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger'
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

const tenantSteps = [
  {
    step: 1,
    title: 'Create Your Account',
    desc: 'Sign up using your mobile number. Receive a secure WhatsApp OTP for instant, password-free login.',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    step: 2,
    title: 'Search & Shortlist',
    desc: 'Use our advanced filters – locality, budget, property type – to discover verified properties. Shortlist your favorites and explore them on Google Maps.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    step: 3,
    title: 'Raise Enquiries',
    desc: 'Found something you like? Raise an enquiry directly. Your request goes straight to the owner and our team for quick follow-up.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    step: 4,
    title: 'Schedule Visits',
    desc: 'Coordinate property visits at your convenience. Our team helps you schedule and accompanies you if needed.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    step: 5,
    title: 'Move In',
    desc: 'Complete the rental agreement, pay the deposit, and move into your new home. We assist with documentation and handover.',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
];

const ownerSteps = [
  {
    step: 1,
    title: 'Complete Onboarding',
    desc: 'Register as a property owner with your basic details. Upload verification documents like ID proof and property papers.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    step: 2,
    title: 'List Your Property',
    desc: 'Add property details – type, price, amenities, and exact location using Google Maps. Upload high-quality photos and videos.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    step: 3,
    title: 'Verification & Go Live',
    desc: 'Our team reviews your listing for accuracy. Once approved, your property goes live and starts receiving enquiries.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    step: 4,
    title: 'Manage Leads',
    desc: 'Access your Owner Portal to view and respond to tenant enquiries. Track lead status and communicate directly.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    step: 5,
    title: 'Close the Deal',
    desc: 'Finalize agreements with tenants or buyers. Our team assists with documentation and smooth property handover.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
];

const referrerSteps = [
  {
    step: 1,
    title: 'Refer a Friend (Tenant)',
    desc: "Know someone looking for a property? Enter their WhatsApp number in your dashboard. They'll receive an instant login link.",
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
  },
  {
    step: 2,
    title: 'Refer a Property',
    desc: 'Know an owner who wants to list? Share the property details, photos/videos, owner contact, and location through your dashboard.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    step: 3,
    title: 'Track Your Referrals',
    desc: 'Monitor all your referrals in the Referral Dashboard. See status updates as your referrals progress through the system.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    step: 4,
    title: 'Earn Rewards',
    desc: 'When your referred friend closes a deal or a property gets onboarded, you earn rewards. Track potential earnings in your wallet.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const adminFeatures = [
  { title: 'Lead Management', desc: 'Track and manage all incoming leads from enquiries, referrals, and walk-ins.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'Property Verification', desc: 'Review and approve property listings before they go live on the platform.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'User Management', desc: 'Manage tenant, owner, and partner accounts with role-based access control.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Analytics Dashboard', desc: 'Monitor platform performance, conversion rates, and business metrics.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const tabs = [
  { id: 'tenants', label: 'For Tenants' },
  { id: 'owners', label: 'For Owners' },
  { id: 'referrers', label: 'For Partners' },
];

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('tenants');
  const containerRef = useScrollReveal();

  const getSteps = () => {
    switch (activeTab) {
      case 'tenants': return tenantSteps;
      case 'owners': return ownerSteps;
      case 'referrers': return referrerSteps;
      default: return tenantSteps;
    }
  };

  return (
    <main className="overflow-hidden" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden bg-surface-dark">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000"
            alt="How It Works"
            fill
            className="animate-ken-burns object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/95 to-surface-dark/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-surface-dark/40" />
        </div>

        {/* Animated accent orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/4 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent/20 blur-[120px]" />
          <div
            className="absolute bottom-1/4 left-1/4 h-64 w-64 animate-pulse-slow rounded-full bg-accent-light/15 blur-[100px]"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-border-dark bg-surface-dark-card px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              <span className="tracking-elegant text-xs font-medium uppercase text-body-on-dark">
                Simple & Transparent
              </span>
            </div>

            <h1 className="reveal mb-6 text-4xl font-semibold leading-tight tracking-tight text-heading-on-dark md:text-5xl lg:text-6xl">
              How <span className="text-gradient-gold">DCDH Estate</span> Works
            </h1>

            <p className="reveal mb-10 text-lg leading-relaxed text-body-on-dark md:text-xl">
              Whether you&apos;re searching for a home, listing your property, or referring friends – we&apos;ve made every step simple and transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section-premium bg-surface-white texture-grain relative">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="reveal mb-16 text-center">
            <p className="mb-4 text-xs font-medium tracking-elegant text-accent">YOUR JOURNEY</p>
            <h2 className="mb-5 text-3xl font-semibold tracking-tight text-heading md:text-4xl lg:text-5xl">
              Step by <span className="text-gradient">Step</span>
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted">
              Follow our simple process tailored to your needs.
            </p>
            <div className="mx-auto mt-6 accent-line" />
          </div>

          {/* Tabs */}
          <div className="reveal mb-16 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-surface-white p-1.5 shadow-soft">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-muted hover:text-heading'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Steps Grid */}
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-accent/30 via-accent/20 to-accent/10 lg:left-1/2 lg:-ml-px lg:block" />

              <div className="space-y-8">
                {getSteps().map((item, i) => (
                  <div
                    key={item.step}
                    className={`reveal-stagger relative flex flex-col gap-6 lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    style={{ '--stagger': `${i * 100}ms` }}
                  >
                    {/* Step Number - Center */}
                    <div className="absolute left-8 top-0 z-10 hidden h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-xl font-semibold text-white shadow-premium lg:left-1/2 lg:flex">
                      {item.step}
                    </div>

                    {/* Content Card */}
                    <div className={`flex-1 ${i % 2 === 1 ? 'lg:pr-14' : 'lg:pl-14'}`}>
                      <div className="card-hover glow-accent group flex gap-5 rounded-2xl glass-card p-6 transition-all duration-300 hover:border-accent/20 lg:gap-6 lg:p-8 glass-hover">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-xl font-semibold text-white shadow-lg lg:hidden">
                          {item.step}
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-subtle transition-colors duration-300 group-hover:bg-accent-soft lg:flex">
                            <svg className="h-6 w-6 text-body transition-colors group-hover:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                            </svg>
                          </div>
                          <div>
                            <h3 className="mb-2 text-lg font-semibold text-heading lg:text-xl">{item.title}</h3>
                            <p className="text-muted leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden flex-1 lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="reveal mt-16 text-center">
            <a
              href="https://wa.me/919257533440"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 text-sm font-semibold text-white shadow-premium transition-all duration-300 hover:bg-primary-hover"
            >
              <svg className="h-5 w-5 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Start on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Behind the Scenes Section */}
      <section className="section-premium bg-surface texture-dots relative">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
              <svg className="h-4 w-4 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">Behind the Scenes</span>
            </div>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-heading lg:text-4xl">
              How We <span className="text-gradient">Ensure Quality</span>
            </h2>
            <p className="mx-auto max-w-2xl text-body">
              Our admin team works behind the scenes to verify listings, manage leads, and ensure every property journey is smooth.
            </p>
            <div className="divider-elegant mx-auto mt-6 max-w-xs" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {adminFeatures.map((feature, i) => (
              <div
                key={i}
                className="reveal-stagger card-hover glow-accent group rounded-2xl border border-border bg-surface-card p-6 shadow-soft transition-all duration-300 hover:border-accent/20"
                style={{ '--stagger': `${i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
                  <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-heading">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-surface-dark texture-grain relative">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="reveal relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-accent-dark p-1">
            <div className="relative rounded-[14px] bg-gradient-to-br from-accent to-accent-dark px-8 py-16 text-center md:px-16 md:py-20">
              {/* Background Elements */}
              <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-black/10 blur-2xl" />

              <div className="relative">
                <h2 className="mb-4 text-3xl font-semibold text-surface-dark md:text-4xl lg:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-surface-dark/80">
                  Whether you&apos;re a tenant, owner, or partner – your property journey begins here.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/search"
                    className="btn-premium rounded-full bg-surface-dark px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:bg-primary"
                  >
                    Search Properties
                  </Link>
                  <Link
                    href="/owner-portal"
                    className="rounded-full border-2 border-surface-dark/30 bg-surface-dark/10 px-8 py-4 font-semibold text-surface-dark backdrop-blur-sm transition-all duration-300 hover:bg-surface-dark/20"
                  >
                    List Your Property
                  </Link>
                  <Link
                    href="/referral"
                    className="rounded-full border-2 border-surface-dark/30 bg-surface-dark/10 px-8 py-4 font-semibold text-surface-dark backdrop-blur-sm transition-all duration-300 hover:bg-surface-dark/20"
                  >
                    Join Referral Program
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
