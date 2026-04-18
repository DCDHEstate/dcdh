"use client";

import { useState, useEffect } from "react";
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

// ─── Shared field components ──────────────────────────────────────────────────

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

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ formData, onChange }) {
  const availableTypes = PROPERTY_TYPES[formData.category] || [];

  const handleCategory = (cat) => {
    onChange("category", cat);
    onChange("propertyType", "");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Basic Information</h2>

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
              <span className={`text-sm font-medium ${formData.category === cat.id ? "text-primary" : "text-muted"}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

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

      {formData.category === "residential" && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Bedrooms</FieldLabel>
            <Select value={formData.bedrooms} onChange={(e) => onChange("bedrooms", e.target.value)}>
              <option value="">—</option>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} BHK</option>)}
            </Select>
          </div>
          <div>
            <FieldLabel>Bathrooms</FieldLabel>
            <Select value={formData.bathrooms} onChange={(e) => onChange("bathrooms", e.target.value)}>
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          </div>
          <div>
            <FieldLabel>Balconies</FieldLabel>
            <Select value={formData.balconies} onChange={(e) => onChange("balconies", e.target.value)}>
              <option value="">—</option>
              {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Floor No.</FieldLabel>
          <Input type="number" min="0" value={formData.floorNumber} onChange={(e) => onChange("floorNumber", e.target.value)} placeholder="e.g. 3" />
        </div>
        <div>
          <FieldLabel>Total Floors</FieldLabel>
          <Input type="number" min="1" value={formData.totalFloors} onChange={(e) => onChange("totalFloors", e.target.value)} placeholder="e.g. 10" />
        </div>
        <div>
          <FieldLabel>Parking Slots</FieldLabel>
          <Select value={formData.parkingSlots} onChange={(e) => onChange("parkingSlots", e.target.value)}>
            {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel>Age of Property</FieldLabel>
          <Select value={formData.ageOfProperty} onChange={(e) => onChange("ageOfProperty", e.target.value)}>
            <option value="">—</option>
            {AGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
        </div>
      </div>

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

// ─── Step 2 ───────────────────────────────────────────────────────────────────

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
    if (!formData.stateId) { setCities([]); return; }
    setLoadingCities(true);
    fetch(`/api/locations/cities?state_id=${formData.stateId}`)
      .then((r) => r.json())
      .then((d) => setCities(d.cities || []))
      .finally(() => setLoadingCities(false));
  }, [formData.stateId]);

  useEffect(() => {
    if (!formData.cityId) { setLocalities([]); return; }
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
            onChange={(e) => { onChange("stateId", e.target.value); onChange("cityId", ""); onChange("localityId", ""); }}
          >
            <option value="">Select state</option>
            {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel required>City</FieldLabel>
          <Select
            value={formData.cityId}
            onChange={(e) => { onChange("cityId", e.target.value); onChange("localityId", ""); }}
            disabled={!formData.stateId || loadingCities}
          >
            <option value="">{loadingCities ? "Loading..." : "Select city"}</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel required>Locality</FieldLabel>
          <Select
            value={formData.localityId}
            onChange={(e) => onChange("localityId", e.target.value)}
            disabled={!formData.cityId || loadingLocalities}
          >
            <option value="">{loadingLocalities ? "Loading..." : "Select locality"}</option>
            {localities.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <FieldLabel required>Address Line 1</FieldLabel>
        <Input type="text" value={formData.addressLine1} onChange={(e) => onChange("addressLine1", e.target.value)} placeholder="House / Flat / Building No., Street" />
      </div>
      <div>
        <FieldLabel>Address Line 2</FieldLabel>
        <Input type="text" value={formData.addressLine2} onChange={(e) => onChange("addressLine2", e.target.value)} placeholder="Colony, Landmark (optional)" />
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
          <Input type="url" value={formData.googleMapsUrl} onChange={(e) => onChange("googleMapsUrl", e.target.value)} placeholder="Paste Google Maps link" />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ formData, onChange }) {
  const toggleAmenity = (id) => {
    const current = formData.amenities;
    onChange("amenities", current.includes(id) ? current.filter((a) => a !== id) : [...current, id]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Details & Amenities</h2>

      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the property..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Built-up Area (sq.ft)</FieldLabel>
          <Input type="number" min="1" value={formData.areaSqft} onChange={(e) => onChange("areaSqft", e.target.value)} placeholder="e.g. 1200" />
        </div>
        <div>
          <FieldLabel>Carpet Area (sq.ft)</FieldLabel>
          <Input type="number" min="1" value={formData.carpetAreaSqft} onChange={(e) => onChange("carpetAreaSqft", e.target.value)} placeholder="e.g. 950" />
        </div>
        <div>
          <FieldLabel>Facing</FieldLabel>
          <Select value={formData.facing} onChange={(e) => onChange("facing", e.target.value)}>
            <option value="">—</option>
            {FACING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel>Available From</FieldLabel>
          <Input type="date" value={formData.availableFrom} onChange={(e) => onChange("availableFrom", e.target.value)} />
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
                  selected ? "border-primary bg-primary/5 text-primary" : "border-border text-muted hover:border-primary/50"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${selected ? "border-primary bg-primary" : "border-border bg-surface-subtle"}`}>
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

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function Step4({ mediaItems, setMediaItems, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const coverItem = mediaItems.find((m) => m.isPrimary) || null;
  const otherItems = mediaItems.filter((m) => !m.isPrimary);

  const setUploadState = (val) => {
    setUploading(val);
    onUploadingChange?.(val);
  };

  const uploadFiles = async (files, isPrimary) => {
    setUploadState(true);
    setError("");
    const results = [];
    try {
      for (const file of files) {
        try {
          const res = await fetch("/api/properties/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size }),
          });
          if (!res.ok) { const d = await res.json(); setError(d.error || "Upload failed"); continue; }
          const { uploadUrl, uploadFields, publicUrl } = await res.json();
          const fd = new FormData();
          Object.entries(uploadFields).forEach(([k, v]) => fd.append(k, v));
          fd.append("file", file);
          const uploadRes = await fetch(uploadUrl, { method: "POST", body: fd });
          if (!uploadRes.ok && uploadRes.status !== 0 && uploadRes.status !== 204) {
            throw new Error(`Upload failed: ${uploadRes.status}`);
          }
          results.push({
            url: publicUrl,
            isPrimary,
            preview: URL.createObjectURL(file),
            mediaType: file.type.startsWith("video/") ? "video" : "image",
          });
        } catch {
          setError("Failed to upload one or more files. Please try again.");
        }
      }
    } finally {
      setUploadState(false);
    }
    return results;
  };

  const handleCoverSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const results = await uploadFiles([file], true);
    if (results.length > 0) {
      setMediaItems((prev) => [results[0], ...prev.filter((m) => !m.isPrimary)]);
    }
    e.target.value = "";
  };

  const handleOtherSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (otherItems.length + files.length > 9) {
      setError("You can add at most 9 additional photos / videos.");
      return;
    }
    const results = await uploadFiles(files, false);
    setMediaItems((prev) => [...prev, ...results]);
    e.target.value = "";
  };

  const removeCover = () => setMediaItems((prev) => prev.filter((m) => !m.isPrimary));

  const removeOther = (otherIndex) => {
    setMediaItems((prev) => {
      const others = prev.filter((m) => !m.isPrimary);
      others.splice(otherIndex, 1);
      const cover = prev.find((m) => m.isPrimary);
      return cover ? [cover, ...others] : others;
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-heading">Photos & Videos</h2>

      {/* ── Cover Image ── */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-heading">Cover Image</h3>
        <p className="mb-3 text-xs text-muted">The main image shown on search results. Only one allowed.</p>

        {coverItem ? (
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-primary" style={{ aspectRatio: "16/9", maxWidth: "420px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverItem.preview} alt="Cover" className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">Cover</span>
            <button
              type="button"
              onClick={removeCover}
              className="absolute right-3 top-3 rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <label className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface-subtle p-8 transition-all hover:border-primary/50 hover:bg-primary/5 ${uploading ? "pointer-events-none opacity-50" : ""}`}>
            {uploading ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            ) : (
              <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <div className="text-center">
              <span className="text-sm font-medium text-primary">Upload cover image</span>
              <p className="mt-0.5 text-xs text-muted">JPEG, PNG, WebP · Max 5 MB</p>
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverSelect} disabled={uploading} />
          </label>
        )}
      </div>

      {/* ── Other Photos & Videos ── */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-heading">Other Photos & Videos</h3>
        <p className="mb-3 text-xs text-muted">Add up to 9 additional images or a walkthrough video.</p>

        {otherItems.length < 9 && (
          <label className={`mb-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface-subtle p-6 transition-all hover:border-primary/50 hover:bg-primary/5 ${uploading ? "pointer-events-none opacity-50" : ""}`}>
            {uploading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            ) : (
              <svg className="h-7 w-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
            <div className="text-center">
              <span className="text-sm font-medium text-primary">Add photos or videos</span>
              <p className="mt-0.5 text-xs text-muted">Images: JPEG, PNG, WebP · max 5 MB &nbsp;|&nbsp; Videos: MP4, WebM, MOV · max 100 MB</p>
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" multiple className="hidden" onChange={handleOtherSelect} disabled={uploading} />
          </label>
        )}

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        {otherItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {otherItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl border border-border">
                {item.mediaType === "video" ? (
                  <div className="relative flex h-32 w-full items-center justify-center bg-surface-subtle">
                    <video src={item.preview} className="h-full w-full object-cover" muted />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <svg className="h-9 w-9 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">Video</span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.preview} alt={`Photo ${index + 1}`} className="h-32 w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeOther(index)}
                  className="absolute right-2 top-2 rounded-lg bg-red-500/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────

function Step5({ formData, onChange, mediaItems }) {
  const isRent = formData.transactionType === "rent";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-heading">Pricing</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel required>{isRent ? "Monthly Rent (₹)" : "Sale Price (₹)"}</FieldLabel>
          <Input type="number" min="1" value={formData.price} onChange={(e) => onChange("price", e.target.value)} placeholder={isRent ? "e.g. 25000" : "e.g. 5000000"} />
        </div>
        {isRent && (
          <div>
            <FieldLabel>Maintenance Charge (₹/mo)</FieldLabel>
            <Input type="number" min="0" value={formData.maintenanceCharge} onChange={(e) => onChange("maintenanceCharge", e.target.value)} placeholder="e.g. 2000" />
          </div>
        )}
        {isRent && (
          <div>
            <FieldLabel>Security Deposit (₹)</FieldLabel>
            <Input type="number" min="0" value={formData.securityDeposit} onChange={(e) => onChange("securityDeposit", e.target.value)} placeholder="e.g. 75000" />
          </div>
        )}
        {isRent && (
          <div>
            <FieldLabel>Advance Rent / Token (₹)</FieldLabel>
            <Input type="number" min="0" value={formData.rentDeposit} onChange={(e) => onChange("rentDeposit", e.target.value)} placeholder="e.g. 25000" />
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={formData.priceNegotiable}
            onChange={(e) => onChange("priceNegotiable", e.target.checked)}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-surface-subtle transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
          />
          <svg className="pointer-events-none absolute left-0.5 top-0.5 hidden h-4 w-4 text-white peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-muted">Price is negotiable</span>
      </label>

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
        Saving changes will resubmit your listing for review. It will go live again within 24 hours.
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
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
              step > index + 1 ? "bg-verified text-white" : step === index + 1 ? "bg-primary text-white" : "bg-surface-subtle text-muted"
            }`}>
              {step > index + 1 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (index + 1)}
            </div>
            <span className={`mt-1 hidden text-xs sm:block ${step >= index + 1 ? "text-heading" : "text-muted"}`}>{label}</span>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`mx-2 h-0.5 flex-1 transition-all ${step > index + 1 ? "bg-verified" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EditPropertyPage({ params }) {
  const router = useRouter();
  const [slug, setSlug] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/properties/mine/${slug}`)
      .then((r) => r.json())
      .then(({ property: p }) => {
        if (!p) return;
        const amenities = Array.isArray(p.amenities) ? p.amenities : JSON.parse(p.amenities || "[]");
        setFormData({
          title: p.title || "",
          category: p.category || "residential",
          transactionType: p.transaction_type || "rent",
          propertyType: p.property_type || "",
          bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
          bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
          balconies: p.balconies != null ? String(p.balconies) : "",
          furnishing: p.furnishing || "",
          floorNumber: p.floor_number != null ? String(p.floor_number) : "",
          totalFloors: p.total_floors != null ? String(p.total_floors) : "",
          parkingSlots: p.parking_slots != null ? String(p.parking_slots) : "0",
          ageOfProperty: p.age_of_property || "",
          possessionStatus: p.possession_status || "Ready to Move",
          stateId: p.state_id || "",
          cityId: p.city_id || "",
          localityId: p.locality_id || "",
          addressLine1: p.address_line1 || "",
          addressLine2: p.address_line2 || "",
          pincode: p.pincode || "",
          googleMapsUrl: p.google_maps_url || "",
          description: p.description || "",
          areaSqft: p.area_sqft != null ? String(p.area_sqft) : "",
          carpetAreaSqft: p.carpet_area_sqft != null ? String(p.carpet_area_sqft) : "",
          facing: p.facing || "",
          availableFrom: p.available_from ? p.available_from.split("T")[0] : "",
          amenities,
          price: p.price != null ? String(p.price) : "",
          rentDeposit: p.rent_deposit != null ? String(p.rent_deposit) : "",
          securityDeposit: p.security_deposit != null ? String(p.security_deposit) : "",
          maintenanceCharge: p.maintenance_charge != null ? String(p.maintenance_charge) : "",
          priceNegotiable: p.price_negotiable || false,
        });
        const media = p.media || [];
        setMediaItems(media.map((m) => ({ url: m.media_url, isPrimary: m.is_primary, preview: m.media_url, mediaType: m.media_type || "image" })));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [slug]);

  const onChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

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
    if (err) { setError(err); return; }
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/properties/mine/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mediaUrls: mediaItems.map((m) => ({ url: m.url, isPrimary: m.isPrimary, mediaType: m.mediaType || "image" })),
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save changes. Please try again."); return; }

      router.push(`/dashboard/owner/properties/${slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-subtle" />
          <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface-white" />
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-surface px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface-white p-12 text-center">
          <p className="text-sm text-muted">Property not found or you don&apos;t have permission to edit it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-medium tracking-elegant text-primary-soft uppercase">Edit Property</span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-heading sm:text-3xl">Update your listing</h1>
          <p className="text-sm text-muted">Changes will be reviewed and go live within 24 hours.</p>
        </div>

        <ProgressBar step={step} />

        <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8">
          {step === 1 && <Step1 formData={formData} onChange={onChange} />}
          {step === 2 && <Step2 formData={formData} onChange={onChange} />}
          {step === 3 && <Step3 formData={formData} onChange={onChange} />}
          {step === 4 && <Step4 mediaItems={mediaItems} setMediaItems={setMediaItems} onUploadingChange={setIsUploading} />}
          {step === 5 && <Step5 formData={formData} onChange={onChange} mediaItems={mediaItems} />}

          {error && <p className="mt-4 text-xs text-red-500">{error}</p>}

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
                disabled={isUploading}
                className="rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Uploading...
                  </span>
                ) : "Continue"}
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
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
