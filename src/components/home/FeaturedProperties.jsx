import Image from 'next/image';
import Link from 'next/link';

const properties = [
  { id: 1, title: '3 BHK Luxury Apartment', location: 'Malviya Nagar, Jaipur', price: '25,000/mo', area: '1,450 sq.ft', beds: 3, baths: 2, type: 'Rent', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800', featured: true },
  { id: 2, title: '2 BHK Modern Flat', location: 'Vaishali Nagar, Jaipur', price: '15,000/mo', area: '1,100 sq.ft', beds: 2, baths: 2, type: 'Rent', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800' },
  { id: 3, title: 'Commercial Office Space', location: 'C-Scheme, Jaipur', price: '45,000/mo', area: '2,000 sq.ft', beds: null, baths: 2, type: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800' },
  { id: 4, title: '4 BHK Independent Villa', location: 'Mansarovar, Jaipur', price: '1.2 Cr', area: '2,800 sq.ft', beds: 4, baths: 4, type: 'Buy', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800', featured: true },
  { id: 5, title: '1 BHK Studio Apartment', location: 'Jagatpura, Jaipur', price: '8,000/mo', area: '550 sq.ft', beds: 1, baths: 1, type: 'Rent', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800' },
  { id: 6, title: 'Retail Shop Space', location: 'Raja Park, Jaipur', price: '35,000/mo', area: '800 sq.ft', beds: null, baths: 1, type: 'Commercial', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800' },
];

export default function FeaturedProperties() {
  return (
    <section className="relative overflow-hidden bg-surface section-premium texture-dots">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-medium tracking-elegant text-accent">CURATED SELECTION</p>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-heading md:text-5xl">
            Featured <span className="text-gradient">Properties</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted">
            Each listing is verified and handpicked. Enquire instantly via WhatsApp.
          </p>
          <div className="mx-auto mt-6 accent-line" />
        </div>

        {/* Property Grid */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <div
              key={p.id}
              className="card-hover glow-accent group overflow-hidden rounded-2xl glass-card reveal-stagger"
              style={{ '--stagger': `${i * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 shimmer" />

                {/* Tags */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className={`glass-badge-dark rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-white`}>
                    {p.type}
                  </span>
                  {p.featured && (
                    <span className="flex items-center gap-1 rounded-full glass-badge px-3 py-1 text-[11px] font-medium tracking-wide text-accent-dark animate-pulse-glow">
                      Featured
                    </span>
                  )}
                </div>

                {/* Verified */}
                <div className="absolute right-4 top-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full glass-badge">
                    <svg className="h-4 w-4 text-verified" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 left-4">
                  <span className="glass-badge-dark rounded-full px-4 py-1.5 text-lg font-semibold text-accent-light">{p.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <Link href={`/property/${p.id}`} className="group/link mb-2 block">
                  <h3 className="text-lg font-semibold text-heading transition-colors duration-300 group-hover/link:text-body">
                    {p.title}
                  </h3>
                </Link>

                <p className="mb-4 flex items-center gap-1.5 text-sm text-subtle">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {p.location}
                </p>

                {/* Details */}
                <div className="mb-5 flex items-center gap-4 border-t border-border-light pt-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {p.area}
                  </span>
                  {p.beds && (
                    <span className="flex items-center gap-1.5">
                      {p.beds} BHK
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    {p.baths} Bath
                  </span>
                </div>

                {/* CTA */}
                <a
                  href={`https://wa.me/919257533440?text=Hi, I'm interested in ${p.title} at ${p.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-primary-hover group-hover:shadow-soft"
                >
                  <svg className="h-4 w-4 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-16 text-center">
          <Link
            href="/search"
            className="group btn-premium inline-flex items-center gap-3 rounded-full border border-border bg-surface-white px-10 py-4 text-sm font-medium text-body shadow-soft transition-all duration-500 hover:border-accent/30 hover:shadow-premium"
          >
            View All Properties
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
