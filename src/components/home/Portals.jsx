import Link from 'next/link';
import Image from 'next/image';

export default function Portals() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Tenant Portal */}
        <div className="mb-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2">
              <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-semibold text-red-600">Tenant Portal</span>
            </div>

            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Simple but <span className="text-gradient">Powerful</span>
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              The Tenant Portal gives every registered tenant a clear view of their journey with DCDH Estate.
            </p>

            <div className="mb-8 space-y-4">
              {[
                { title: 'Tenant Dashboard', desc: 'See all property enquiries and their status in one place.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { title: 'Referral Dashboard', desc: 'Track friends and properties you have referred.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { title: 'Tenant Wallet', desc: 'View rewards and referral earnings.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', soon: true },
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-lg">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors duration-300 group-hover:bg-red-100">
                    <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 font-bold text-gray-900">
                      {item.title}
                      {item.soon && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Coming Soon</span>
                      )}
                    </h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/tenant-portal"
              className="btn-premium inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30"
            >
              Access Tenant Portal
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-red-100 opacity-50 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full bg-red-200 opacity-40 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-red-600 p-2 shadow-2xl shadow-red-500/30">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                    alt="Tenant portal"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Portal */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-blue-100 opacity-50 blur-3xl" />
              <div className="absolute -bottom-4 -right-4 h-48 w-48 rounded-full bg-blue-200 opacity-40 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 shadow-2xl shadow-blue-500/30">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800"
                    alt="Owner portal"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-semibold text-blue-600">Owner Portal</span>
            </div>

            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Manage All Your <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Listings</span>
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              A dedicated portal for owners to manage properties, documents and enquiries with complete transparency.
            </p>

            <div className="mb-8 space-y-4">
              {[
                { title: 'Easy Onboarding', desc: 'Step-by-step owner onboarding and document upload for verification.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { title: 'Property Management', desc: 'Add, edit and manage multiple properties with photos and locations.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { title: 'Listing Status', desc: 'See status: Active, Pending Approval, Rejected.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                { title: 'Performance Insights', desc: 'Insights on property performance and enquiries.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100">
                    <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/owner-portal"
              className="btn-premium inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30"
            >
              Access Owner Portal
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
