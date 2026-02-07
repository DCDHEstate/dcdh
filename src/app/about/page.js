"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Custom hook for scroll reveal
function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = ref.current?.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger",
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

const founders = [
  {
    name: "Dileep Kumar",
    role: "Founder & CEO",
    bio: "With 6+ years of real estate expertise in Jaipur, Dileep founded DCDH Estate to bring transparency and trust to property transactions. He leads strategy, sales operations, and ensures every client receives personalized attention.",
    image: "/images/founders/Dileep.jpg",
    linkedin: "https://www.linkedin.com/in/dileep-parmar-03a790321/",
  },
  {
    name: "Anand Purushottam",
    role: "Co-founder & COO",
    bio: "Anand brings operational excellence and creative problem-solving to DCDH Estate. He manages day-to-day operations, partner relationships, and drives process improvements to deliver a seamless experience for owners and tenants.",
    image: "/images/founders/Anand.jpeg",
    linkedin: "https://www.linkedin.com/in/creativepurus/",
  },
  {
    name: "Siddharth Rai",
    role: "Co-founder & CTO",
    bio: "A technology enthusiast with a passion for building scalable solutions, Siddharth leads the development of DCDH's digital platform. He architects the DCDH's experience and ensures our technology serves every user's needs.",
    image: "/images/founders/Siddharth.jpg",
    linkedin: "https://www.linkedin.com/in/siddrai7/",
  },
];

const stats = [
  { value: "2019", label: "Founded" },
  { value: "500+", label: "Happy Families" },
  { value: "1200+", label: "Properties Listed" },
  { value: "25+", label: "Localities Served" },
];

const values = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Trust First",
    description:
      "Every property is verified. Every deal is transparent. We build relationships, not just transactions.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Speed & Simplicity",
    description:
      "WhatsApp-first communication. No endless paperwork. Find your property in days, not months.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "People Over Profit",
    description:
      "Zero brokerage for tenants. Fair pricing for owners. We succeed when you succeed.",
  },
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    title: "Innovation",
    description:
      "Cutting-edge tech meets local expertise. We're building the future of real estate in India.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "The Beginning",
    description:
      "Started as a focused brokerage in Jaipur with a simple promise: genuine listings and honest advice.",
  },
  {
    year: "2021",
    title: "Growing Trust",
    description:
      "Helped 200+ families find their homes. Expanded to 15+ localities across Jaipur.",
  },
  {
    year: "2023",
    title: "Going Digital",
    description:
      "Launched our first digital platform. Introduced WhatsApp-based property search.",
  },
  {
    year: "2024",
    title: "Platform Launch",
    description:
      "Full-scale platform launch with Owner Portal, Tenant Portal, and Admin Dashboard.",
  },
];

