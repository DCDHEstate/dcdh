"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SavePropertyButton from "@/components/SavePropertyButton";
import { formatPrice } from "@/lib/propertyOptions";

const PROPERTY_TYPES = {
  residential: [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "independent_house", label: "Independent House" },
    { value: "builder_floor", label: "Builder Floor" },
    { value: "penthouse", label: "Penthouse" },
    { value: "studio", label: "Studio" },
    { value: "1rk", label: "1 RK" },
  ],
  commercial: [
    { value: "office", label: "Office" },
    { value: "shop", label: "Shop" },
    { value: "showroom", label: "Showroom" },
    { value: "warehouse", label: "Warehouse" },
    { value: "coworking", label: "Coworking" },
  ],
  land: [
    { value: "plot", label: "Plot" },
    { value: "agricultural_land", label: "Agricultural Land" },
    { value: "farm_house", label: "Farm House" },
  ],
};

const ALL_PROPERTY_TYPES = [
  ...PROPERTY_TYPES.residential,
  ...PROPERTY_TYPES.commercial,
  ...PROPERTY_TYPES.land,
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];


function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter state
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    transactionType: searchParams.get("transactionType") || "",
    category: searchParams.get("category") || "",
    propertyType: searchParams.get("propertyType") || "",
    cityId: searchParams.get("cityId") || "",
    localityId: searchParams.get("localityId") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    furnishing: searchParams.get("furnishing") || "",
  });
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  // Data state
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const limit = 12;

  // Fetch cities on mount
  useEffect(() => {
    fetch("/api/locations/states")
      .then((r) => r.json())
      .then((data) => {
        if (data.states?.length > 0) {
          const stateId = data.states[0].id;
          return fetch(`/api/locations/cities?state_id=${stateId}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data?.cities) setCities(data.cities);
      })
      .catch(() => {});
  }, []);

  // Fetch localities when city changes
  useEffect(() => {
    if (!filters.cityId) {
      setLocalities([]);
      return;
    }
    fetch(`/api/locations/localities?city_id=${filters.cityId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.localities) setLocalities(data.localities);
      })
      .catch(() => {});
  }, [filters.cityId]);

  // Sync URL with filters
  const syncUrl = useCallback(
    (newFilters, newSort, newPage) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      if (newSort && newSort !== "newest") params.set("sort", newSort);
      if (newPage > 1) params.set("page", newPage);
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `/search?${qs}` : "/search");
    },
    []
  );

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page, limit });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (sort) params.set("sort", sort);

    try {
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } catch {
      setProperties([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => {
    fetchProperties();
    syncUrl(filters, sort, page);
  }, [fetchProperties, syncUrl, filters, sort, page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Reset dependent filters
      if (key === "category") next.propertyType = "";
      if (key === "cityId") next.localityId = "";
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      q: "", transactionType: "", category: "", propertyType: "",
      cityId: "", localityId: "", bedrooms: "", priceMin: "", priceMax: "", furnishing: "",
    });
    setSort("newest");
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const totalPages = Math.ceil(total / limit);

  // Property types filtered by category
  const availablePropertyTypes = filters.category
    ? PROPERTY_TYPES[filters.category] || []
    : ALL_PROPERTY_TYPES;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">
            Find Properties
          </h1>
          <p className="mt-1 text-sm text-muted">
            Browse verified properties in Jaipur. Zero brokerage.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm font-medium text-body shadow-soft transition hover:border-accent/30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort (mobile) */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-xl border border-border bg-surface-white px-3 py-2.5 text-sm text-body focus:border-accent focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* ── FILTER SIDEBAR (Desktop) ── */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              cities={cities}
              localities={localities}
              availablePropertyTypes={availablePropertyTypes}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* ── RESULTS ── */}
          <div className="min-w-0 flex-1">
            {/* Results Header (Desktop) */}
            <div className="mb-5 hidden items-center justify-between lg:flex">
              <p className="text-sm text-muted">
                {isLoading ? "Searching..." : `${total} ${total === 1 ? "property" : "properties"} found`}
              </p>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="rounded-xl border border-border bg-surface-white px-4 py-2 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Results Count (Mobile) */}
            <p className="mb-4 text-sm text-muted lg:hidden">
              {isLoading ? "Searching..." : `${total} ${total === 1 ? "property" : "properties"} found`}
            </p>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface-white">
                    <div className="h-48 bg-surface-subtle" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-3/4 rounded bg-surface-subtle" />
                      <div className="h-3 w-1/2 rounded bg-surface-subtle" />
                      <div className="h-3 w-2/3 rounded bg-surface-subtle" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-white py-20 text-center">
                <svg className="mb-4 h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <h3 className="text-lg font-semibold text-heading">No properties found</h3>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Try adjusting your filters or search for a different area.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Property Grid */
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-xl border border-border bg-surface-white px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-xl border border-border bg-surface-white px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-subtle disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER OVERLAY ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface-white p-6 shadow-premium">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-heading">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-muted hover:bg-surface-subtle"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              cities={cities}
              localities={localities}
              availablePropertyTypes={availablePropertyTypes}
              activeFilterCount={activeFilterCount}
            />

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              Show {total} {total === 1 ? "Property" : "Properties"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Filter Panel ──

function FilterPanel({ filters, updateFilter, clearFilters, cities, localities, availablePropertyTypes, activeFilterCount }) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">SEARCH</label>
        <input
          type="text"
          placeholder="Search by title or keyword..."
          value={filters.q}
          onChange={(e) => updateFilter("q", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Transaction Type */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">LOOKING TO</label>
        <div className="flex gap-2">
          {[
            { value: "", label: "All" },
            { value: "rent", label: "Rent" },
            { value: "buy", label: "Buy" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("transactionType", opt.value)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                filters.transactionType === opt.value
                  ? "bg-accent-soft text-accent-dark"
                  : "border border-border text-muted hover:bg-surface-subtle"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">CATEGORY</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "All" },
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial" },
            { value: "land", label: "Land" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("category", opt.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                filters.category === opt.value
                  ? "bg-accent-soft text-accent-dark"
                  : "border border-border text-muted hover:bg-surface-subtle"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">PROPERTY TYPE</label>
        <select
          value={filters.propertyType}
          onChange={(e) => updateFilter("propertyType", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">All Types</option>
          {availablePropertyTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">CITY</label>
        <select
          value={filters.cityId}
          onChange={(e) => updateFilter("cityId", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Locality */}
      {filters.cityId && localities.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">LOCALITY</label>
          <select
            value={filters.localityId}
            onChange={(e) => updateFilter("localityId", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-white px-4 py-2.5 text-sm text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All Localities</option>
            {localities.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Bedrooms */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">BEDROOMS</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "Any" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5+" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("bedrooms", opt.value)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                filters.bedrooms === opt.value
                  ? "bg-accent-soft text-accent-dark"
                  : "border border-border text-muted hover:bg-surface-subtle"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">PRICE RANGE</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => updateFilter("priceMin", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-white px-3 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="flex items-center text-sm text-faint">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => updateFilter("priceMax", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-white px-3 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-subtle">FURNISHING</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "Any" },
            { value: "furnished", label: "Furnished" },
            { value: "semi_furnished", label: "Semi" },
            { value: "unfurnished", label: "Unfurnished" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("furnishing", opt.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                filters.furnishing === opt.value
                  ? "bg-accent-soft text-accent-dark"
                  : "border border-border text-muted hover:bg-surface-subtle"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

// ── Property Card ──

function PropertyCard({ property: p }) {
  const transactionLabel = p.transaction_type === "rent" ? "Rent" : "Buy";
  const priceLabel =
    p.transaction_type === "rent"
      ? `${formatPrice(p.price, p.currency, { compact: false })}/mo`
      : formatPrice(p.price, p.currency);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft transition-all hover:border-accent/20 hover:shadow-elevated">
      <Link href={`/properties/${p.slug}`} className="absolute inset-0 z-1" aria-label={p.title} />
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-surface-subtle">
        {p.primary_image ? (
          <img
            src={p.primary_image}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {transactionLabel}
          </span>
        </div>

        {/* Save button */}
        <div className="absolute right-3 top-3 z-10">
          <SavePropertyButton
            propertyId={p.id}
            className="h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
          />
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/50 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            {priceLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="line-clamp-1 text-sm font-semibold text-heading">
          {p.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {p.locality_name}, {p.city_name}
        </p>

        {/* Specs */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border-light pt-3 text-xs text-muted">
          {p.bedrooms && (
            <span>{p.bedrooms} BHK</span>
          )}
          {p.bathrooms && (
            <span>{p.bathrooms} Bath</span>
          )}
          {p.area_sqft && (
            <span>{Number(p.area_sqft).toLocaleString("en-IN")} sqft</span>
          )}
          {p.furnishing && (
            <span className="capitalize">{p.furnishing.replace("_", " ")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Wrapper with Suspense ──

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6">
            <div className="h-8 w-48 animate-pulse rounded bg-surface-subtle" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface-subtle" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-surface-subtle" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
