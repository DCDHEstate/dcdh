"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ["Basic Info", "Location", "Details", "Photos", "Pricing"];

const PROPERTY_TYPES = {
  residential: [
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "independent_house", label: "Independent House" },
    { id: "builder_floor", label: "Builder Floor" },
    { id: "penthouse", label: "Penthouse" },
    { id: "studio", label: "Studio" },
  ],
  commercial: [
    { id: "office", label: "Office" },
    { id: "shop", label: "Shop" },
    { id: "showroom", label: "Showroom" },
    { id: "warehouse", label: "Warehouse" },
    { id: "coworking", label: "Co-working" },
  ],
  land: [
    { id: "plot", label: "Plot" },
    { id: "agricultural_land", label: "Agricultural Land" },
    { id: "farm_house", label: "Farm House" },
  ],
};

const AMENITY_LIST = [
  { id: "power_backup", label: "Power Backup" },
  { id: "lift", label: "Lift / Elevator" },
  { id: "gym", label: "Gym" },
  { id: "swimming_pool", label: "Swimming Pool" },
  { id: "security", label: "24x7 Security" },
  { id: "cctv", label: "CCTV" },
  { id: "garden", label: "Garden" },
  { id: "club_house", label: "Club House" },
  { id: "parking", label: "Parking" },
  { id: "visitor_parking", label: "Visitor Parking" },
  { id: "intercom", label: "Intercom" },
  { id: "fire_safety", label: "Fire Safety" },
  { id: "rainwater_harvesting", label: "Rainwater Harvesting" },
  { id: "solar_panels", label: "Solar Panels" },
  { id: "gated_society", label: "Gated Society" },
];

const AGE_OPTIONS = [
  "Under Construction",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

// ─── Initial form state ───────────────────────────────────────────────────────

const INITIAL_FORM = {
  // Step 1
  title: "",
  category: "residential",
  transactionType: "rent",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  furnishing: "",
  floorNumber: "",
  totalFloors: "",
  parkingSlots: "0",
  ageOfProperty: "",
  possessionStatus: "Ready to Move",
  // Step 2
  stateId: "",
  cityId: "",
  localityId: "",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  googleMapsUrl: "",
  // Step 3
  description: "",
  areaSqft: "",
  carpetAreaSqft: "",
  facing: "",
  availableFrom: "",
  amenities: [],
  // Step 4 – handled separately via mediaItems state
  // Step 5
  price: "",
  rentDeposit: "",
  securityDeposit: "",
  maintenanceCharge: "",
  priceNegotiable: false,
};

// ─── Step sub-components ─────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <label className="mb-2 block text-sm font-medium text-heading">
      {children}
      {required && <span className="ml-1 text-accent">*</span>}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      {children}
    </select>
  );
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-xl border border-border bg-surface-subtle px-4 py-3.5 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────

