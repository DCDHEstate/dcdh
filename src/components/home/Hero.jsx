"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const propertyTypes = [
  "Dream Home",
  "Luxury Villa",
  "Modern Apartment",
  "Office Space",
];

export default function Hero() {
  const [currentType, setCurrentType] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentType((prev) => (prev + 1) % propertyTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-surface-dark pb-24">
      {/* Split Layout - Image on Right */}
      <div className="absolute inset-0 grid lg:grid-cols-2">
        {/* Left side - Dark gradient */}
        <div className="relative bg-surface-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-primary/20" />
          {/* Accent orbs */}
          <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-accent-dark/10 blur-[100px]" />
        </div>

        {/* Right side - Image with mask */}
        <div className="relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000"
            alt="Luxury Property"
            fill
            className="object-cover"
            priority
          />
          {/* Diagonal mask overlay */}
          <div
            className="absolute inset-0 bg-surface-dark"
            style={{
              clipPath: "polygon(0 0, 25% 0, 0 100%, 0 100%)",
            }}
          />
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/80 via-surface-dark/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/60 via-transparent to-surface-dark/30" />
        </div>
      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000"
          alt="Luxury Property"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark via-surface-dark/90 to-surface-dark/70" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex min-h-screen flex-col justify-center py-24 lg:py-32">
          <div
            className={`max-w-2xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Eyebrow with animated border */}
            <div className="mb-10 inline-block">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-accent via-accent-light to-accent opacity-20 blur-sm animate-pulse-slow" />
                <div className="relative flex items-center gap-3 rounded-lg border border-accent/30 bg-surface-dark/80 px-4 py-2 backdrop-blur-sm">
                  <span className="flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-accent-light">
                    ZERO BROKERAGE IN JAIPUR
                  </span>
                </div>
              </div>
            </div>

            {/* Main Headline - Large and Bold */}
            <h1 className="mb-8">
              <span
                className="block text-4xl font-light tracking-tight text-white/60 sm:text-5xl lg:text-6xl"
                style={{
                  animation: isVisible ? "fadeInUp 0.6s ease forwards" : "none",
                  animationDelay: "0.1s",
                  opacity: 0,
                }}
              >
                Find Your
              </span>
              <span className="relative mt-2 block">
                <span
                  key={currentType}
                  className="block text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                  style={{ animation: "fadeInUp 0.5s ease" }}
                >
                  <span className="text-gradient-gold">
                    {propertyTypes[currentType]}
                  </span>
                </span>
                {/* Animated underline */}
                <span className="absolute -bottom-4 left-0 h-1.5 rounded-full bg-gradient-to-r from-accent via-accent-light to-accent/30">
                  <span
                    className="block h-full w-full rounded-full bg-gradient-to-r from-accent via-accent-light to-accent/30"
                    style={{
                      animation: "expandWidth 0.6s ease forwards",
                      width: "200px",
                    }}
                  />
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="mb-10 max-w-md text-lg leading-relaxed text-white/70"
              style={{
                animation: isVisible ? "fadeInUp 0.6s ease forwards" : "none",
                animationDelay: "0.3s",
                opacity: 0,
              }}
            >
              100% verified properties with complete transparency. From
              discovery to handover, we handle everything.
            </p>

            {/* CTA Buttons - Stacked on mobile, inline on desktop */}
            <div
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
              style={{
                animation: isVisible ? "fadeInUp 0.6s ease forwards" : "none",
                animationDelay: "0.5s",
                opacity: 0,
              }}
            >
              <Link
                href="/search"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-surface-dark transition-all duration-300 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
              >
                <span className="relative z-10">Explore Properties</span>
                <svg
                  className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </Link>

              <a
                href="https://wa.me/919257533440"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-xl border-2 border-whatsapp/40 bg-whatsapp/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-whatsapp hover:bg-whatsapp/20 hover:shadow-lg hover:shadow-whatsapp/20"
              >
                <svg
                  className="h-5 w-5 text-whatsapp"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with Expert
              </a>
            </div>

            {/* Stats Row - Horizontal cards */}
            {/* <div
              className="mt-16 grid grid-cols-3 gap-4"
              style={{ animation: isVisible ? 'fadeInUp 0.6s ease forwards' : 'none', animationDelay: '0.7s', opacity: 0 }}
            >
              {[
                { value: "1200+", label: "Properties", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                { value: "500+", label: "Happy Families", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                { value: "25+", label: "Localities", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-white/10"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-white lg:text-3xl">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      {/* Floating badge - Desktop only */}
      <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block xl:right-16">
        <div className="flex flex-col gap-4">
          {["Verified", "Transparent", "Zero Fee"].map((text, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-white/10"
              style={{
                animation: isVisible ? "fadeInUp 0.6s ease forwards" : "none",
                animationDelay: `${0.8 + i * 0.1}s`,
                opacity: 0,
              }}
            >
              <svg
                className="h-4 w-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-white/80">{text}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
