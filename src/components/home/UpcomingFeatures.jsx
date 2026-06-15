"use client";

const services = [
  {
    title: "Pro Flow",
    desc: "Smart properties management",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    wa: "Hi, I want to know more about Prop Flow — Smart Property Discovery",
  },
  {
    title: "My Stay",
    desc: "Short-term stays & hotels",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    wa: "Hi, I want to know more about My Stay — Short-term Stays & Hotels",
  },
  {
    title: "Dubai Properties",
    desc: "International listings",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    wa: "Hi, I want to know more about Dubai Properties — International Listings",
  },
  {
    title: "Prop AI",
    desc: "AI-powered recommendations",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    wa: "Hi, I want to know more about Prop AI — AI-powered Property Recommendations",
  },
  {
    title: "Resorts",
    desc: "Leisure & weekend getaways",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    wa: "Hi, I want to know more about Resorts — Leisure & Weekend Getaways",
  },
  {
    title: "Co-working Space",
    desc: "Flexible workspaces",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    wa: "Hi, I want to know more about Co-working Spaces — Flexible Workspaces",
  },
  {
    title: "Book a PG",
    desc: "Hourly, weekly, monthly",
    icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
    wa: "Hi, I want to book a PG — Hourly, Weekly or Monthly",
  },
  {
    title: "Book a Library",
    desc: "Study & reading spaces",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    wa: "Hi, I want to book a Library — Study & Reading Spaces",
  },
  {
    title: "Vastu Consultant",
    desc: "Harmony in your space",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    wa: "Hi, I want to consult a Vastu Expert — Harmony in my Space",
  },
  {
    title: "Interior Designer",
    desc: "Transform your interiors",
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    wa: "Hi, I want to hire an Interior Designer — Transform my Interiors",
  },
  {
    title: "Architect",
    desc: "Residential & commercial projects",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    wa: "Hi, I want to hire an Architect — Residential & Commercial Projects",
  },
  {
    title: "Home Loan Assistant",
    desc: "Easy home financing",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    wa: "Hi, I want to know more about Home Loan Assistance — Easy Home Financing",
  },
];

export default function UpcomingFeatures() {
  return (
    <section className="relative overflow-hidden bg-surface section-premium texture-dots">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-medium tracking-elegant text-accent">
            COMING SOON
          </p>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-heading md:text-5xl">
            Upcoming <span className="text-gradient">Services</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted">
            DCDH Empire is evolving into a full ecosystem for spaces and
            services.
          </p>
          <div className="mx-auto mt-6 accent-line" />
        </div>

        {/* Services Grid */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {services.map((s, i) => (
            <a
              key={i}
              href={`https://wa.me/919257533440?text=${encodeURIComponent(s.wa)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover border-gradient-hover group cursor-pointer rounded-2xl glass-card p-5 text-center transition-all duration-400 reveal-stagger glass-hover no-underline"
              style={{ "--stagger": `${i * 60}ms` }}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-subtle text-muted transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-soft">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={s.icon}
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-xs font-semibold leading-tight text-heading">
                {s.title}
              </h3>
              <p className="text-[11px] leading-snug text-subtle">{s.desc}</p>
            </a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="relative overflow-hidden rounded-2xl glass-warm p-8 shadow-elevated md:p-12 reveal-scale texture-grain">
          <div className="relative flex flex-col items-center gap-8 md:flex-row">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary animate-pulse-glow">
              <svg
                className="h-8 w-8 text-whatsapp"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="mb-2 text-xl font-semibold text-heading md:text-2xl">
                WhatsApp-First Experience
              </h3>
              <p className="text-muted">
                Every request is instantly sent to our WhatsApp automation
                system. No apps to download, no forms to fill.
              </p>
            </div>

            <a
              href="https://wa.me/919257533440?text=Hi, I want to know more about upcoming services"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium shrink-0 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:bg-primary-hover hover:shadow-premium"
            >
              Get Notified
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