function Step1({ formData, onChange }) {
  const availableTypes = PROPERTY_TYPES[formData.category] || [];

  const handleCategory = (cat) => {
    onChange("category", cat);
    onChange("propertyType", "");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Basic Information</h2>

      {/* Title */}
      <div>
        <FieldLabel required>Property Title</FieldLabel>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g. Spacious 3BHK near Park"
          maxLength={300}
        />
      </div>

      {/* Transaction Type */}
      <div>
        <FieldLabel required>Listed For</FieldLabel>
        <div className="flex gap-3">
          {["rent", "buy"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange("transactionType", type)}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all capitalize ${
                formData.transactionType === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {type === "rent" ? "Rent" : "Sale / Buy"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <FieldLabel required>Category</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "residential", label: "Residential", icon: "🏠" },
            { id: "commercial", label: "Commercial", icon: "🏢" },
            { id: "land", label: "Land / Plot", icon: "🌳" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategory(cat.id)}
              className={`rounded-xl border p-4 text-center transition-all ${
                formData.category === cat.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="mb-1 block text-2xl">{cat.icon}</span>
              <span
                className={`text-sm font-medium ${
                  formData.category === cat.id ? "text-primary" : "text-muted"
                }`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <FieldLabel required>Property Type</FieldLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {availableTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange("propertyType", t.id)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                formData.propertyType === t.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* BHK / rooms — only for residential */}
      {formData.category === "residential" && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Bedrooms</FieldLabel>
            <Select
              value={formData.bedrooms}
              onChange={(e) => onChange("bedrooms", e.target.value)}
            >
              <option value="">—</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} BHK</option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Bathrooms</FieldLabel>
            <Select
              value={formData.bathrooms}
              onChange={(e) => onChange("bathrooms", e.target.value)}
            >
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Balconies</FieldLabel>
            <Select
              value={formData.balconies}
              onChange={(e) => onChange("balconies", e.target.value)}
            >
              <option value="">—</option>
              {[0, 1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* Furnishing */}
      <div>
        <FieldLabel>Furnishing</FieldLabel>
        <div className="flex gap-3">
          {[
            { id: "furnished", label: "Furnished" },
            { id: "semi_furnished", label: "Semi-Furnished" },
            { id: "unfurnished", label: "Unfurnished" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange("furnishing", f.id)}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all sm:text-sm ${
                formData.furnishing === f.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floor / Parking / Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Floor No.</FieldLabel>
          <Input
            type="number"
            min="0"
            value={formData.floorNumber}
            onChange={(e) => onChange("floorNumber", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
        <div>
          <FieldLabel>Total Floors</FieldLabel>
          <Input
            type="number"
            min="1"
            value={formData.totalFloors}
            onChange={(e) => onChange("totalFloors", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div>
          <FieldLabel>Parking Slots</FieldLabel>
          <Select
            value={formData.parkingSlots}
            onChange={(e) => onChange("parkingSlots", e.target.value)}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Age of Property</FieldLabel>
          <Select
            value={formData.ageOfProperty}
            onChange={(e) => onChange("ageOfProperty", e.target.value)}
          >
            <option value="">—</option>
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Possession */}
      <div>
        <FieldLabel>Possession Status</FieldLabel>
        <div className="flex gap-3">
          {["Ready to Move", "Under Construction"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange("possessionStatus", s)}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                formData.possessionStatus === s
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────

function Step2({ formData, onChange }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);

  useEffect(() => {
    fetch("/api/locations/states")
      .then((r) => r.json())
      .then((d) => setStates(d.states || []));
  }, []);

  useEffect(() => {
    if (!formData.stateId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetch(`/api/locations/cities?state_id=${formData.stateId}`)
      .then((r) => r.json())
      .then((d) => setCities(d.cities || []))
      .finally(() => setLoadingCities(false));
  }, [formData.stateId]);

  useEffect(() => {
    if (!formData.cityId) {
      setLocalities([]);
      return;
    }
    setLoadingLocalities(true);
    fetch(`/api/locations/localities?city_id=${formData.cityId}`)
      .then((r) => r.json())
      .then((d) => setLocalities(d.localities || []))
      .finally(() => setLoadingLocalities(false));
  }, [formData.cityId]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Location</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel required>State</FieldLabel>
          <Select
            value={formData.stateId}
            onChange={(e) => {
              onChange("stateId", e.target.value);
              onChange("cityId", "");
              onChange("localityId", "");
            }}
          >
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </div>

        <div>
          <FieldLabel required>City</FieldLabel>
          <Select
            value={formData.cityId}
            onChange={(e) => {
              onChange("cityId", e.target.value);
              onChange("localityId", "");
            }}
            disabled={!formData.stateId || loadingCities}
          >
            <option value="">
              {loadingCities ? "Loading..." : "Select city"}
            </option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>

        <div>
          <FieldLabel required>Locality</FieldLabel>
          <Select
            value={formData.localityId}
            onChange={(e) => onChange("localityId", e.target.value)}
            disabled={!formData.cityId || loadingLocalities}
          >
            <option value="">
              {loadingLocalities ? "Loading..." : "Select locality"}
            </option>
            {localities.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <FieldLabel required>Address Line 1</FieldLabel>
        <Input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => onChange("addressLine1", e.target.value)}
          placeholder="House / Flat / Building No., Street"
        />
      </div>

      <div>
        <FieldLabel>Address Line 2</FieldLabel>
        <Input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => onChange("addressLine2", e.target.value)}
          placeholder="Colony, Landmark (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Pincode</FieldLabel>
          <Input
            type="text"
            value={formData.pincode}
            onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit pincode"
            maxLength={6}
          />
        </div>
        <div>
          <FieldLabel>Google Maps URL</FieldLabel>
          <Input
            type="url"
            value={formData.googleMapsUrl}
            onChange={(e) => onChange("googleMapsUrl", e.target.value)}
            placeholder="Paste Google Maps link"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Details & Amenities ─────────────────────────────────────────────

function Step3({ formData, onChange }) {
  const toggleAmenity = (id) => {
    const current = formData.amenities;
    onChange(
      "amenities",
      current.includes(id) ? current.filter((a) => a !== id) : [...current, id]
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Details & Amenities</h2>

      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the property — highlights, nearby areas, special features..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Built-up Area (sq.ft)</FieldLabel>
          <Input
            type="number"
            min="1"
            value={formData.areaSqft}
            onChange={(e) => onChange("areaSqft", e.target.value)}
            placeholder="e.g. 1200"
          />
        </div>
        <div>
          <FieldLabel>Carpet Area (sq.ft)</FieldLabel>
          <Input
            type="number"
            min="1"
            value={formData.carpetAreaSqft}
            onChange={(e) => onChange("carpetAreaSqft", e.target.value)}
            placeholder="e.g. 950"
          />
        </div>
        <div>
          <FieldLabel>Facing</FieldLabel>
          <Select
            value={formData.facing}
            onChange={(e) => onChange("facing", e.target.value)}
          >
            <option value="">—</option>
            {FACING_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Available From</FieldLabel>
          <Input
            type="date"
            value={formData.availableFrom}
            onChange={(e) => onChange("availableFrom", e.target.value)}
          />
        </div>
      </div>

      <div>
        <FieldLabel>Amenities</FieldLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITY_LIST.map((a) => {
            const selected = formData.amenities.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAmenity(a.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                  selected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted hover:border-primary/50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    selected ? "border-primary bg-primary" : "border-border bg-surface-subtle"
                  }`}
                >
                  {selected && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Photos ───────────────────────────────────────────────────────────

function Step4({ mediaItems, setMediaItems }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      if (mediaItems.length + files.length > 10) {
        setError("You can upload a maximum of 10 photos.");
        return;
      }

      setError("");
      setUploading(true);

      const results = [];
      for (const file of files) {
        try {
          // 1. Get presigned URL
          const res = await fetch("/api/properties/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            }),
          });

          if (!res.ok) {
            const d = await res.json();
            setError(d.error || "Upload failed");
            continue;
          }

          const { uploadUrl, publicUrl } = await res.json();

          // 2. Upload directly to S3
          await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          results.push({
            url: publicUrl,
            isPrimary: false,
            preview: URL.createObjectURL(file),
          });
        } catch {
          setError("Failed to upload one or more files. Please try again.");
        }
      }

      setMediaItems((prev) => {
        const updated = [...prev, ...results];
        // Ensure first item is primary if none set
        if (updated.length > 0 && !updated.some((m) => m.isPrimary)) {
          updated[0].isPrimary = true;
        }
        return updated;
      });

      setUploading(false);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [mediaItems, setMediaItems]
  );

  const removeItem = (index) => {
    setMediaItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((m) => m.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const setPrimary = (index) => {
    setMediaItems((prev) =>
      prev.map((m, i) => ({ ...m, isPrimary: i === index }))
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Photos</h2>
      <p className="text-sm text-muted">
        Upload up to 10 photos. The primary photo will be shown as the cover image.
      </p>

      {/* Upload Zone */}
      {mediaItems.length < 10 && (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface-subtle p-8 transition-all hover:border-primary/50 hover:bg-primary/5">
          {uploading ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          ) : (
            <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          <div className="text-center">
            <span className="text-sm font-medium text-primary">Click to upload photos</span>
            <p className="mt-0.5 text-xs text-muted">JPEG, PNG, WebP · Max 5MB per image</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      {/* Thumbnails */}
      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                item.isPrimary ? "border-primary" : "border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.preview}
                alt={`Photo ${index + 1}`}
                className="h-32 w-full object-cover"
              />
              {item.isPrimary && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!item.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className="rounded-lg bg-white/20 px-2 py-1 text-xs text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    Set cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="ml-auto rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-600"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mediaItems.length === 0 && !uploading && (
        <p className="text-center text-sm text-muted">
          No photos yet. Adding photos increases inquiries by 5x.
        </p>
      )}
    </div>
  );
}

// ─── Step 5: Pricing & Review ─────────────────────────────────────────────────

function Step5({ formData, onChange, mediaItems }) {
  const isRent = formData.transactionType === "rent";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Pricing</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel required>{isRent ? "Monthly Rent (₹)" : "Sale Price (₹)"}</FieldLabel>
          <Input
            type="number"
            min="1"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder={isRent ? "e.g. 25000" : "e.g. 5000000"}
          />
        </div>
        {isRent && (
          <div>
            <FieldLabel>Maintenance Charge (₹/mo)</FieldLabel>
            <Input
              type="number"
              min="0"
              value={formData.maintenanceCharge}
              onChange={(e) => onChange("maintenanceCharge", e.target.value)}
              placeholder="e.g. 2000"
            />
          </div>
        )}
        {isRent && (
          <div>
            <FieldLabel>Security Deposit (₹)</FieldLabel>
            <Input
              type="number"
              min="0"
              value={formData.securityDeposit}
              onChange={(e) => onChange("securityDeposit", e.target.value)}
              placeholder="e.g. 75000"
            />
          </div>
        )}
        {isRent && (
          <div>
            <FieldLabel>Advance Rent / Token (₹)</FieldLabel>
            <Input
              type="number"
              min="0"
              value={formData.rentDeposit}
              onChange={(e) => onChange("rentDeposit", e.target.value)}
              placeholder="e.g. 25000"
            />
          </div>
        )}
      </div>

      {/* Negotiable toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={formData.priceNegotiable}
            onChange={(e) => onChange("priceNegotiable", e.target.checked)}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-surface-subtle transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
          />
          <svg
            className="pointer-events-none absolute left-0.5 top-0.5 hidden h-4 w-4 text-white peer-checked:block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-muted">Price is negotiable</span>
      </label>

      {/* Mini summary */}
      <div className="rounded-2xl border border-border bg-surface-subtle p-5 space-y-3">
        <h3 className="text-sm font-semibold text-heading">Listing Summary</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted">Title</span>
          <span className="text-body font-medium truncate">{formData.title || "—"}</span>
          <span className="text-muted">Type</span>
          <span className="text-body capitalize">{formData.propertyType || "—"}</span>
          <span className="text-muted">Listed for</span>
          <span className="text-body capitalize">{formData.transactionType}</span>
          <span className="text-muted">Furnishing</span>
          <span className="text-body capitalize">{formData.furnishing?.replace("_", " ") || "—"}</span>
          <span className="text-muted">Photos</span>
          <span className="text-body">{mediaItems.length} uploaded</span>
          <span className="text-muted">Amenities</span>
          <span className="text-body">{formData.amenities.length} selected</span>
        </div>
      </div>

      <div className="rounded-xl border border-accent/20 bg-accent-soft/50 p-4 text-sm text-muted">
        Your listing will be reviewed by the DCDH team and go live within 24 hours.
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((label, index) => (
        <div key={label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                step > index + 1
                  ? "bg-verified text-white"
                  : step === index + 1
                  ? "bg-primary text-white"
                  : "bg-surface-subtle text-muted"
              }`}
            >
              {step > index + 1 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-1 hidden text-xs sm:block ${step >= index + 1 ? "text-heading" : "text-muted"}`}>
              {label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`mx-2 h-0.5 flex-1 transition-all ${
                step > index + 1 ? "bg-verified" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [mediaItems, setMediaItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.title.trim()) return "Please enter a property title.";
      if (!formData.propertyType) return "Please select a property type.";
    }
    if (step === 2) {
      if (!formData.stateId) return "Please select a state.";
      if (!formData.cityId) return "Please select a city.";
      if (!formData.localityId) return "Please select a locality.";
      if (!formData.addressLine1.trim()) return "Please enter the address.";
    }
    if (step === 5) {
      if (!formData.price) return "Please enter the price.";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mediaUrls: mediaItems.map((m) => ({ url: m.url, isPrimary: m.isPrimary })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to post property. Please try again.");
        return;
      }

      router.push(`/properties/${data.slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-medium tracking-elegant text-primary-soft uppercase">
              Post a Property
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-heading sm:text-3xl">
            List your property
          </h1>
          <p className="text-sm text-muted">
            Fill in the details to get your property in front of verified tenants.
          </p>
        </div>

        <ProgressBar step={step} />

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8">
          {step === 1 && <Step1 formData={formData} onChange={onChange} />}
          {step === 2 && <Step2 formData={formData} onChange={onChange} />}
          {step === 3 && <Step3 formData={formData} onChange={onChange} />}
          {step === 4 && <Step4 mediaItems={mediaItems} setMediaItems={setMediaItems} />}
          {step === 5 && <Step5 formData={formData} onChange={onChange} mediaItems={mediaItems} />}

          {error && (
            <p className="mt-4 text-xs text-red-500">{error}</p>
          )}

          {/* Navigation */}
          <div className={`mt-8 flex gap-3 ${step === 1 ? "justify-end" : "justify-between"}`}>
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                disabled={isSubmitting}
                className="rounded-xl border border-border bg-surface-white px-6 py-3.5 text-sm font-medium text-muted transition-all hover:bg-surface-subtle disabled:opacity-50"
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className="rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-premium rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Posting...
                  </span>
                ) : (
                  "Post Property"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
