import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';

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
            Handpicked projects. Explore each one and download the brochure.
          </p>
          <div className="mx-auto mt-6 accent-line" />
        </div>

        {/* Property Grid */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="card-hover glow-accent group block overflow-hidden rounded-2xl glass-card reveal-stagger"
              style={{ '--stagger': `${i * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={p.hero.src}
                  alt={p.hero.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 shimmer" />

                {/* Tags */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="glass-badge-dark rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-white">
                    {p.card.type}
                  </span>
                  <span className="flex items-center gap-1 rounded-full glass-badge px-3 py-1 text-[11px] font-medium tracking-wide text-accent-dark">
                    Featured
                  </span>
                </div>

                {/* Highlight */}
                <div className="absolute bottom-4 left-4">
                  <span className="glass-badge-dark rounded-full px-4 py-1.5 text-sm font-semibold text-accent-light">{p.card.highlight}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-heading transition-colors duration-300 group-hover:text-body">
                  {p.name}
                </h3>

                <p className="mb-4 flex items-center gap-1.5 text-sm text-subtle">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {p.eyebrow}
                </p>

                <p className="mb-5 border-t border-border-light pt-4 text-sm leading-relaxed text-muted">
                  {p.tagline}
                </p>

                {/* CTA */}
                <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-all duration-300 group-hover:bg-primary-hover group-hover:shadow-soft">
                  View project &amp; brochure
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
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
