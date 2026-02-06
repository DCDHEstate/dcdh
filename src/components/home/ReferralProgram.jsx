import Link from 'next/link';

export default function ReferralProgram() {
  return (
    <section className="relative overflow-hidden bg-surface-white section-premium texture-grain">
      {/* Warm glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-medium tracking-elegant text-accent">REFERRAL PROGRAM</p>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-heading md:text-5xl">
            Refer & <span className="text-gradient">Earn</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted">
            Help someone find a better home or help an owner list their property — and unlock rewards.
          </p>
          <div className="mx-auto mt-6 accent-line" />
        </div>

        {/* Referral Cards */}
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Refer a Friend */}
          <div
            className="card-hover glow-accent group rounded-2xl border border-border-light bg-surface-white p-8 transition-all duration-500 reveal-stagger"
            style={{ '--stagger': '0ms' }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-premium">
              <svg className="h-7 w-7 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>

            <h3 className="mb-3 text-xl font-semibold text-heading">Refer a Friend</h3>

            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-muted">Submit your friend&apos;s WhatsApp number and send them a login link.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-muted">Earn rewards when your friend closes deals.</span>
              </li>
            </ul>

            <Link
              href="/referral?type=friend"
              className="group/link inline-flex items-center gap-2 text-sm font-medium text-body transition-colors duration-300 hover:text-accent-dark"
            >
              Refer a Friend
              <svg className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Refer a Property */}
          <div
            className="card-hover glow-accent group rounded-2xl border border-border-light bg-surface-white p-8 transition-all duration-500 reveal-stagger"
            style={{ '--stagger': '150ms' }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-dark to-accent shadow-premium">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h3 className="mb-3 text-xl font-semibold text-heading">Refer a Property</h3>

            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-muted">Share property details, photos, owner contact and location.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-muted">Get credit when the property is onboarded.</span>
              </li>
            </ul>

            <Link
              href="/referral?type=property"
              className="group/link inline-flex items-center gap-2 text-sm font-medium text-body transition-colors duration-300 hover:text-accent-dark"
            >
              Refer a Property
              <svg className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mx-auto mt-16 max-w-4xl reveal-scale">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-10 py-14 text-center md:px-16 shadow-premium border border-accent-dark/20 texture-grain">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent-dark/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent-dark/8 blur-3xl" />
            {/* Shimmer sweep */}
            <div className="absolute inset-0 shimmer opacity-30" />

            <div className="relative">
              <h3 className="mb-3 text-2xl font-semibold text-heading-on-dark md:text-3xl">Start Earning Today</h3>
              <p className="mb-8 text-body-on-dark">
                Track your referral performance and potential rewards in your dashboard.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/referral"
                  className="btn-premium rounded-full bg-surface-white px-8 py-3.5 text-sm font-medium text-heading shadow-soft transition-all duration-300 hover:shadow-elevated"
                >
                  Join Referral Program
                </Link>
                <a
                  href="https://wa.me/918306034440?text=Hi, I want to know more about the referral program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium flex items-center gap-2 rounded-full border border-border-dark-hover bg-surface-dark-card px-8 py-3.5 text-sm font-medium text-heading-on-dark backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  <svg className="h-4 w-4 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
