import Image from "next/image";

const stats = [
  { n: "200+", l: "Properties Served", d: "Across Jaipur" },
  { n: "50+", l: "Happy Clients", d: "Families & investors" },
  { n: "20+", l: "Localities", d: "In Jaipur" },
  { n: "5+", l: "Years Experience", d: "On-ground expertise" },
];

const points = [
  {
    title: "Verified Listings",
    desc: "Every property goes through our verification process",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Zero Brokerage",
    desc: "Direct owner-tenant connections with no hidden fees",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Local Expertise",
    desc: "Deep knowledge of Jaipur real estate market",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
  {
    title: "Tech-Enabled",
    desc: "Modern platform with WhatsApp-first experience",
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
];

export default function TrustMetrics() {
  return (
    <section className="relative overflow-hidden section-premium texture-grain">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
          alt="Buildings"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-surface-dark/93" />
        {/* Warm accent glow at top */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent-dark/8 blur-[200px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-medium tracking-elegant text-accent/70">
            WHY CHOOSE US
          </p>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-heading-on-dark md:text-5xl">
            Why Trust{" "}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              DCDH Estate
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-body-on-dark">
            Combining local market knowledge with a technology-first approach to
            make real estate accessible and transparent.
          </p>
          <div className="mx-auto mt-6 accent-line opacity-60" />
        </div>

        {/* Stats Grid */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border-dark bg-surface-dark-card p-8 text-center backdrop-blur-sm transition-all duration-400 hover:border-accent/20 hover:bg-white/8 reveal-stagger"
              style={{ "--stagger": `${i * 100}ms` }}
            >
              <div className="mb-2 text-4xl font-semibold md:text-5xl">
                <span className="text-gradient-gold">{s.n}</span>
              </div>
              <div className="text-sm font-medium text-white/80">{s.l}</div>
              <div className="text-xs text-muted-on-dark">{s.d}</div>
            </div>
          ))}
        </div>

        {/* Trust Points */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 rounded-2xl border border-border-dark bg-surface-dark-card p-6 backdrop-blur-sm transition-all duration-400 hover:border-accent/20 hover:bg-white/8 reveal-stagger"
              style={{ "--stagger": `${i * 100}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 transition-colors duration-300 group-hover:bg-accent/25">
                <svg
                  className="h-5 w-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={p.icon}
                  />
                </svg>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-heading-on-dark">
                  {p.title}
                </h4>
                <p className="text-xs leading-relaxed text-body-on-dark">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="https://wa.me/919257533440"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex items-center gap-3 rounded-full bg-surface-white px-10 py-4 text-sm font-medium text-heading shadow-premium transition-all duration-300 hover:bg-surface-subtle"
          >
            <svg
              className="h-5 w-5 text-whatsapp-dark"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start Your Property Journey
          </a>
        </div>
      </div>
    </section>
  );
}
