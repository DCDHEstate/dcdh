'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = ref.current?.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger"
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

const contactMethods = [
  {
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    title: 'WhatsApp',
    description: 'Chat with us instantly',
    value: '+91 92575 33440',
    href: 'https://wa.me/919257533440',
    colorClass: 'whatsapp',
    badge: 'Fastest Response',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Phone',
    description: 'Call us directly',
    value: '+91 83060 34440',
    href: 'tel:+918306034440',
    colorClass: 'primary',
    badge: null,
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email',
    description: 'Send us an email',
    value: 'support@dcdhestate.com',
    href: 'mailto:support@dcdhestate.com',
    colorClass: 'accent',
    badge: null,
  },
];

const faqs = [
  {
    question: 'How quickly do you respond to enquiries?',
    answer: 'We aim to respond within 2 hours on WhatsApp and within 24 hours for email enquiries. For urgent matters, calling us directly is the fastest option.',
  },
  {
    question: 'Is there any brokerage fee for tenants?',
    answer: 'No! DCDH Estate operates on a zero-brokerage model for tenants. You only pay your rent and security deposit directly to the owner.',
  },
  {
    question: 'How do I list my property with DCDH?',
    answer: 'Simply fill out the contact form or message us on WhatsApp with your property details. Our team will verify and list your property within 48 hours.',
  },
  {
    question: 'What areas do you cover in Jaipur?',
    answer: 'We cover 25+ localities across Jaipur including Malviya Nagar, Vaishali Nagar, Mansarovar, C-Scheme, Raja Park, Tonk Road, and many more.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    enquiryType: 'rent',
    message: '',
  });
  const [openFaq, setOpenFaq] = useState(null);
  const containerRef = useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Hi, I'm ${formData.name}.\n\nEnquiry Type: ${formData.enquiryType}\nPhone: ${formData.phone}\n\n${formData.message}`;
    window.open(`https://wa.me/919257533440?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getColorClasses = (colorClass) => {
    const colors = {
      whatsapp: {
        bg: 'bg-whatsapp',
        bgLight: 'bg-whatsapp/10',
        text: 'text-whatsapp-dark',
        border: 'border-whatsapp/30',
        hover: 'hover:border-whatsapp/50',
        shadow: 'shadow-whatsapp/20',
      },
      primary: {
        bg: 'bg-primary',
        bgLight: 'bg-surface-subtle',
        text: 'text-heading',
        border: 'border-border',
        hover: 'hover:border-primary-muted',
        shadow: 'shadow-soft',
      },
      accent: {
        bg: 'bg-accent',
        bgLight: 'bg-accent-soft',
        text: 'text-accent-muted',
        border: 'border-accent/30',
        hover: 'hover:border-accent/50',
        shadow: 'shadow-premium',
      },
    };
    return colors[colorClass] || colors.accent;
  };

  return (
    <>
      <Header />
      <main className="overflow-hidden" ref={containerRef}>
        {/* Hero Section - Premium Dark */}
        <section className="relative min-h-[60vh] overflow-hidden bg-surface-dark">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000"
              alt="Contact"
              fill
              className="animate-ken-burns object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-surface-dark via-surface-dark/95 to-surface-dark/80" />
            <div className="absolute inset-0 bg-linear-to-t from-surface-dark via-transparent to-surface-dark/50" />
          </div>

          {/* Animated Orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-1/4 top-1/3 h-72 w-72 animate-pulse-slow rounded-full bg-accent/20 blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/3 h-56 w-56 animate-pulse-slow rounded-full bg-accent-light/15 blur-[80px]" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center px-6 py-32 lg:px-8">
            <div className="max-w-2xl">
              <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-border-dark bg-surface-dark-card px-4 py-2 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-whatsapp"></span>
                </span>
                <span className="tracking-elegant text-xs font-medium uppercase text-body-on-dark">We're Online Now</span>
              </div>

              <h1 className="reveal mb-6 text-4xl font-semibold leading-tight tracking-tight text-heading-on-dark sm:text-5xl lg:text-6xl">
                Let's Start Your
                <br />
                <span className="text-gradient-gold">
                  Property Journey
                </span>
              </h1>

              <p className="reveal mb-8 max-w-xl text-lg leading-relaxed text-body-on-dark">
                Whether you want to rent, buy, list or refer a property — we're just a message away.
                Reach out and our team will respond within hours.
              </p>

              {/* Quick Contact Methods */}
              <div className="reveal flex flex-wrap gap-3">
                <a
                  href="https://wa.me/919257533440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-surface-dark shadow-lg transition-all hover:bg-whatsapp-dark hover:shadow-xl"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href="tel:+918306034440"
                  className="inline-flex items-center gap-2 rounded-full border border-border-dark bg-surface-dark-card px-6 py-3 font-semibold text-heading-on-dark backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Cards */}
        <section className="relative -mt-16 z-10 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              {contactMethods.map((method, i) => {
                const colors = getColorClasses(method.colorClass);
                return (
                  <a
                    key={i}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`reveal-stagger card-hover group relative overflow-hidden rounded-2xl border bg-surface-card p-6 shadow-elevated transition-all duration-300 ${colors.border} ${colors.hover}`}
                    style={{ "--stagger": `${i * 100}ms` }}
                  >
                    {method.badge && (
                      <div className="absolute right-4 top-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.bgLight} ${colors.text}`}>
                          {method.badge}
                        </span>
                      </div>
                    )}
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} text-white shadow-lg ${colors.shadow}`}>
                      {method.icon}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-heading">{method.title}</h3>
                    <p className="mb-2 text-sm text-muted">{method.description}</p>
                    <p className={`font-semibold ${colors.text}`}>{method.value}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="section-premium bg-surface-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="reveal-left">
                <div className="mb-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
                    <svg className="h-4 w-4 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">Send Enquiry</span>
                  </div>
                  <h2 className="mb-2 text-3xl font-semibold tracking-tight text-heading">
                    Tell Us What You Need
                  </h2>
                  <p className="text-body">
                    Fill out the form and we'll get back to you within hours, not days.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-heading">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-4 text-heading placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-4 focus:ring-accent-soft"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-heading">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="Your WhatsApp number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-4 text-heading placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-4 focus:ring-accent-soft"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-heading">I Want To</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['rent', 'buy', 'sell', 'refer'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, enquiryType: type })}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-all duration-300 ${
                            formData.enquiryType === type
                              ? 'border-accent bg-accent-soft text-accent-muted shadow-sm'
                              : 'border-border bg-surface-white text-muted hover:border-accent/50 hover:bg-surface'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-heading">Your Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your requirements - location, budget, property type, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full resize-none rounded-xl border border-border bg-surface-subtle px-4 py-4 text-heading placeholder-subtle transition-all duration-300 focus:border-accent focus:bg-surface-white focus:outline-none focus:ring-4 focus:ring-accent-soft"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-premium w-full rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-elevated transition-all duration-300 hover:bg-primary-hover"
                  >
                    Send via WhatsApp
                  </button>

                  <p className="text-center text-sm text-muted">
                    By submitting, you'll be redirected to WhatsApp to complete your enquiry
                  </p>
                </form>
              </div>

              {/* Right Side - Info & Map */}
              <div className="reveal-right space-y-8">
                {/* Office Info Card */}
                <div className="glass-warm overflow-hidden rounded-2xl border border-border shadow-premium">
                  <div className="p-8">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg">
                        <svg className="h-7 w-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-heading">Visit Our Office</h3>
                        <p className="text-muted">Come say hello!</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                          <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-heading">Address</p>
                          <p className="text-body">Malviya Nagar, Jaipur, Rajasthan 302017</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                          <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-heading">Working Hours</p>
                          <p className="text-body">Open 7 days a week</p>
                          <p className="text-body">9:00 AM – 9:00 PM IST</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map - Click to open in Google Maps */}
                  <a
                    href="https://maps.google.com/maps?q=DCDH+ESTATE+PVT.+LTD.&ll=26.842627,75.816661"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block h-64 w-full overflow-hidden bg-surface-subtle"
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3712.881035825226!2d75.81666179999999!3d26.842627099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db7007e650073%3A0x91be03a2d6c3245e!2sDCDH%20ESTATE%20PVT.%20LTD.%20(%20Best%20Real%20estate%20service%20company%20)%20Buy%20%7C%20Sell%20%7C%20Rent%20%7C%20Lease%7C%20Plot%20%7C%20To%20Let%20%7C%20Property%20consultant!5e1!3m2!1sen!2sin!4v1770481359066!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0, pointerEvents: 'none' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-dark/0 transition-all group-hover:bg-surface-dark/20">
                      <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition-all group-hover:opacity-100">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open in Google Maps
                      </span>
                    </div>
                  </a>
                </div>

                {/* Response Time Card */}
                <div className="rounded-2xl border border-whatsapp/30 bg-whatsapp/10 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-whatsapp shadow-lg">
                      <svg className="h-6 w-6 text-surface-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-heading">Average Response Time</h3>
                      <p className="text-body">
                        <span className="text-2xl font-semibold text-whatsapp-dark">2 Hours</span> on WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-premium bg-surface">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="reveal mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2">
                <svg className="h-4 w-4 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="tracking-elegant text-xs font-semibold uppercase text-accent-muted">FAQ</span>
              </div>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-heading">
                Frequently Asked Questions
              </h2>
              <p className="text-body">
                Quick answers to questions you might have
              </p>
              <div className="divider-elegant mx-auto mt-6 max-w-xs" />
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="reveal-stagger overflow-hidden rounded-2xl border border-border bg-surface-card shadow-soft transition-all duration-300"
                  style={{ "--stagger": `${i * 100}ms` }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-heading">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-border bg-surface-subtle px-6 py-4">
                      <p className="text-body">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-surface-dark py-16 texture-dots relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold text-heading-on-dark">Need Immediate Help?</h3>
                <p className="text-body-on-dark">Our team is available 7 days a week, 9 AM to 9 PM</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+918306034440"
                  className="btn-premium inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-surface-dark transition-all hover:bg-accent-light"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
                <a
                  href="https://wa.me/919257533440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-6 py-3 font-semibold text-whatsapp transition-all hover:bg-whatsapp/20"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
