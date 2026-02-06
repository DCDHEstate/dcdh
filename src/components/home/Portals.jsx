import Link from 'next/link';
import Image from 'next/image';

export default function Portals() {
  return (
    <section className="relative overflow-hidden bg-surface section-premium">
      {/* Warm glow */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/3 blur-[200px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Tenant Portal */}
        <div className="mb-32 grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1 reveal-left">
            <p className="mb-4 text-xs font-medium tracking-elegant text-accent">TENANT PORTAL</p>

            <h2 className="mb-5 text-4xl font-semibold tracking-tight text-heading md:text-5xl">
              Simple but <span className="text-gradient">Powerful</span>
            </h2>
            <div className="mt-4 mb-6 accent-line" />
            <p className="mb-10 text-base leading-relaxed text-muted">
              The Tenant Portal gives every registered tenant a clear view of their journey with DCDH Estate.
            </p>

            <div className="mb-10 space-y-4">
              {[
                { title: 'Tenant Dashboard', desc: 'See all property enquiries and their status in one place.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { title: 'Referral Dashboard', desc: 'Track friends and properties you have referred.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { title: 'Tenant Wallet', desc: 'View rewards and referral earnings.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', soon: true },
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4 rounded-xl glass-card p-5 border-gradient-hover transition-all duration-300 glass-hover">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle transition-colors duration-300 group-hover:bg-accent-soft">
                    <svg className="h-5 w-5 text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-heading">
                      {item.title}
                      {item.soon && (
                        <span className="animate-pulse rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-accent-muted">Coming Soon</span>
                      )}
                    </h4>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/tenant-portal"
              className="group btn-premium inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary-hover"
            >
              Access Tenant Portal
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="order-1 lg:order-2 reveal-right">
            <div className="group relative overflow-hidden rounded-2xl shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                alt="Tenant portal"
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              <div className="absolute bottom-4 left-4 glass-dark rounded-full px-4 py-2">
                <span className="text-xs font-medium text-accent-light tracking-elegant">TENANT PORTAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Portal */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="reveal-left">
            <div className="group relative overflow-hidden rounded-2xl shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800"
                alt="Owner portal"
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              <div className="absolute bottom-4 left-4 glass-dark rounded-full px-4 py-2">
                <span className="text-xs font-medium text-accent-light tracking-elegant">OWNER PORTAL</span>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <p className="mb-4 text-xs font-medium tracking-elegant text-accent">OWNER PORTAL</p>

            <h2 className="mb-5 text-4xl font-semibold tracking-tight text-heading md:text-5xl">
              Manage All Your <span className="text-gradient">Listings</span>
            </h2>
            <div className="mt-4 mb-6 accent-line" />
            <p className="mb-10 text-base leading-relaxed text-muted">
              A dedicated portal for owners to manage properties, documents and enquiries with complete transparency.
            </p>

            <div className="mb-10 space-y-4">
              {[
                { title: 'Easy Onboarding', desc: 'Step-by-step owner onboarding and document upload for verification.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { title: 'Property Management', desc: 'Add, edit and manage multiple properties with photos and locations.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { title: 'Listing Status', desc: 'See status: Active, Pending Approval, Rejected.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                { title: 'Performance Insights', desc: 'Insights on property performance and enquiries.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4 rounded-xl glass-card p-5 border-gradient-hover transition-all duration-300 glass-hover">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle transition-colors duration-300 group-hover:bg-accent-soft">
                    <svg className="h-5 w-5 text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-heading">{item.title}</h4>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/owner-portal"
              className="group btn-premium inline-flex items-center gap-3 rounded-full border border-border bg-surface-white px-8 py-3.5 text-sm font-medium text-body shadow-soft transition-all duration-300 hover:border-accent/30 hover:shadow-premium"
            >
              Access Owner Portal
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
