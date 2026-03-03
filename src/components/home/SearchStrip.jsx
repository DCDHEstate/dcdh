'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BUDGET_OPTIONS_RENT = [
  { label: 'Any Budget', min: '', max: '' },
  { label: '5K - 10K', min: '5000', max: '10000' },
  { label: '10K - 20K', min: '10000', max: '20000' },
  { label: '20K - 50K', min: '20000', max: '50000' },
  { label: '50K+', min: '50000', max: '' },
];

const BUDGET_OPTIONS_BUY = [
  { label: 'Any Budget', min: '', max: '' },
  { label: 'Under 25L', min: '', max: '2500000' },
  { label: '25L - 50L', min: '2500000', max: '5000000' },
  { label: '50L - 1Cr', min: '5000000', max: '10000000' },
  { label: '1Cr+', min: '10000000', max: '' },
];

const PROPERTY_TYPES = {
  rent: [
    { label: 'All Types', value: '' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'House', value: 'independent_house' },
    { label: 'PG / Hostel', value: 'pg' },
  ],
  buy: [
    { label: 'All Types', value: '' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'House', value: 'independent_house' },
    { label: 'Plot', value: 'residential_plot' },
  ],
  commercial: [
    { label: 'All Types', value: '' },
    { label: 'Office', value: 'office_space' },
    { label: 'Shop', value: 'shop' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Warehouse', value: 'warehouse' },
  ],
};

const POPULAR_TAGS = [
  { label: '2 BHK', params: { bedrooms: '2' } },
  { label: '3 BHK', params: { bedrooms: '3' } },
  { label: 'Villa', params: { propertyType: 'villa' } },
  { label: 'Furnished', params: { furnishing: 'furnished' } },
  { label: 'Under 15K', params: { transactionType: 'rent', priceMax: '15000' } },
];

export default function SearchStrip() {
  const router = useRouter();
  const [searchType, setSearchType] = useState('rent');
  const [cityId, setCityId] = useState('');
  const [localityId, setLocalityId] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetIdx, setBudgetIdx] = useState(0);

  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  // Fetch states then cities on mount
  useEffect(() => {
    fetch('/api/locations/states')
      .then(r => r.json())
      .then(data => {
        const states = data.states || [];
        if (states.length === 0) return;
        // Use first active state (Rajasthan)
        const stateId = states[0].id;
        return fetch(`/api/locations/cities?state_id=${stateId}`);
      })
      .then(r => r?.json())
      .then(data => {
        if (!data) return;
        const list = data.cities || [];
        setCities(list);
        // Default to Jaipur if available
        const jaipur = list.find(c => c.name?.toLowerCase() === 'jaipur');
        if (jaipur) setCityId(jaipur.id);
        else if (list.length > 0) setCityId(list[0].id);
      })
      .catch(() => {});
  }, []);

  // Fetch localities when city changes
  useEffect(() => {
    if (!cityId) {
      setLocalities([]);
      setLocalityId('');
      return;
    }
    fetch(`/api/locations/localities?city_id=${cityId}`)
      .then(r => r.json())
      .then(data => {
        setLocalities(data.localities || []);
        setLocalityId('');
      })
      .catch(() => {});
  }, [cityId]);

  // Reset property type when tab changes
  useEffect(() => {
    setPropertyType('');
    setBudgetIdx(0);
  }, [searchType]);

  const budgetOptions = searchType === 'buy' ? BUDGET_OPTIONS_BUY : BUDGET_OPTIONS_RENT;
  const propertyTypes = PROPERTY_TYPES[searchType] || PROPERTY_TYPES.rent;

  const buildSearchUrl = (extraParams = {}) => {
    const params = new URLSearchParams();

    // Tab mapping
    if (searchType === 'commercial') {
      params.set('category', 'commercial');
    } else {
      params.set('transactionType', searchType);
    }

    if (cityId) params.set('cityId', cityId);
    if (localityId) params.set('localityId', localityId);
    if (propertyType) params.set('propertyType', propertyType);

    const budget = budgetOptions[budgetIdx];
    if (budget?.min) params.set('priceMin', budget.min);
    if (budget?.max) params.set('priceMax', budget.max);

    // Merge extra params (from popular tags)
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    return `/search?${params.toString()}`;
  };

  const handleSearch = () => {
    router.push(buildSearchUrl());
  };

  const handleTagClick = (tagParams) => {
    router.push(buildSearchUrl(tagParams));
  };

  return (
    <section className="relative z-10 -mt-32 pb-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="reveal-scale relative overflow-hidden rounded-2xl bg-white p-8 shadow-premium md:p-10">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent rounded-full" />

          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-full glass-badge p-1">
              {[
                { id: 'rent', label: 'Rent' },
                { id: 'buy', label: 'Buy' },
                { id: 'commercial', label: 'Commercial' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSearchType(tab.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    searchType === tab.id
                      ? 'bg-primary text-white shadow-sm ring-2 ring-accent/20 ring-offset-2 ring-offset-surface-white'
                      : 'text-muted hover:text-body'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Fields */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* City */}
            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">CITY</label>
              <div className="relative">
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle"
                >
                  <option value="">Select City</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Locality */}
            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">LOCALITY</label>
              <div className="relative">
                <select
                  value={localityId}
                  onChange={(e) => setLocalityId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle"
                >
                  <option value="">All Localities</option>
                  {localities.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">PROPERTY TYPE</label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle"
                >
                  {propertyTypes.map(pt => (
                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-elegant text-subtle">BUDGET</label>
              <div className="relative">
                <select
                  value={budgetIdx}
                  onChange={(e) => setBudgetIdx(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-border bg-surface-input px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary-muted focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-surface-subtle"
                >
                  {budgetOptions.map((opt, i) => (
                    <option key={i} value={i}>{opt.label}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-premium transition-all duration-300 hover:bg-primary-hover"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-border-light pt-6">
            <span className="text-xs font-medium text-subtle">Popular:</span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag.label}
                onClick={() => handleTagClick(tag.params)}
                className="rounded-full border border-border bg-surface-white px-4 py-1.5 text-xs font-medium text-muted transition-all duration-300 hover:border-accent/30 hover:bg-accent-soft/30 hover:text-body"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
