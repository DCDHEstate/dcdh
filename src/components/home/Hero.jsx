"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const stats = [
  { value: "1200+", label: "Properties" },
  { value: "500+", label: "Happy Families" },
  { value: "25+", label: "Localities" },
];

const propertyTypes = [
  "Dream Home",
  "Luxury Villa",
  "Modern Apartment",
  "Office Space",
];

export default function Hero() {
  const [currentType, setCurrentType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentType((prev) => (prev + 1) % propertyTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-gray-950"
      style={{ minHeight: "60vh" }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000"
          alt="Luxury Property"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/50" />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-red-500/10 blur-[120px]" />
        <div
          className="absolute -left-20 bottom-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-red-600/10 blur-[100px]"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center pb-12 pt-28 text-center lg:pb-16 lg:pt-32">
          {/* Main Content */}
          <div className="max-w-4xl">
            {/* Trust Badge */}
            {/* <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5">
                <svg
                  className="h-3 w-3 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-amber-400">
                  4.9
                </span>
              </div>
            </div> */}

            {/* Headline with Animated Text */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Find Your Dream
              <br />
              <span className="relative ml-3 inline-block">
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  {propertyTypes[currentType]}
                </span>
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-red-500 to-orange-500 opacity-50 blur-sm" />
              </span>
              <br />
              {/* <span className="text-gray-400">in Jaipur</span> */}
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-gray-400 lg:text-lg">
              Zero brokerage. 100% verified properties. From property search to
              final handover — we've got you covered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/search"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-red-500/25 transition-all duration-500 hover:shadow-red-500/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Properties
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>

              <a
                href="https://wa.me/918306034440"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10"
              >
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with Expert
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