export default function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState(3);
  const containerRef = useScrollReveal();

  return (
    <>
      <main className="overflow-hidden" ref={containerRef}>
        {/* Hero Section - Premium Dark */}
        <section className="relative min-h-[70vh] overflow-hidden bg-surface-dark">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000"
              alt="Skyline"
              fill
              className="animate-ken-burns object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-surface-dark via-surface-dark/95 to-surface-dark/70" />
            <div className="absolute inset-0 bg-linear-to-t from-surface-dark via-transparent to-surface-dark/40" />
          </div>

          {/* Animated accent orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-1/4 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent/20 blur-[120px]" />
            <div
              className="absolute bottom-1/4 left-1/4 h-64 w-64 animate-pulse-slow rounded-full bg-accent-light/15 blur-[100px]"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 py-32 lg:px-8">
            <div className="max-w-3xl">
              <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-border-dark bg-surface-dark-card px-4 py-2 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                </span>
                <span className="tracking-elegant text-xs font-medium uppercase text-body-on-dark">
                  About DCDH Estate
                </span>
              </div>

              <h1 className="reveal mb-6 text-4xl font-semibold leading-tight tracking-tight text-heading-on-dark sm:text-5xl lg:text-6xl">
                Transforming Real Estate
                <br />
                <span className="text-gradient-gold">One Family at a Time</span>
              </h1>

              <p className="reveal mb-10 max-w-2xl text-lg leading-relaxed text-body-on-dark">
                We're building India's most trusted, WhatsApp-first real estate
                platform. Where transparency meets technology, and every
                property journey is simplified.
              </p>

              {/* Stats inline */}
              <div className="reveal flex flex-wrap gap-8 border-t border-border-dark pt-8">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="reveal-stagger"
                    style={{ "--stagger": `${i * 100}ms` }}
                  >
                    <p className="text-3xl font-semibold text-heading-on-dark">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-on-dark">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section - Split Design */}
        <section className="section-premium relative bg-surface-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Image Side */}
              <div className="reveal-left relative">
                <div className="absolute -left-8 -top-8 h-full w-full rounded-2xl bg-linear-to-br from-accent-soft to-surface" />
                <div className="relative overflow-hidden rounded-2xl shadow-premium">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                    alt="Our Journey"
                    width={600}
                    height={500}
                    className="h-125 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface-dark/70 via-transparent to-transparent" />

                  {/* Floating Card */}
                  <div className="glass-dark absolute bottom-6 left-6 right-6 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-accent to-accent-dark shadow-lg">
                        <span className="text-2xl font-semibold text-surface-dark">
                          6+
                        </span>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-heading-on-dark">
                          Years of Trust
                        </p>
                        <p className="text-body-on-dark">
                          Serving Jaipur Families
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="reveal-right">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
                  <svg
                    className="h-4 w-4 text-accent-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">
                    Our Story
                  </span>
                </div>

                <h2 className="mb-6 text-3xl font-semibold tracking-tight text-heading lg:text-4xl">
                  From Local Expertise to
                  <span className="block text-gradient-gold">
                    Digital Innovation
                  </span>
                </h2>

                <div className="space-y-6 text-body">
                  <p className="text-lg leading-relaxed">
                    Founded in 2019, DCDH Estate started as a focused brokerage
                    serving tenants and owners in Jaipur with a simple promise:{" "}
                    <strong className="text-heading">
                      genuine listings and honest advice.
                    </strong>
                  </p>
                  <p className="leading-relaxed">
                    Over the years, our team has helped hundreds of families and
                    investors find the right homes and properties, learning
                    exactly where traditional real estate breaks down.
                  </p>
                  <p className="leading-relaxed">
                    The new DCDH Real Estate Platform is the next step —
                    converting those learnings into a scalable digital product
                    for India, powered by modern technology and WhatsApp-first
                    communication.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/search"
                    className="btn-premium inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-elevated transition-all hover:bg-primary-hover"
                  >
                    Explore Properties
                    <svg
                      className="h-4 w-4"
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
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface-white px-8 py-4 font-semibold text-heading transition-all hover:border-accent hover:bg-surface"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision - Premium Cards */}
        <section className="section-premium bg-surface-dark texture-grain relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-dark bg-surface-dark-card px-4 py-2">
                <svg
                  className="h-4 w-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="tracking-elegant text-xs font-medium uppercase text-body-on-dark">
                  Our Purpose
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-heading-on-dark lg:text-4xl">
                Mission & Vision
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Mission Card */}
              <div className="reveal-left group relative overflow-hidden rounded-2xl bg-linear-to-br from-accent to-accent-dark p-1">
                <div className="relative h-full rounded-[14px] bg-linear-to-br from-accent to-accent-dark p-10">
                  <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-10" />
                  <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-black/10 blur-2xl" />

                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg
                        className="h-8 w-8 text-surface-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-semibold text-surface-dark">
                      Our Mission
                    </h3>
                    <p className="text-lg leading-relaxed text-surface-dark/90">
                      To democratize real estate in India by making property
                      discovery, verification and closure accessible,
                      transparent and hassle-free for every Indian family.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className="reveal-right group glass-dark relative overflow-hidden rounded-2xl p-1">
                <div className="relative h-full rounded-[14px] border border-border-dark bg-surface-dark/50 p-10">
                  <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 group-hover:translate-x-10" />

                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                      <svg
                        className="h-8 w-8 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-semibold text-heading-on-dark">
                      Our Vision
                    </h3>
                    <p className="text-lg leading-relaxed text-body-on-dark">
                      To become India's most trusted, WhatsApp-first real estate
                      platform for tenants, owners and partners — where every
                      property journey can be tracked, verified and completed
                      online.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-premium bg-surface">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
                <svg
                  className="h-4 w-4 text-accent-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">
                  What Drives Us
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-heading lg:text-4xl">
                Our Core Values
              </h2>
              <p className="mx-auto max-w-2xl text-body">
                The principles that guide every decision we make and every
                family we serve.
              </p>
              <div className="divider-elegant mx-auto mt-6 max-w-xs" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="reveal-stagger card-hover glow-accent group relative overflow-hidden rounded-2xl border border-border bg-surface-card p-8 shadow-soft"
                  style={{ "--stagger": `${i * 100}ms` }}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-linear-to-br from-accent-soft to-surface opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg">
                      <svg
                        className="h-7 w-7 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={value.icon}
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-heading">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-premium bg-linear-to-b from-surface-subtle to-surface-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
                <svg
                  className="h-4 w-4 text-accent-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">
                  Our Journey
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-heading lg:text-4xl">
                The DCDH Timeline
              </h2>
            </div>

            {/* Timeline Navigation */}
            <div className="reveal mb-12 flex justify-center">
              <div className="inline-flex rounded-full bg-surface-subtle p-1.5 shadow-soft">
                {timeline.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTimeline(i)}
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      activeTimeline === i
                        ? "bg-primary text-white shadow-lg"
                        : "text-muted hover:text-heading"
                    }`}
                  >
                    {item.year}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Content */}
            <div className="reveal-scale mx-auto max-w-2xl text-center">
              <div className="glass-warm rounded-2xl border border-border p-10 shadow-premium">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-accent to-accent-dark text-2xl font-semibold text-surface-dark shadow-lg">
                  {timeline[activeTimeline].year}
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-heading">
                  {timeline[activeTimeline].title}
                </h3>
                <p className="text-lg text-body">
                  {timeline[activeTimeline].description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="section-premium bg-surface texture-dots relative">
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
                <svg
                  className="h-4 w-4 text-accent-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">
                  The People Behind DCDH
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-heading lg:text-4xl">
                Leadership Team
              </h2>
              <p className="mx-auto max-w-2xl text-body">
                Meet the people driving DCDH Estate&apos;s mission to transform
                real estate in India.
              </p>
              <div className="divider-elegant mx-auto mt-6 max-w-xs" />
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {founders.map((founder, i) => (
                <div
                  key={i}
                  className="reveal-stagger card-hover glow-accent group overflow-hidden rounded-2xl border border-border bg-surface-card shadow-soft"
                  style={{ "--stagger": `${i * 150}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-surface-subtle">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="mb-1 text-sm font-semibold text-accent">
                      {founder.role}
                    </p>
                    <h3 className="mb-3 text-xl font-semibold text-heading">
                      {founder.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted">
                      {founder.bio}
                    </p>

                    {/* LinkedIn Link */}
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-accent"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-premium bg-surface-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal relative overflow-hidden rounded-2xl bg-surface-dark">
              {/* Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute -right-20 -top-20 h-64 w-64 animate-pulse-slow rounded-full bg-accent/20 blur-3xl" />
                <div
                  className="absolute -bottom-20 -left-20 h-64 w-64 animate-pulse-slow rounded-full bg-accent-light/15 blur-3xl"
                  style={{ animationDelay: "2s" }}
                />
                <div className="texture-dots absolute inset-0" />
              </div>

              <div className="relative px-8 py-16 text-center md:px-16 md:py-24">
                <h2 className="mb-4 text-3xl font-semibold text-heading-on-dark md:text-4xl lg:text-5xl">
                  Ready to Find Your
                  <span className="block text-gradient-gold">
                    Dream Property?
                  </span>
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-body-on-dark">
                  Join thousands of happy families who found their perfect home
                  with DCDH Estate. Zero brokerage, 100% verified properties.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/search"
                    className="btn-premium inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-surface-dark shadow-xl transition-all hover:bg-accent-light"
                  >
                    Explore Properties
                    <svg
                      className="h-5 w-5"
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
                  </Link>
                  <a
                    href="https://wa.me/919257533440"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-8 py-4 font-semibold text-whatsapp backdrop-blur-sm transition-all hover:bg-whatsapp/20"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
