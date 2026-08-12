'use client';

import { useState, useEffect, useRef } from 'react';
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
  { label: '2 BHK in Jaipur', params: { bedrooms: '2' } },
  { label: '3 BHK in Jaipur', params: { bedrooms: '3' } },
  { label: 'Villa', params: { propertyType: 'villa' } },
  { label: 'Furnished', params: { furnishing: 'furnished' } },
  { label: 'Under 15K', params: { transactionType: 'rent', priceMax: '15000' } },
];

const PinIcon = () => (
  <svg className="h-3 w-3 shrink-0 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s-7-6.75-7-11a7 7 0 1114 0c0 4.25-7 11-7 11z" />
    <circle cx="12" cy="10" r="2" strokeWidth={1.8} />
  </svg>
);

const SearchArrow = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

function Dropdown({ label, value, options, onChange, placeholder, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => (o.value ?? o.id) === value);
  const displayLabel = selected ? (selected.label ?? selected.name) : placeholder;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-5 sm:py-4">
      <span className="mb-1 text-[10px] font-semibold tracking-widest text-subtle">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-2 bg-transparent text-left focus:outline-none"
      >
        <span className="truncate text-sm font-medium text-body">{displayLabel}</span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-subtle transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute top-full z-50 mt-1 min-w-40 max-h-56 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {options.map(opt => {
            const optValue = opt.value ?? opt.id;
            const optLabel = opt.label ?? opt.name;
            const isSelected = optValue === value;
            return (
              <button
                key={optValue ?? optLabel}
                type="button"
                onClick={() => { onChange(optValue); setOpen(false); }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150 ${
                  isSelected
                    ? 'bg-gray-50 font-semibold text-gray-900'
                    : 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {optLabel}
                {isSelected && (
                  <svg className="h-3.5 w-3.5 shrink-0 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchStrip({ embedded = false }) {
  const router = useRouter();
  const [searchType, setSearchType] = useState('rent');
  const [cityId, setCityId] = useState('');
  const [localityId, setLocalityId] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetIdx, setBudgetIdx] = useState(0);

  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    fetch('/api/locations/states')
      .then(r => r.json())
      .then(data => {
        const states = data.states || [];
        if (states.length === 0) return;
        return fetch(`/api/locations/cities?state_id=${states[0].id}`);
      })
      .then(r => r?.json())
      .then(data => {
        if (!data) return;
        const list = data.cities || [];
        setCities(list);
        const jaipur = list.find(c => c.name?.toLowerCase() === 'jaipur');
        if (jaipur) setCityId(jaipur.id);
        else if (list.length > 0) setCityId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!cityId) { setLocalities([]); setLocalityId(''); return; }
    fetch(`/api/locations/localities?city_id=${cityId}`)
      .then(r => r.json())
      .then(data => { setLocalities(data.localities || []); setLocalityId(''); })
      .catch(() => {});
  }, [cityId]);

  useEffect(() => { setPropertyType(''); setBudgetIdx(0); }, [searchType]);

  const budgetOptions = searchType === 'buy' ? BUDGET_OPTIONS_BUY : BUDGET_OPTIONS_RENT;
  const propertyTypes = PROPERTY_TYPES[searchType] || PROPERTY_TYPES.rent;

  const buildSearchUrl = (extraParams = {}) => {
    const params = new URLSearchParams();
    if (searchType === 'commercial') params.set('category', 'commercial');
    else params.set('transactionType', searchType);
    if (cityId) params.set('cityId', cityId);
    if (localityId) params.set('localityId', localityId);
    if (propertyType) params.set('propertyType', propertyType);
    const budget = budgetOptions[budgetIdx];
    if (budget?.min) params.set('priceMin', budget.min);
    if (budget?.max) params.set('priceMax', budget.max);
    Object.entries(extraParams).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/search?${params.toString()}`;
  };

  const handleSearch = () => router.push(buildSearchUrl());
  const handleTagClick = (tagParams) => router.push(buildSearchUrl(tagParams));

  const TABS = [
    { id: 'rent', label: 'RENT' },
    { id: 'buy', label: 'BUY' },
    { id: 'commercial', label: 'COMMERCIAL' },
  ];

  const budgetDropdownOptions = budgetOptions.map((opt, i) => ({ value: String(i), label: opt.label }));

  const dropdownProps = {
    city: { label: 'CITY', value: cityId, options: cities, onChange: setCityId, placeholder: 'Select City' },
    locality: { label: 'LOCALITY', value: localityId, options: [{ id: '', name: 'All Localities' }, ...localities], onChange: setLocalityId, placeholder: 'All Localities' },
    propertyType: { label: 'PROPERTY TYPE', value: propertyType, options: propertyTypes, onChange: setPropertyType, placeholder: 'All Types' },
    budget: { label: 'BUDGET', value: String(budgetIdx), options: budgetDropdownOptions, onChange: (v) => setBudgetIdx(Number(v)), placeholder: 'Any Budget' },
  };

  return (
    <section className={`relative z-10 ${embedded ? 'pb-12 pt-4' : '-mt-32 pb-16'}`}>
      <div className={`mx-auto px-4 ${embedded ? 'max-w-6xl' : 'max-w-5xl'}`}>

        {/* Tabs */}
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSearchType(tab.id)}
              className={`rounded-t-xl px-4 sm:px-7 py-2.5 text-[10px] font-semibold tracking-widest transition-colors duration-200 ${
                searchType === tab.id
                  ? 'bg-white text-gray-900 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]'
                  : 'bg-gray-300/80 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="reveal-scale overflow-visible rounded-b-2xl rounded-tr-2xl bg-white shadow-premium">

          {/* Mobile layout: 1×4 stack + full-width search button */}
          <div className="sm:hidden">
            <div className="flex flex-col divide-y divide-border-light">
              <Dropdown {...dropdownProps.city} align="left" />
              <Dropdown {...dropdownProps.locality} align="left" />
              <Dropdown {...dropdownProps.propertyType} align="left" />
              <Dropdown {...dropdownProps.budget} align="left" />
            </div>
            <button
              onClick={handleSearch}
              className="flex w-full items-center justify-center gap-2 border-t border-border-light py-4 text-sm font-semibold rounded-b-2xl transition-opacity duration-200 active:opacity-70"
              style={{ backgroundColor: '#e8a87c', color: '#5a2d0c' }}
            >
              Search
              <SearchArrow />
            </button>
          </div>

          {/* Desktop layout: horizontal flex row */}
          <div className="hidden sm:flex sm:items-stretch sm:divide-x sm:divide-border-light overflow-visible rounded-b-2xl rounded-tr-2xl">
            <Dropdown {...dropdownProps.city} align="left" />
            <Dropdown {...dropdownProps.locality} align="left" />
            <Dropdown {...dropdownProps.propertyType} align="left" />
            <Dropdown {...dropdownProps.budget} align="right" />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 self-stretch rounded-br-2xl rounded-tr-2xl px-8 text-sm font-semibold transition-opacity duration-200 hover:opacity-80"
              style={{ backgroundColor: '#e8a87c', color: '#5a2d0c' }}
            >
              Search
              <SearchArrow />
            </button>
          </div>

          {/* Popular tags row */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border-light bg-gray-50 px-4 sm:px-5 py-3 rounded-b-2xl">
            <span className="text-[10px] font-semibold tracking-widest text-subtle">POPULAR:</span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag.label}
                onClick={() => handleTagClick(tag.params)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-medium text-muted transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-body"
              >
                <PinIcon />
                {tag.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
