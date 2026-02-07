"use client";

import Link from "next/link";

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. Stay tuned!",
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-dark">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,116,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,165,116,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        {/* Logo */}
        {/* <Link href="/" className="mb-16 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary shadow-lg">
            <span className="text-xl font-bold text-accent-light">D</span>
          </div>
          <div>
            <span className="text-xl font-semibold text-heading-on-dark">DCDH Estate</span>
            <div className="text-[10px] font-medium tracking-elegant text-muted-on-dark">PREMIUM PROPERTIES</div>
          </div>
        </Link> */}

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-5 py-2.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-sm font-medium tracking-wide text-accent-light">
            Coming Soon
          </span>
        </div>

        {/* Main heading */}
        <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-heading-on-dark md:text-5xl lg:text-6xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>

        <p className="mb-12 max-w-lg text-center text-base leading-relaxed text-body-on-dark">
          {description}
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-dark px-8 py-4 text-sm font-semibold text-surface-dark transition-all hover:shadow-lg hover:shadow-accent/25"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <a
            href="https://wa.me/919257533440"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-8 py-4 text-sm font-medium text-whatsapp backdrop-blur-sm transition-all hover:bg-whatsapp/20"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
