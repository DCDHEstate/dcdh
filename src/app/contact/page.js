'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const contactMethods = [
  {
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    title: 'WhatsApp',
    description: 'Chat with us instantly',
    value: '+91 83060 34440',
    href: 'https://wa.me/918306034440',
    color: 'green',
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
    color: 'blue',
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
    color: 'red',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Hi, I'm ${formData.name}.\n\nEnquiry Type: ${formData.enquiryType}\nPhone: ${formData.phone}\n\n${formData.message}`;
    window.open(`https://wa.me/918306034440?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'bg-green-500',
        bgLight: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:border-green-300',
        shadow: 'shadow-green-500/20',
      },
      blue: {
        bg: 'bg-blue-500',
        bgLight: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:border-blue-300',
        shadow: 'shadow-blue-500/20',
      },
      red: {
        bg: 'bg-red-500',
        bgLight: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
        hover: 'hover:border-red-300',
        shadow: 'shadow-red-500/20',
      },
    };
    return colors[color] || colors.red;
  };

  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section - Split Design */}
        <section className="relative min-h-[60vh] overflow-hidden bg-gray-950">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000"
              alt="Contact"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/50" />
          </div>

          {/* Animated Orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-1/4 top-1/3 h-72 w-72 animate-pulse rounded-full bg-red-500/20 blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/3 h-56 w-56 animate-pulse rounded-full bg-orange-500/15 blur-[80px]" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center px-6 py-32 lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-300">We're Online Now</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let's Start Your
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Property Journey
                </span>
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-400">
                Whether you want to rent, buy, list or refer a property — we're just a message away.
                Reach out and our team will respond within hours.
              </p>

              {/* Quick Contact Methods */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/918306034440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-600 hover:shadow-xl"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href="tel:+918306034440"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                const colors = getColorClasses(method.color);
                return (
                  <a
                    key={i}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${colors.border} ${colors.hover}`}
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
                    <h3 className="mb-1 text-lg font-bold text-gray-900">{method.title}</h3>
                    <p className="mb-2 text-sm text-gray-500">{method.description}</p>
                    <p className={`font-semibold ${colors.text}`}>{method.value}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2">
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-semibold text-red-600">Send Enquiry</span>
                  </div>
                  <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
                    Tell Us What You Need
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form and we'll get back to you within hours, not days.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="Your WhatsApp number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">I Want To</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['rent', 'buy', 'sell', 'refer'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, enquiryType: type })}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-all duration-300 ${
                            formData.enquiryType === type
                              ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Your Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your requirements - location, budget, property type, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30"
                  >
                    Send via WhatsApp
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    By submitting, you'll be redirected to WhatsApp to complete your enquiry
                  </p>
                </form>
              </div>

              {/* Right Side - Info & Map */}
              <div className="space-y-8">
                {/* Office Info Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <div className="p-8">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Visit Our Office</h3>
                        <p className="text-gray-500">Come say hello!</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600">Malviya Nagar, Jaipur, Rajasthan 302017</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Working Hours</p>
                          <p className="text-gray-600">Open 7 days a week</p>
                          <p className="text-gray-600">9:00 AM – 9:00 PM IST</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="h-64 w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6088673825825!2d75.7831!3d26.8533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUxJzEyLjAiTiA3NcKwNDYnNTkuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale transition-all duration-500 hover:grayscale-0"
                    />
                  </div>
                </div>

                {/* Response Time Card */}
                <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg shadow-green-500/25">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Average Response Time</h3>
                      <p className="text-gray-600">
                        <span className="text-2xl font-bold text-green-600">2 Hours</span> on WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">FAQ</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to questions you might have
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gray-950 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Need Immediate Help?</h3>
                <p className="text-gray-400">Our team is available 7 days a week, 9 AM to 9 PM</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+918306034440"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100"
                >
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
                <a
                  href="https://wa.me/918306034440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600"
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
