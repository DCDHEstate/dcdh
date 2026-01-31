const services = [
  { title: 'Architects', desc: 'Residential & commercial projects', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'red' },
  { title: 'Interior Designers', desc: 'Home and office design', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', color: 'purple' },
  { title: 'Book a PG', desc: 'Hourly, weekly, monthly', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', color: 'blue' },
  { title: 'Farmhouses & Resorts', desc: 'Daily, weekly bookings', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'green' },
  { title: 'Co-working Spaces', desc: 'Flexible plans', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'amber' },
  { title: 'More Services', desc: 'Coming soon', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'gray' },
];

const colors = {
  red: { bg: 'bg-red-50', text: 'text-red-500', hover: 'group-hover:bg-red-500 group-hover:text-white', border: 'hover:border-red-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-500', hover: 'group-hover:bg-purple-500 group-hover:text-white', border: 'hover:border-purple-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-500', hover: 'group-hover:bg-blue-500 group-hover:text-white', border: 'hover:border-blue-200' },
  green: { bg: 'bg-green-50', text: 'text-green-500', hover: 'group-hover:bg-green-500 group-hover:text-white', border: 'hover:border-green-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-500', hover: 'group-hover:bg-amber-500 group-hover:text-white', border: 'hover:border-amber-200' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-500', hover: 'group-hover:bg-gray-500 group-hover:text-white', border: 'hover:border-gray-300' },
};

export default function UpcomingFeatures() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2">
            <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-purple-600">Coming Soon</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Upcoming <span className="text-gradient">Services</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            DCDH Estate is evolving into a full ecosystem for spaces and services powered by WhatsApp automation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className={`group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl ${colors[s.color].border}`}
            >
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${colors[s.color].bg} ${colors[s.color].text} ${colors[s.color].hover}`}>
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </div>
              <h3 className="mb-1 font-bold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 md:p-12">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 h-full w-full opacity-10">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-8 md:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-xl backdrop-blur-sm">
              <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">WhatsApp-First Experience</h3>
              <p className="text-lg text-white/90">
                Every request is instantly sent to our WhatsApp automation system. No apps to download, no forms to fill - just message and go!
              </p>
            </div>

            <a
              href="https://wa.me/918306034440?text=Hi, I want to know more about upcoming services"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-white px-8 py-4 font-semibold text-green-600 shadow-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-2xl"
            >
              Get Notified
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
