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
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2">
            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-red-600">Handpicked Properties</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Featured <span className="text-gradient">Properties</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our curated selection of premium properties. Each listing is verified and comes with instant WhatsApp enquiry.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties.map(p => (
            <div key={p.id} className="card-hover group overflow-hidden rounded-3xl border border-gray-100 bg-white">
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Tags */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg ${
                    p.type === 'Rent' ? 'bg-emerald-500' : p.type === 'Buy' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}>
                    {p.type}
                  </span>
                  {p.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  )}
                </div>

                {/* Verified Badge */}
                <div className="absolute right-4 top-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Price on Image */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">{p.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <Link href={`/property/${p.id}`} className="group/link mb-2 block">
                  <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover/link:text-red-600">
                    {p.title}
                  </h3>
                </Link>

                <p className="mb-4 flex items-center gap-1.5 text-gray-500">
                  <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {p.location}
                </p>

                {/* Property Details */}
                <div className="mb-5 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {p.area}
                  </span>
                  {p.beds && (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {p.beds} BHK
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    {p.baths} Bath
                  </span>
                </div>

                {/* CTA Button */}
                <a
                  href={`https://wa.me/918306034440?text=Hi, I'm interested in ${p.title} at ${p.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            href="/search"
            className="btn-premium inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-red-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30"
          >
            View All Properties
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
